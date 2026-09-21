import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { log } from "../core/log.js";
import type { Lead } from "../core/types.js";
import sheetsAppend from "./sheets-append.js";

const lead: Lead = {
  id: "ld_0002",
  name: "Андрій Тестовий",
  email: "andrii@studio-nova.example.test",
  source: "instagram",
  createdAt: "2026-09-10T09:30:00.000Z",
};

beforeEach(() => {
  vi.stubEnv("SHEETS_WEBHOOK_URL", "https://sheets.example.test/append");
  vi.stubEnv("SHEETS_TOKEN", "fake-sheets-token-0000");
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sheets-append", () => {
  it("додає рядок у таблицю і повертає ok", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{"status":"ok"}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sheetsAppend.send(lead)).resolves.toEqual({ ok: true, value: undefined });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://sheets.example.test/append?token=fake-sheets-token-0000");
    expect(JSON.parse(String(init?.body))).toEqual({
      values: [["2026-09-10T09:30:00.000Z", "Андрій Тестовий", "andrii@studio-nova.example.test", "", "instagram"]],
    });
  });

  it("не повторює запит після 5xx — рядок не задвоюється", async () => {
    // Таблиця могла вже додати рядок і лише потім впасти. Повтор створив би дублікат,
    // тому спроба має бути рівно одна.
    const fetchMock = vi.fn(async () => new Response("upstream boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const logError = vi.spyOn(log, "error").mockImplementation(() => {});

    const result = await sheetsAppend.send(lead);

    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Невдача не мовчазна: рівно один запис у журнал через log, не через console.
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it("повертає помилку, якщо таблиця відповіла не ok", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"status":"quota_exceeded"}', { status: 200 })));

    await expect(sheetsAppend.send(lead)).resolves.toEqual({ ok: false, error: "sheets error: quota_exceeded" });
  });
});
