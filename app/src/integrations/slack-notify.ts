// Сповіщення про новий лід у Slack-канал менеджерів.
import { readEnv } from "../core/config.js";
import { postJson } from "../core/http.js";
import { log, redact } from "../core/log.js";
import type { Integration, Lead, Result } from "../core/types.js";

export function formatSlackMessage(lead: Lead): string {
  const budget = lead.budgetUsd === undefined ? "бюджет не вказано" : `бюджет $${lead.budgetUsd}`;
  return `Новий лід: ${lead.name} · ${lead.source} · ${budget}`;
}

export const slackNotify: Integration = {
  name: "slack-notify",
  requiredEnv: ["SLACK_WEBHOOK_URL"],

  async send(lead: Lead): Promise<Result<void>> {
    const webhookUrl = readEnv("SLACK_WEBHOOK_URL");
    if (!webhookUrl.ok) return webhookUrl;

    const response = await postJson(webhookUrl.value, { text: formatSlackMessage(lead) });
    if (!response.ok) {
      // URL вебхука Slack сам є секретом, а помилка postJson містить його повністю.
      const error = redact(response.error.replaceAll(webhookUrl.value, "<SLACK_WEBHOOK_URL>"));
      log.error(`slack-notify: lead ${lead.id} not delivered: ${error}`);
      return { ok: false, error };
    }

    log.info(`slack-notify: lead ${lead.id} delivered`);
    return { ok: true, value: undefined };
  },
};
