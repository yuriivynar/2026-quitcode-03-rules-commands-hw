---
paths:
  - "app/src/**"
---

# Архітектура lead-sync

## Контекст

`app/src/` — три шари (`core/`, `integrations/`, `sync/`), а той самий `core/` працює
в усіх воркерах агенції. Напрям залежностей, спосіб додати інтеграцію й API ядра
фіксовані, а не вигадуються в кожній задачі.

## Правило

### Шари

- `core/` не імпортує нічого з `integrations/` і `sync/`; ті імпортують з `core/`.
- Інтеграції не знають про `sync/` і не імпортують одна одну — крім реєстру
  `integrations/index.ts`.
- `sync/` не імпортує ні інтеграцій, ні реєстру: `runSync(leads, integrations,
  statePath)` з `sync/run.ts` отримує список параметром і знає лише контракт
  `Integration`. Список збирає `integrations/index.ts` для точки входу.
- Нових шарів і тек не створюй, зокрема всередині шарів (`integrations/shared/`,
  `sync/lib/`): файли лежать плоско. Спільного коду поза `core/` немає.

### Нова зовнішня система

1. `app/src/integrations/<kebab-name>.ts` — **іменований** експорт типу
   `Integration` (зразок — `slack-notify.ts`; `export default` у `sheets-append.ts` —
   спадщина). Рівно три члени: `name: "<kebab-name>"` (= ім'я файлу),
   `requiredEnv: readonly string[]` (лише імена змінних; немає — `[]`),
   `send(lead: Lead): Promise<Result<void>>`.
2. `<kebab-name>.test.ts` поруч: успішна відправка (URL і тіло), відсутня змінна
   середовища, помилка від зовнішньої системи.
3. `integrations/index.ts` — **два рядки**: `import` і елемент масиву `integrations`.

Більше нічого: ні змін у `core/` чи `sync/`, ні нових конфігів.

### Публічний API ядра — рівно цей

| Модуль | Що існує |
|---|---|
| `core/types.ts` | `Lead`, `Result<T>`, `Integration` |
| `core/http.ts` | `postJson(url, body, options?)` → `Promise<Result<string>>`, `PostOptions` |
| `core/config.ts` | `readEnv(name, env?)` → `Result<string>` (`env` — лише для тестів) |
| `core/parse.ts` | `parseJson(text, guard, label?)` → `Result<T>`, `Guard<T>`, `isRecord`, `isString`, `isNumber` |
| `core/log.ts` | `log.info`, `log.warn`, `log.error`, `redact(text)` |

Іншого немає: не імпортуй відсутнього й не вигадуй сигнатур, полів і типів. Типи
ядра заморожені й ззовні не розширюються — ні `Lead & { ... }`, ні власний
`interface Lead`, ні `as` до ширшого типу. Бракує поля чи функції — це зміна core:
зупинись і дай звіт за `do-not-touch`.

## Як перевірити

`grep` — у git bash; порожній вивід = пройдено.

- Ядро не залежить від решти:
  `grep -rnE "['\"][^'\"]*(\.\./)+(integrations|sync)/" app/src/core/`
- Інтеграції не знають про `sync/` (не `grep "sync/"` — той ловить `async/`):
  `grep -rnE "['\"][^'\"]*/sync/" app/src/integrations/`
- Інтеграції не імпортують одна одну:
  `grep -rnE "^\s*import .*['\"]\./" app/src/integrations/ --include="*.ts" | grep -v "\.test\.ts:" | grep -v "^app/src/integrations/index\.ts:"`
- Нова інтеграція: обидва файли є (`ls`), а
  `grep -nE "<kebab-name>|<camelName>" app/src/integrations/index.ts` → два рядки.
- Імпорти з `core/` — лише з таблиці; `cd app && npm run typecheck` → без помилок.
