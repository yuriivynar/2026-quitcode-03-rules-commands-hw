import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Lead } from "../core/types.js";
import { formatTelegramMessage, telegramNotify } from "./telegram-notify.js";

const lead: Lead = {
  id: "ld_0003",
  name: "Олена Тестова",
  email: "olena@studio-nova.example.test",
  phone: "+380 44 000 00 00",
  source: "website",
  budgetUsd: 4200,
  createdAt: "2026-09-10T10:00:00.000Z",
};

beforeEach(() => {
  vi.stubEnv("TELEGRAM_API_URL", "https://tg.example.test");
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "fake-telegram-token-0000");
  vi.stubEnv("TELEGRAM_CHAT_ID", "-1000000000001");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("telegram-notify", () => {
  it("надсилає повідомлення в чат і повертає ok", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(telegramNotify.send(lead)).resolves.toEqual({ ok: true, value: undefined });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://tg.example.test/botfake-telegram-token-0000/sendMessage");
    expect(JSON.parse(String(init?.body))).toEqual({
      chat_id: "-1000000000001",
      text: "Новий лід: Олена Тестова · website · бюджет $4200",
    });
  });

  it("не пропускає email і телефон ліда у повідомлення", () => {
    const text = formatTelegramMessage(lead);

    expect(text).not.toContain(lead.email);
    expect(text).not.toContain("+380");
  });

  it("повертає помилку, якщо змінної середовища немає", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    // Мережі бути не повинно: якщо readEnv пропустить порожню змінну, тест впаде тут.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        throw new Error("мережу в тестах не чіпаємо");
      }),
    );

    await expect(telegramNotify.send(lead)).resolves.toEqual({
      ok: false,
      error: "missing environment variable TELEGRAM_BOT_TOKEN",
    });
  });

  it("передає причину відмови Telegram у текст помилки", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"ok":false,"description":"chat not found"}', { status: 200 })),
    );

    await expect(telegramNotify.send(lead)).resolves.toEqual({
      ok: false,
      error: "telegram error: chat not found",
    });
  });

  it("повертає загальну помилку, якщо Telegram відмовив без пояснення", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"ok":false}', { status: 200 })));

    await expect(telegramNotify.send(lead)).resolves.toEqual({
      ok: false,
      error: "telegram error: request rejected",
    });
  });
});
