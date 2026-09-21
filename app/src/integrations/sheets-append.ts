// Запис ліда рядком у Google-таблицю. Перенесено з n8n-воркфлоу «Leads → Google Sheets»
// (2024), приведено до конвенцій проєкту без зміни поведінки.
import { readEnv } from "../core/config.js";
import { postJson } from "../core/http.js";
import { log } from "../core/log.js";
import { isRecord, isString, parseJson } from "../core/parse.js";
import type { Integration, Lead, Result } from "../core/types.js";

interface SheetsResponse {
  status: string;
}

const isSheetsResponse = (value: unknown): value is SheetsResponse =>
  isRecord(value) && isString(value.status);

const sheetsAppend: Integration = {
  name: "sheets-append",
  requiredEnv: ["SHEETS_WEBHOOK_URL", "SHEETS_TOKEN"],

  async send(lead: Lead): Promise<Result<void>> {
    const webhookUrl = readEnv("SHEETS_WEBHOOK_URL");
    if (!webhookUrl.ok) return webhookUrl;

    const token = readEnv("SHEETS_TOKEN");
    if (!token.ok) return token;

    const url = `${webhookUrl.value}?token=${token.value}`;
    // `retries: 0` навмисно, на відміну від slack-notify з типовими двома повторами.
    // append не ідемпотентний: якщо таблиця опрацювала запит і лише потім віддала
    // 5xx, повтор додасть той самий рядок удруге — а дублікати в таблиці обліку це
    // рівно той збій, з якого почалась історія цього проєкту. Сповіщення можна
    // продублювати без наслідків, рядок у системі обліку — ні.
    // Це ще й повертає поведінку спадкового коду: до рефакторингу тут був голий
    // fetch, тобто рівно одна спроба.
    const response = await postJson(
      url,
      { values: [[lead.createdAt, lead.name, lead.email, lead.phone ?? "", lead.source]] },
      { retries: 0 },
    );
    if (!response.ok) {
      log.error(`sheets-append: lead ${lead.id} not delivered: ${response.error}`);
      return response;
    }

    const data = parseJson(response.value, isSheetsResponse, "sheets-append");
    if (!data.ok) {
      log.error(`sheets-append: lead ${lead.id} not delivered: ${data.error}`);
      return data;
    }

    if (data.value.status !== "ok") {
      log.error(`sheets-append failed: ${url} -> ${data.value.status}`);
      return { ok: false, error: `sheets error: ${data.value.status}` };
    }

    log.info(`sheets-append: row added for lead ${lead.id}`);
    return { ok: true, value: undefined };
  },
};

export default sheetsAppend;
