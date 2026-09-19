---
description: Створює нову інтеграцію за архітектурою проєкту: модуль, тест, рядки в реєстрі — без змін у core і без нових залежностей
argument-hint: <назва сервісу, напр. telegram-notify>
---

# Generate integration

**Ціль:** $ARGUMENTS
(Якщо в рядку вище немає назви сервісу — ціль вказана в повідомленні одразу після
назви команди. Немає й там — спитай і зупинись.)

## Кроки

1. Прочитай зразок `app/src/integrations/slack-notify.ts` і його тест, контракт
   `Integration` в `app/src/core/types.ts` і реєстр
   `app/src/integrations/index.ts`. Правила — `architecture` і `conventions` у
   `.claude/rules/`.
2. Визнач `<kebab-name>` з назви сервісу і які змінні середовища йому потрібні
   (лише імена).
3. Створи `app/src/integrations/<kebab-name>.ts` — **іменований** експорт об'єкта
   `Integration`: `name`, `requiredEnv`, `send(lead): Promise<Result<void>>`.
   HTTP — через `postJson`, змінні — через `readEnv`, журнал — через `log`.
4. Створи `app/src/integrations/<kebab-name>.test.ts` — три випадки: успішна
   відправка (перевір URL і тіло), відсутня змінна середовища, помилка від
   зовнішньої системи. Мережі немає: `vi.stubGlobal("fetch", ...)`, `vi.stubEnv`.
5. Додай у `app/src/integrations/index.ts` **два рядки**: `import` і елемент
   масиву `integrations`.
6. Перевір: `cd app && npm test && npm run typecheck && npm run check:rules`.

## Acceptance criteria

- [ ] Створено рівно два нові файли + два рядки в `index.ts`; більше нічого.
- [ ] `name` збігається з іменем файлу; `requiredEnv` заповнено іменами змінних.
- [ ] Якщо це сповіщення (Slack, месенджер) — у тілі запиту немає `lead.email` і
      `lead.phone`, і є тест, який це стверджує.
- [ ] `npm test` зелений, три нові тести проходять; `npm run typecheck` чистий.
- [ ] `check:rules`: `TOTAL` не зріс, нових рядків у секції `by file` немає.
- [ ] `git status --short` не показує змін у `app/src/core/**`, `app/scripts/**`,
      `materials/**`.

## Stop

- `core/` не чіпати. Бракує функції чи поля в типі — зупинись і дай звіт за
  правилом `do-not-touch`.
- Нових залежностей не додавати — ні в `dependencies`, ні в `devDependencies`.
- Реального ендпоінта й секретів не вигадувати: URL береться зі змінної
  середовища, у тестах — `*.example.test` і ключі з префіксом `fake`.
- У підсумку покажи список створених файлів, діф `index.ts` і числа
  `npm test` / `check:rules` до і після.
