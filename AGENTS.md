# AGENTS.md

`lead-sync` — воркер, перенесений з n8n-воркфлоу для клієнта Studio Nova. Кожні
5 хвилин бере нові заявки з форми сайту й розсилає їх в інтеграції: Slack-канал
менеджерів, Google-таблицю, далі CRM і месенджери. TypeScript, Node 22+, Vitest,
нуль runtime-залежностей.

## Команди

Усі — з теки `app/`:

| Команда | Що робить |
|---|---|
| `npm install` | встановлення (є лише devDependencies) |
| `npm test` | Vitest, зараз 7 файлів / 23 тести |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:rules` | статична перевірка конвенцій, зараз `TOTAL: 1 violation(s)` |

## Карта

```
app/src/
  core/          платформа: типи, HTTP, конфіг, парсинг, логер — ЗАХИЩЕНО, не редагується
  integrations/  по одному модулю на зовнішню систему + реєстр index.ts
  sync/          запуск синхронізації і стан між запусками
```

Джерело істини для архітектури — `materials/architecture-brief.md`.

## Головні правила

- `app/src/core/**`, `app/scripts/**`, `materials/**`, `.coderabbit.yaml`,
  `.github/**` не редагуються — задача впирається в них, зупинись і дай звіт.
- Залежності йдуть в один бік: `integrations/` і `sync/` → `core/`, ніколи навпаки.
- Помилки — це значення (`Result<T>`), а не винятки.
- HTTP, змінні середовища, JSON і журнал — лише через функції ядра
  (`postJson`, `readEnv`, `parseJson` + guard, `log`), не через `fetch` /
  `process.env` / `JSON.parse` / `console.*`.
- Без `any` і без нових залежностей.
- В сповіщення (Slack, месенджери) не йдуть email і телефон ліда.

Деталі, обхідні шляхи й команди перевірки — у `.claude/rules/`:
`architecture.md`, `conventions.md`, `do-not-touch.md`. Не переказуй їх тут —
читай там.

## Перед комітом

```bash
cd app && npm test && npm run typecheck && npm run check:rules
```

`npm test` зелений і тестів не менше, ніж було; `TOTAL` у `check:rules` не
більший, ніж був **до твоїх змін** (зніми числа до старту — у таблиці вище лише
стан на момент останнього коміту); `core-untouched` = `0`.
