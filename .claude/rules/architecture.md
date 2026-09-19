---
paths:
  - "app/src/**"
---

# Архітектура lead-sync

## Контекст

`app/src/` поділений на три шари (`core/`, `integrations/`, `sync/`), і той самий
`core/` працює в усіх клієнтських воркерах агенції. Тому напрям залежностей,
спосіб додати інтеграцію і публічний API ядра — фіксовані, а не вигадуються
заново в кожній задачі.

## Правило

### Шари й напрям залежностей

- `core/` — платформа: типи, HTTP, конфіг, парсинг, логер. `core/` **не імпортує**
  нічого з `integrations/` і `sync/`.
- `integrations/` і `sync/` імпортують з `core/`. Імпорт у зворотний бік — помилка.
- `integrations/` нічого не знають про `sync/` і не імпортують один одного.
  Єдиний файл, якому можна імпортувати сусідні інтеграції, — `integrations/index.ts`.
- `sync/` не імпортує ні файли інтеграцій, ні реєстр: `runSync(leads, integrations,
  statePath)` з `app/src/sync/run.ts` отримує список параметром і знає лише контракт
  `Integration` з `app/src/core/types.ts`. Список збирає реєстр
  `app/src/integrations/index.ts` — для точки входу, не для `sync/`.
- Нових шарів і тек не створюй — ні поза цими трьома, ні всередині них
  (`integrations/shared/`, `sync/lib/` — теж ні): файли лежать плоско. Спільного
  коду поза `core/` не існує, а `core/` не змінюється.

### Нова зовнішня система — два файли і реєстрація

1. `app/src/integrations/<kebab-name>.ts` — **іменований** експорт об'єкта типу
   `Integration` (зразок — `slack-notify.ts`; `export default` у `sheets-append.ts` —
   спадщина, не копіюй її). Контракт має рівно три члени:
   - `name: "<kebab-name>"` — збігається з іменем файлу;
   - `requiredEnv: readonly string[]` — імена потрібних змінних середовища
     (лише імена, не значення); якщо таких немає — `[]`;
   - `send(lead: Lead): Promise<Result<void>>`.
2. `app/src/integrations/<kebab-name>.test.ts` — тест поруч: успішна відправка
   (перевірити URL і тіло запиту), відсутня змінна середовища, помилка від
   зовнішньої системи.
3. `app/src/integrations/index.ts` — **два рядки**: `import` модуля і один елемент
   у масиві `integrations`.

Більше нічого: ні змін у `core/`, ні змін у `sync/`, ні нових файлів конфігурації.

### Публічний API ядра — рівно цей список

| Модуль | Що існує |
|---|---|
| `core/types.ts` | `Lead`, `Result<T>`, `Integration` |
| `core/http.ts` | `postJson(url, body, options?)` → `Promise<Result<string>>`, `PostOptions` |
| `core/config.ts` | `readEnv(name, env?)` → `Result<string>` (другий параметр — лише для тестів, за замовчуванням `process.env`) |
| `core/parse.ts` | `parseJson(text, guard, label?)` → `Result<T>`, `Guard<T>`, `isRecord`, `isString`, `isNumber` |
| `core/log.ts` | `log.info`, `log.warn`, `log.error`, `redact(text)` |

Іншого експорту в `core/` не існує: не імпортуй того, чого немає в таблиці, і не
вигадуй нових сигнатур, **полів** і типів для того, що є. Склад типів ядра
(`Lead`, `Result`, `Integration`) теж заморожений — розширювати їх поза ядром не
можна: ні `Lead & { ... }`, ні власний `interface Lead`, ні `as`-перетворення до
ширшого типу. Бракує поля, функції чи параметра — це зміна core: зупинись і дай
звіт за пунктами з правила `do-not-touch`.

## Як перевірити

`grep` запускай у **git bash** (у PowerShell його немає). Порожній вивід = пройдено.

- Ядро не залежить від решти проєкту:
  `grep -rnE "['\"][^'\"]*(\.\./)+(integrations|sync)/" app/src/core/`
  (ловить обидва типи лапок, `import()`, `require()` і вкладені теки).
- Інтеграції не знають про `sync/`:
  `grep -rnE "['\"][^'\"]*/sync/" app/src/integrations/`
  (простий `grep -rn "sync/"` не годиться — він ловить `async/await`).
- Інтеграції не імпортують одна одну:
  `grep -rnE "^\s*import .*['\"]\./" app/src/integrations/ --include="*.ts" | grep -v "\.test\.ts:" | grep -v "^app/src/integrations/index\.ts:"`
- Після додавання інтеграції:
  `ls app/src/integrations/<kebab-name>.ts app/src/integrations/<kebab-name>.test.ts` → обидва файли є;
  `grep -nE "<kebab-name>|<camelName>" app/src/integrations/index.ts` → **два** рядки
  (import і елемент масиву).
- Кожен імпорт з `core/` звіряється з таблицею вище;
  `cd app && npm run typecheck` → без помилок (бракує `requiredEnv` — впаде саме тут).
