import { afterEach, describe, expect, it, vi } from "vitest";
import { log } from "../core/log.js";
import type { Lead } from "../core/types.js";
import { formatSlackMessage, slackNotify } from "./slack-notify.js";

const lead: Lead = {
  id: "ld_0001",
  name: "Олена Тестова",
  email: "olena@studio-nova.example.test",
  phone: "+380 (00) 000-00-00",
  source: "website",
  budgetUsd: 4000,
  createdAt: "2026-09-10T08:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("slack-notify", () => {
  it("форматує повідомлення без email і телефону", () => {
    const text = formatSlackMessage(lead);
    expect(text).toContain("Олена Тестова");
    expect(text).not.toContain(lead.email);
    expect(text).not.toContain("+380");
  });

  it("повертає помилку, якщо не задано SLACK_WEBHOOK_URL", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "");
    await expect(slackNotify.send(lead)).resolves.toEqual({
      ok: false,
      error: "missing environment variable SLACK_WEBHOOK_URL",
    });
  });

  it("надсилає текст у вебхук", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.example.test/services/T000/B000/fake");
    vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await slackNotify.send(lead);

    expect(result.ok).toBe(true);
    const [, init] = fetchMock.mock.calls[0]!;
    expect(JSON.parse(String(init?.body))).toEqual({ text: formatSlackMessage(lead) });
  });

  it("не віддає URL вебхука ні в Result.error, ні в журнал, коли запит не вдався", async () => {
    // URL вебхука Slack сам є секретом, а помилка postJson містить його повністю.
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.example.test/services/T000/B000/fake");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("forbidden", { status: 403 })));
    const logError = vi.spyOn(log, "error").mockImplementation(() => {});
    vi.spyOn(log, "warn").mockImplementation(() => {});

    const result = await slackNotify.send(lead);

    expect(result).toEqual({ ok: false, error: "POST <SLACK_WEBHOOK_URL> failed: HTTP 403" });
    expect(logError.mock.calls.flat().join("\n")).not.toContain("T000/B000/fake");
  });
});
