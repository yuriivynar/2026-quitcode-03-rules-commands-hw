---
paths:
  - "app/src/**"
  - "app/package.json"
  - "app/tsconfig.json"
---

# Конвенції коду lead-sync

## Контекст

Кожну конвенцію ядро реалізує однією функцією, а `npm run check:rules` перевіряє
статично. Обхід — це втрата таймаутів, повторів, маскування секретів або тихо
пошкоджені дані. Заборони стосуються **дії, а не токена**: псевдонім
(`const c = console`), `process["env"]`, `node:`-двійник (`node:https`,
`node:process`), `res.json()`, `process.stdout.write`, `new Function` — той самий
обхід; `check:rules` їх не бачить, правило діє.

## Правило

- **Помилки — значення.** Що може не вдатися, повертає `Result<T>`; `send()` —
  `Promise<Result<void>>`. Винятків назовні не кидай — `{ ok: false, error }`.
- **HTTP — лише `postJson`** з `core/http.ts` (таймаут, повтори на 5xx/429,
  маскування URL у журналі): без `fetch(`, axios / got / ky, `node:https`.
- **Змінні середовища — лише `readEnv(name)`**; `process.env` — тільки в
  `core/config.ts`. Секрет не пиши в журнал і не вшивай у код.
- **Секрети не виходять у `Result.error`.** Помилка `postJson` містить повний URL
  (`POST <url> failed: …`), а з ним `?token=`, `/bot<token>/` чи URL вебхука. Перед
  `log.*` і поверненням заміни відоме значення секрету (`.replaceAll(token, "<REDACTED>")`)
  і пропусти текст через `redact`. Тест: помилка запиту → ні в `Result.error`, ні в
  аргументах `log.error` немає значення секрету.
- **Зовнішній текст — лише `parseJson(text, guard, label?)`** з guard (`isRecord` /
  `isString` / `isNumber`): без `JSON.parse`, `res.json()` і власних парсерів.
  Невалідний JSON чи інша форма — `ok: false`; мовчки підставити значення за
  замовчуванням і працювати далі не можна.
- **Журнал — лише `log.info` / `log.warn` / `log.error`** (+ `redact`), не `console.*`.
- **Без `any` і глушників:** ні `: any`, `as any`, `<any>`, `as unknown as T`,
  `@ts-ignore` / `@ts-expect-error`. Невідоме — `unknown` + guard.
- **Без нових залежностей** у `app/package.json` (ні `dependencies`, ні
  `devDependencies`). У production-файлах (`app/src/**` без `*.test.ts`) — лише
  відносні імпорти й `node:*`; у тестах ще `vitest`, інше — те саме порушення. У
  `app/src/` лише `.ts`. Потрібна бібліотека — питання в PR, не `npm install`.
- **Мінімізація даних.** У сповіщення (Slack, месенджери) — лише ім'я, джерело й
  бюджет, поіменно; не `lead` цілим і не імена полів із рядків. `lead.email` і
  `lead.phone` — лише в системи обліку (`sheets-append.ts`, CRM).
- **Імена:** файли kebab-case; `name` інтеграції = ім'я файлу.
- **Тести:** Vitest, `*.test.ts` поруч, без реальної мережі (`vi.stubGlobal("fetch", …)`,
  `vi.stubEnv`). Заборони на `any`, глушники, мережу, справжні секрети й `console.*`
  діють і тут (`check:rules` тестів не сканує — дивись очима).
  `vi.spyOn(console, …).mockImplementation(…)` лише щоб приглушити вивід; перевіряєш
  запис у журнал — шпигуй за `log`. `JSON.parse` над власною фікстурою в асерті
  (`JSON.parse(String(init?.body))`) — норма проєкту.
- **Наявні тести не слабшають:** асерти й фікстури не видаляй, не `it.skip`, не
  слабши (`toEqual` → `toMatchObject` / `toContain`). Асерт змінюй, лише коли задача
  прямо описує нову поведінку, — і перелічи кожен у підсумку.
- **Спадковий код** (`sheets-append.ts`, `sync/state.ts`) переписується окремою
  задачею без зміни поведінки: URL, тіло запиту й тексти помилок ті самі (виняток —
  маскування секрету за пунктом вище).

## Як перевірити

Числа звіряй зі станом **до своїх змін**: перший крок задачі — зняти
`npm run check:rules` і `npm test` до правок (константи у файлах застарівають).

- `cd app && npm run check:rules` → `TOTAL` не більший, ніж до змін; у `by file`
  немає нових рядків для твоїх файлів; `core-untouched` = `0`.
- `cd app && npm test && npm run typecheck` → зелено, тестів не менше, ніж було.
- Мінімізація даних (git bash):
  `grep -rnE "lead\.(email|phone)|\blead\b\s*[,}]" app/src/integrations/ --include="*.ts" | grep -v "\.test\.ts:"`
  → лише `sheets-append.ts`; модуль-сповіщення тут — порушення.
- Секрети в помилках: у кожному модулі з секретом у URL є тест на помилку запиту, що
  перевіряє `Result.error` і `log.error`.
- Нових залежностей немає: `git diff HEAD -- app/package.json app/package-lock.json`
  → порожньо, `no-new-deps` = `0`.
