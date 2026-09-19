// Сповіщення про новий лід у Telegram-чат менеджерів.
import { readEnv } from "../core/config.js";
import { postJson } from "../core/http.js";
import { log } from "../core/log.js";
import { isRecord, isString, parseJson } from "../core/parse.js";
import type { Integration, Lead, Result } from "../core/types.js";

interface TelegramResponse {
  ok: boolean;
  /** Telegram пояснює відмову тут: "chat not found", "bot was blocked by the user". */
  description?: string;
}

const isTelegramResponse = (value: unknown): value is TelegramResponse =>
  isRecord(value) &&
  typeof value.ok === "boolean" &&
  (value.description === undefined || isString(value.description));

/**
 * Мінімізація даних: у месенджер ідуть лише ім'я, джерело й бюджет — без email і телефону.
 *
 * Текст збігається з `formatSlackMessage` навмисно, і виносити спільну функцію не можна:
 * `core/` не змінюється (do-not-touch), а спільного коду поза `core/` в архітектурі
 * не існує — інтеграції не імпортують одна одну й не мають спільних тек.
 */
export function formatTelegramMessage(lead: Lead): string {
  const budget = lead.budgetUsd === undefined ? "бюджет не вказано" : `бюджет $${lead.budgetUsd}`;
  return `Новий лід: ${lead.name} · ${lead.source} · ${budget}`;
}

export const telegramNotify: Integration = {
  name: "telegram-notify",
  requiredEnv: ["TELEGRAM_API_URL", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],

  async send(lead: Lead): Promise<Result<void>> {
    const apiUrl = readEnv("TELEGRAM_API_URL");
    if (!apiUrl.ok) return apiUrl;

    const botToken = readEnv("TELEGRAM_BOT_TOKEN");
    if (!botToken.ok) return botToken;

    const chatId = readEnv("TELEGRAM_CHAT_ID");
    if (!chatId.ok) return chatId;

    const url = `${apiUrl.value}/bot${botToken.value}/sendMessage`;
    const response = await postJson(url, {
      chat_id: chatId.value,
      text: formatTelegramMessage(lead),
    });
    if (!response.ok) {
      log.error(`telegram-notify: lead ${lead.id} not delivered: ${response.error}`);
      return response;
    }

    const data = parseJson(response.value, isTelegramResponse, "telegram-notify");
    if (!data.ok) {
      log.error(`telegram-notify: lead ${lead.id} not delivered: ${data.error}`);
      return data;
    }

    if (!data.value.ok) {
      // Причину відмови не ковтаємо: без неї в журналі не видно, чи це не той чат,
      // чи бота заблокували — а мовчазна втрата діагностики вже коштувала цьому
      // проєкту нічного інциденту (див. loadState у sync/state.ts).
      const reason = data.value.description ?? "request rejected";
      log.error(`telegram-notify: lead ${lead.id} rejected by Telegram: ${reason}`);
      return { ok: false, error: `telegram error: ${reason}` };
    }

    log.info(`telegram-notify: lead ${lead.id} delivered`);
    return { ok: true, value: undefined };
  },
};
