# C:/Program Files/Git/analyze-error materials/error-log.txt — слеш-виклик у свіжій сесії

Свіжа сесія 27.11.2026 за рев'ю 22.09 / 16.11. Запуск: окремий процес `claude -p` (неінтерактивний режим) з клону репо поза VS Code, оточення без жодних змінних VS Code і батьківської сесії Claude Code, `MSYS_NO_PATHCONV=1` (інакше Git Bash переписує `/команду` на шлях Windows), без MCP-серверів (`--strict-mcp-config`). Пам'ять проєкту (`CLAUDE.md`, `AGENTS.md`, `.claude/rules/`) вантажиться як у звичайній сесії — перевірено окремим прогоном `rules-in-context.md`. Запустив агент Claude Code за дорученням студента; запис — `--output-format stream-json`. Шлях клону замінено на `<клон-репо>`. Стан коду — як до Task C: `app/src/` зі стартового коміту `2155c65` (у `sheets-append.ts` 7 порушень, `TOTAL 8`, 18 тестів, `telegram-notify` ще немає), а `.claude/` (команди, правила, хук), `AGENTS.md`, `CLAUDE.md` — чинні з `774ba86`. Перед кожною сесією клон повертався в цей стан. Дозволи: `--permission-mode acceptEdits` і `--allowedTools "Bash(npm *)" "Bash(cd *)" "Bash(node *)" "Bash(git diff*)" "Bash(git status*)"`; усе інше в неінтерактивному режимі відхиляється (відмови перелічено в підсумку).

## Ініціалізація сесії (з запису, дослівно)

- Claude Code: `2.1.330`; модель: `claude-opus-5-5`; сесія: `411778e8-1d86-4a0b-8b6f-acf685b56d95`
- MCP-сервери: 
- MCP-інструментів у сесії: 0; інструментів `mcp__ide__*`: 0

<details><summary>Список MCP-інструментів</summary>

```text

```

</details>

## Розмова

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\materials\\error-log.txt"
}
```

**Результат:**

```text
1	# lead-sync · клієнт Studio Nova · production · ніч з 09.09 на 10.09.2026 (витяг)
2	# Дані синтетичні. Рядки вже пройшли маскування log.redact().
3	# Точка входу worker.ts лежить у репозиторії деплою й сюди не входить:
4	# вона раз на 5 хвилин викликає runSync(leads, integrations, "data/sync-state.json").
5	#
6	# Повідомлення клієнта, 10.09, 09:12:
7	#   «Доброго ранку! У Slack-каналі #leads за ніч сотні повідомлень про тих самих
8	#    людей, а в Google-таблиці тисячі дублікатів. Ось щойно знову прийшли ті самі.
9	#    Що відбувається?»
10	#
11	2026-09-09T23:55:00.411Z INFO slack-notify: lead ld_1284 delivered
12	2026-09-09T23:55:00.927Z INFO sheets-append: row added for lead ld_1284
13	2026-09-09T23:55:00.931Z INFO sync: 1 pending leads, 2 delivered, 0 failed
14	2026-09-10T00:00:00.398Z INFO sync: 0 pending leads, 0 delivered, 0 failed
15	2026-09-10T00:02:37.114Z SYSTEM disk usage /srv/lead-sync/data: 97% (nightly backup job running)
16	2026-09-10T00:05:00.402Z ERROR sync run crashed: Error: ENOSPC: no space left on device, write
17	    at Object.writeFileSync (node:fs:2426:20)
18	    at saveState (/srv/lead-sync/app/src/sync/state.ts:21:3)
19	    at runSync (/srv/lead-sync/app/src/sync/run.ts:18:3)
20	    at async Timeout.tick (/srv/lead-sync/worker.ts:31:5)
21	2026-09-10T00:05:00.403Z SYSTEM disk usage /srv/lead-sync/data: 100%
22	2026-09-10T00:10:00.391Z ERROR sync run crashed: Error: ENOSPC: no space left on device, write
23	    at Object.writeFileSync (node:fs:2426:20)
24	    at saveState (/srv/lead-sync/app/src/sync/state.ts:21:3)
25	    at runSync (/srv/lead-sync/app/src/sync/run.ts:18:3)
26	    at async Timeout.tick (/srv/lead-sync/worker.ts:31:5)
27	2026-09-10T00:13:48.020Z SYSTEM ops: old backup archive removed, disk usage /srv/lead-sync/data: 41%
28	2026-09-10T00:15:00.377Z INFO slack-notify: lead ld_0001 delivered
29	2026-09-10T00:15:00.861Z INFO sheets-append: row added for lead ld_0001
30	2026-09-10T00:15:01.302Z INFO slack-notify: lead ld_0002 delivered
31	2026-09-10T00:15:01.790Z INFO sheets-append: row added for lead ld_0002
32	... 392 similar lines skipped ...
33	2026-09-10T00:18:12.645Z WARN http: attempt 1 to https://hooks.slack.example.test/services/<REDACTED> failed: HTTP 429
34	2026-09-10T00:18:12.947Z WARN http: attempt 2 to https://hooks.slack.example.test/services/<REDACTED> failed: HTTP 429
35	2026-09-10T00:18:13.550Z ERROR slack-notify: lead ld_0199 not delivered: POST https://hooks.slack.example.test/services/<REDACTED> failed: HTTP 429
36	... 117 similar lines skipped ...
37	2026-09-10T00:19:30.000Z SYSTEM scheduler: run exceeded 4m30s limit, worker process killed (SIGKILL)
38	2026-09-10T00:20:00.384Z INFO slack-notify: lead ld_0001 delivered
39	2026-09-10T00:20:00.869Z INFO sheets-append: row added for lead ld_0001
40	2026-09-10T00:20:01.311Z INFO slack-notify: lead ld_0002 delivered
41	... 508 similar lines skipped ...
42	2026-09-10T00:24:30.000Z SYSTEM scheduler: run exceeded 4m30s limit, worker process killed (SIGKILL)
43	... the same pattern repeats every 5 minutes ...
44	2026-09-10T09:10:00.380Z INFO slack-notify: lead ld_0001 delivered
45	2026-09-10T09:10:00.866Z INFO sheets-append: row added for lead ld_0001
46	... 511 similar lines skipped ...
47	2026-09-10T09:14:30.000Z SYSTEM scheduler: run exceeded 4m30s limit, worker process killed (SIGKILL)
48	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\materials\\architecture-brief.md"
}
```

**Результат:**

```text
1	# Lead Sync — архітектурна записка
2	
3	> Джерело істини для правил проєкту (Task A). Записку писали для людей: тут є і
4	> «чому», і історія. Ваше завдання — перетворити її на **короткі правила, які
5	> виконує агент**. Проєкт і дані синтетичні (домени `*.example.test`).
6	
7	## Що це за сервіс
8	
9	`lead-sync` — воркер, який агенція перенесла з n8n-воркфлоу для клієнта Studio Nova.
10	Кожні 5 хвилин він бере нові заявки з форми сайту й розсилає їх в інтеграції:
11	Slack-канал менеджерів, Google-таблицю, а далі — CRM і месенджери. Раніше це був
12	воркфлоу з восьми нод; тепер це TypeScript, Node 22+ і тести на Vitest.
13	
14	## Шари і напрям залежностей
15	
16	ˋˋˋ
17	app/src/
18	  core/          платформа: типи, HTTP, конфіг, парсинг, логер
19	  integrations/  по одному модулю на зовнішню систему + реєстр index.ts
20	  sync/          запуск синхронізації і стан між запусками
21	ˋˋˋ
22	
23	- `integrations/` і `sync/` імпортують з `core/`. `core/` не імпортує нічого з решти проєкту.
24	- `integrations/` нічого не знають про `sync/`. `sync/` працює з інтеграціями лише
25	  через контракт `Integration` з `core/types.ts` і реєстр `integrations/index.ts`.
26	- Нова зовнішня система — це новий файл `src/integrations/<kebab-name>.ts`, тест
27	  поруч (`<kebab-name>.test.ts`) і один рядок у `integrations/index.ts`. Більше нічого.
28	
29	## Ядро (`src/core/`) — захищена зона
30	
31	`core/` належить платформній команді: той самий core працює в усіх клієнтських
32	воркерах агенції. Зміни в ньому йдуть окремим PR через рев'ю цієї команди, тому
33	**у звичайних задачах `src/core/**` не редагується взагалі** — ні «дрібний фікс»,
34	ні «додам один тип». Якщо задача без цього не робиться, треба зупинитись і
35	описати, що саме потрібно змінити в core і навіщо.
36	
37	Публічний API ядра — рівно ось це. Іншого не існує, і вигадувати його не можна:
38	
39	| Модуль | Експорт | Для чого |
40	|---|---|---|
41	| `core/types.ts` | `Lead`, `Result<T>`, `Integration` | спільні типи й контракт інтеграції |
42	| `core/http.ts` | `postJson(url, body, options?)` → `Promise<Result<string>>`, `PostOptions` | будь-який вихідний HTTP: таймаут, повтори на 5xx/429 |
43	| `core/config.ts` | `readEnv(name)` → `Result<string>` | читання змінних середовища |
44	| `core/parse.ts` | `parseJson(text, guard, label?)` → `Result<T>`, `Guard<T>`, `isRecord`, `isString`, `isNumber` | перетворення зовнішнього тексту на дані |
45	| `core/log.ts` | `log.info`, `log.warn`, `log.error`, `redact(text)` | журнал із маскуванням секретів |
46	
47	Так само не редагуються: `app/scripts/**` (перевірка правил), `materials/**`,
48	`.coderabbit.yaml`, `.github/**`.
49	
50	## Конвенції коду
51	
52	1. **Помилки — це значення.** Функції, що можуть не вдатися, повертають `Result<T>`.
53	   Інтеграція не кидає винятків назовні: `send()` завжди повертає `Result<void>`.
54	2. **HTTP — лише через `postJson()`.** Прямого `fetch` в інтеграціях немає: у ньому
55	   нема таймауту, повторів і маскування URL у журналі. Нових HTTP-клієнтів (axios,
56	   got, ky) не додаємо.
57	3. **Змінні середовища — лише через `readEnv()`.** `process.env` поза `core/config.ts`
58	   не читаємо. Значення секретів не пишемо в журнал і не вшиваємо в код, навіть
59	   «тимчасово».
60	4. **Зовнішнім даним не довіряємо.** Будь-який JSON — відповідь API, тіло вебхука,
61	   файл стану — розбирається лише через `parseJson(text, guard)` з guard на
62	   очікувану форму. Невалідний JSON або неочікувана форма — це помилка
63	   (`Result` з `ok: false`), яку видно в журналі. Тихо підставити «значення за
64	   замовчуванням» і працювати далі — не можна: так пошкоджені дані стають
65	   непомітними, а наслідки — дорогими.
66	5. **Журнал — лише через `log`.** `console.*` поза `core/log.ts` не використовуємо:
67	   `log` маскує токени, а `console.log` друкує їх як є.
68	6. **Без `any`.** Для невідомих даних — `unknown` плюс guard.
69	7. **Без нових залежностей.** У застосунку нуль runtime-залежностей, і так має
70	   лишитись. Потрібна бібліотека — спершу питання в PR, а не `npm install`.
71	8. **Мінімізація даних.** У сповіщення (Slack, месенджери) не передаємо email і
72	   телефон ліда — лише ім'я, джерело й бюджет. Повні дані йдуть тільки в системи
73	   обліку (таблиця, CRM).
74	9. **Імена.** Файли — kebab-case; поле `name` інтеграції збігається з іменем файлу.
75	
76	## Тести
77	
78	- Vitest, файл `*.test.ts` поруч із модулем. Реальної мережі в тестах немає:
79	  `fetch` підміняється через `vi.stubGlobal("fetch", ...)`, змінні — через `vi.stubEnv`.
80	- Для кожної інтеграції: успішна відправка (перевірити URL і тіло запиту),
81	  відсутня змінна середовища, помилка від зовнішньої системи.
82	- Перед комітом: `cd app && npm test && npm run typecheck && npm run check:rules`.
83	
84	## Спадщина
85	
86	Частину коду перенесли з n8n до появи цієї записки, і конвенціям він не
87	відповідає — `npm run check:rules` показує, де саме. Такий код переписують
88	поступово, окремою задачею і **без зміни поведінки**, яку фіксують тести
89	(URL, тіло запиту, тексти помилок).
90	
```

**Виклик:** `Glob`

```json
{
  "pattern": "app/src/**/*"
}
```

**Результат:**

```text
app\src\core\config.ts
app\src\core\http.test.ts
app\src\core\http.ts
app\src\core\log.test.ts
app\src\core\log.ts
app\src\core\parse.test.ts
app\src\core\parse.ts
app\src\core\types.ts
app\src\integrations\index.ts
app\src\integrations\sheets-append.test.ts
app\src\integrations\sheets-append.ts
app\src\integrations\slack-notify.test.ts
app\src\integrations\slack-notify.ts
app\src\sync\run.test.ts
app\src\sync\run.ts
app\src\sync\state.ts
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\sync\\state.ts"
}
```

**Результат:**

```text
1	// Стан синхронізації між запусками: ліди, створені після lastSyncedAt, ще не розіслані.
2	import { existsSync, readFileSync, writeFileSync } from "node:fs";
3	
4	export interface SyncState {
5	  /** ISO-8601, UTC. */
6	  lastSyncedAt: string;
7	}
8	
9	const INITIAL_STATE: SyncState = { lastSyncedAt: "1970-01-01T00:00:00.000Z" };
10	
11	export function loadState(path: string): SyncState {
12	  if (!existsSync(path)) return { ...INITIAL_STATE };
13	  try {
14	    return JSON.parse(readFileSync(path, "utf8"));
15	  } catch {
16	    return { ...INITIAL_STATE };
17	  }
18	}
19	
20	export function saveState(path: string, state: SyncState): void {
21	  writeFileSync(path, JSON.stringify(state, null, 2));
22	}
23	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\sync\\run.ts"
}
```

**Результат:**

```text
1	// Один запуск синхронізації. Планувальник викликає його кожні 5 хвилин.
2	import { log } from "../core/log.js";
3	import type { Integration, Lead } from "../core/types.js";
4	import { loadState, saveState } from "./state.js";
5	
6	export interface SyncReport {
7	  pending: number;
8	  delivered: number;
9	  failed: number;
10	}
11	
12	export async function runSync(
13	  leads: readonly Lead[],
14	  integrations: readonly Integration[],
15	  statePath: string,
16	): Promise<SyncReport> {
17	  const state = loadState(statePath);
18	  saveState(statePath, state); // створює файл стану при першому запуску
19	
20	  const pending = leads.filter((lead) => lead.createdAt > state.lastSyncedAt);
21	  let delivered = 0;
22	  let failed = 0;
23	
24	  for (const lead of pending) {
25	    for (const integration of integrations) {
26	      const result = await integration.send(lead);
27	      if (result.ok) delivered++;
28	      else failed++;
29	    }
30	  }
31	
32	  const newest = pending.reduce(
33	    (latest, lead) => (lead.createdAt > latest ? lead.createdAt : latest),
34	    state.lastSyncedAt,
35	  );
36	  saveState(statePath, { lastSyncedAt: newest });
37	  log.info(`sync: ${pending.length} pending leads, ${delivered} delivered, ${failed} failed`);
38	  return { pending: pending.length, delivered, failed };
39	}
40	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\sync\\run.test.ts"
}
```

**Результат:**

```text
1	import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
2	import { tmpdir } from "node:os";
3	import { join } from "node:path";
4	import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
5	import type { Integration, Lead } from "../core/types.js";
6	import { runSync } from "./run.js";
7	
8	const makeLead = (id: string, createdAt: string): Lead => ({
9	  id,
10	  name: `Lead ${id}`,
11	  email: `${id}@studio-nova.example.test`,
12	  source: "website",
13	  createdAt,
14	});
15	
16	const leads = [
17	  makeLead("ld_0001", "2026-09-09T10:00:00.000Z"),
18	  makeLead("ld_0002", "2026-09-09T11:00:00.000Z"),
19	  makeLead("ld_0003", "2026-09-10T08:00:00.000Z"),
20	];
21	
22	function recordingIntegration(sent: string[]): Integration {
23	  return {
24	    name: "recording",
25	    requiredEnv: [],
26	    send: async (lead) => {
27	      sent.push(lead.id);
28	      return { ok: true, value: undefined };
29	    },
30	  };
31	}
32	
33	let dir: string;
34	
35	beforeEach(() => {
36	  dir = mkdtempSync(join(tmpdir(), "lead-sync-"));
37	  vi.spyOn(console, "log").mockImplementation(() => {});
38	});
39	
40	afterEach(() => {
41	  rmSync(dir, { recursive: true, force: true });
42	  vi.restoreAllMocks();
43	});
44	
45	describe("runSync", () => {
46	  it("при першому запуску розсилає всі ліди і зберігає найновішу дату", async () => {
47	    const sent: string[] = [];
48	    const statePath = join(dir, "sync-state.json");
49	
50	    const report = await runSync(leads, [recordingIntegration(sent)], statePath);
51	
52	    expect(report).toEqual({ pending: 3, delivered: 3, failed: 0 });
53	    expect(JSON.parse(readFileSync(statePath, "utf8"))).toEqual({ lastSyncedAt: "2026-09-10T08:00:00.000Z" });
54	  });
55	
56	  it("розсилає лише ліди, новіші за збережений стан", async () => {
57	    const sent: string[] = [];
58	    const statePath = join(dir, "sync-state.json");
59	    writeFileSync(statePath, JSON.stringify({ lastSyncedAt: "2026-09-09T10:30:00.000Z" }));
60	
61	    await runSync(leads, [recordingIntegration(sent)], statePath);
62	
63	    expect(sent).toEqual(["ld_0002", "ld_0003"]);
64	  });
65	});
66	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\core\\parse.ts"
}
```

**Результат:**

```text
1	// Єдине місце, де зовнішній текст стає даними.
2	// Будь-який JSON (відповіді API, вебхуки, файли стану) — лише через parseJson() з guard:
3	// невалідний JSON або неочікувана форма — це помилка, а не «значення за замовчуванням».
4	import type { Result } from "./types.js";
5	
6	export type Guard<T> = (value: unknown) => value is T;
7	
8	export function parseJson<T>(text: string, guard: Guard<T>, label = "json"): Result<T> {
9	  let raw: unknown;
10	  try {
11	    raw = JSON.parse(text);
12	  } catch {
13	    return { ok: false, error: `${label}: invalid JSON` };
14	  }
15	  if (!guard(raw)) {
16	    return { ok: false, error: `${label}: unexpected shape` };
17	  }
18	  return { ok: true, value: raw };
19	}
20	
21	export const isRecord = (value: unknown): value is Record<string, unknown> =>
22	  typeof value === "object" && value !== null && !Array.isArray(value);
23	
24	export const isString = (value: unknown): value is string => typeof value === "string";
25	
26	export const isNumber = (value: unknown): value is number =>
27	  typeof value === "number" && Number.isFinite(value);
28	
```

**Агент:**

# Розбір `materials/error-log.txt`: дублікати в Slack і таблиці в ніч на 10.09

**Коротко:** диск заповнився лише на ~9 хвилин. Дублікати йшли ще 9 годин, бо `loadState` мовчки сприйняв зіпсований файл стану як перший запуск і скинув дату на 1970 рік. Далі кожен запуск розсилав усі ліди з нуля і не встигав зберегти прогрес.

## 1. Хронологія

| Час (UTC) | Подія |
|---|---|
| 23:55 | Звичайний запуск: 1 лід, 2 доставки, підсумок `sync:` записано. |
| 00:00 | Звичайний запуск: 0 лідів. |
| 00:02:37 | Нічний бекап займає диск до 97%. |
| **00:05** | `ENOSPC` у `saveState` (state.ts:21), виклик із **run.ts:18**, тобто ще до розсилки. Диск 100%. |
| 00:10 | Той самий збій. Нічого не розіслано. |
| **00:13:48** | Старий архів видалено, диск 41%. **Тригер зник.** |
| **00:15** | Розсилка починається з **`ld_0001`**, найстарішого ліда, а не після `ld_1284`. Сотні рядків, на Slack 429. |
| 00:19:30 | SIGKILL за лімітом 4m30s. Підсумкового рядка `sync:` немає, тобто run.ts:36–37 не виконались. |
| 00:20 … 09:14 | Кожні 5 хвилин знову з `ld_0001`, і щоразу SIGKILL. О 09:12 скаржиться клієнт, і цикл триває. |

Характер збою змінився о 00:15: замість «нічого не працює» стало «працює, але все з нуля».

## 2. Тригер і причина

**Тригер:** закінчилось місце на диску через нічний бекап (00:02–00:13).

**Чому тригер не є причиною:** після 00:13:48 місце є, запис працює, але дублікати йдуть ще 9 годин. Якби причиною був диск, після його звільнення все мало б відновитися з `ld_1285`. Насправді все почалося з `ld_0001`.

**Причина:** `app/src/sync/state.ts:13-17`. `loadState` ловить будь-яку помилку розбору (`JSON.parse` у рядку 14) і мовчки повертає `INITIAL_STATE` з датою `1970-01-01` (рядок 16). Зіпсований файл стану стає «першим запуском», тобто дозволом розіслати всю історію лідів. Це пряме порушення конвенції «невалідний JSON — це `ok: false`, а не значення за замовчуванням».

### Ланцюг

1. **00:05, тригер.** run.ts:18 викликає `saveState` ще до розсилки. Запис у state.ts:21 не атомарний: `writeFileSync` спершу обнуляє файл, а потім пише в нього. Обнулення пройшло, запис упав з `ENOSPC` (у стеку видно `write`, тож файл відкрився). У файлі лишилось 0 байтів або обрізаний JSON.
2. **00:10.** `JSON.parse` падає на порожньому файлі, state.ts:16 мовчки повертає 1970, run.ts:18 знову падає на запису.
3. **00:15, тригер зник.** Знову повертається 1970, але тепер run.ts:18 **успішно записує на диск `{"lastSyncedAt":"1970-…"}`**. Пошкодження, яке ще можна було помітити, стає валідним станом. Усі ліди в черзі, розсилка йде з `ld_0001`.
4. **Чому це не минає саме.** Стан просувається вперед лише в run.ts:36, після обробки **всіх** лідів. Сотні лідів по дві інтеграції плюс повтори на Slack 429 не вкладаються в 4m30s, тож SIGKILL настає раніше, ніж виконується рядок 36. На диску лишається 1970, і наступний запуск робить те саме. Це стабільний цикл без виходу.

Є три поглиблювальні чинники. Вони не самостійні причини, бо кожен шкодить лише разом із state.ts:16:
- state.ts:21: неатомарний запис (обнулення, потім запис) залишив зіпсований файл;
- run.ts:18: зайвий запис до початку роботи, який закріпив на диску дату 1970;
- run.ts:36: єдина точка збереження прогресу, тому вбитий запуск не залишає по собі нічого.

**Контрольна перевірка:** якби state.ts:16 повертав помилку, з 00:15 воркер щохвилини писав би ERROR про пошкоджений стан і нічого б не розсилав. Дублікатів не було б зовсім.

## 3. Тести, що падають на нинішньому коді

Підміни мережі не потрібні: `runSync` отримує інтеграції параметром, і там уже є `recordingIntegration`. Обидва тести — у `app/src/sync/run.test.ts`.

**Тест 1 (основна причина):**
```ts
it("пошкоджений файл стану не скидає синхронізацію на початок і нічого не розсилає", async () => {
  const sent: string[] = [];
  const statePath = join(dir, "sync-state.json");
  writeFileSync(statePath, ""); // так лишає файл writeFileSync після ENOSPC

  await runSync(leads, [recordingIntegration(sent)], statePath);

  expect(sent).toEqual([]);                              // зараз: ["ld_0001","ld_0002","ld_0003"]
  expect(readFileSync(statePath, "utf8")).toBe("");      // зараз: перезаписано датою 1970
});
```
До нової сигнатури варто додати асерт `expect(result.ok).toBe(false)` і шпигун за `log.error` через `vi.spyOn(log, "error")`.

**Тест 2 (цикл після SIGKILL):**
```ts
it("перерваний запуск не розсилає повторно вже оброблені ліди", async () => {
  // інтеграція кидає виняток на ld_0002 (імітація SIGKILL), другий запуск — звичайний
  // асерт: у другому запуску sent не містить "ld_0001"
});
```
Зараз він падає, бо стан на диску лишається початковим і `ld_0001` іде вдруге.

## 4. Виправлення (лише план, у `sync/`, без змін у `core/`)

1. **state.ts, `loadState`:** повертати `Result<SyncState>` через `parseJson(text, isSyncState, "sync-state")`. Guard: `isRecord`, плюс `isString(lastSyncedAt)`, плюс валідна дата. Відсутній файл — `ok` з початковим станом (це легітимний перший запуск). Зіпсований файл — `ok: false`.
2. **state.ts, `saveState`:** атомарний запис. Спершу `${path}.tmp`, потім `renameSync`. Повертати `Result<void>` з `try/catch`, без винятків назовні. За `ENOSPC` старий файл лишається цілим.
3. **run.ts:18:** прибрати запис до початку роботи.
4. **run.ts:**
   - Якщо `loadState` повернув `ok: false`, писати `log.error`, нічого не розсилати і файл не чіпати.
   - Ліди сортувати за `createdAt` і зберігати стан після **кожного** ліда, а не тільки в рядку 36. Тоді вбитий запуск продовжиться з того місця, де зупинився.
   - Як опцію можна обмежити кількість лідів за один запуск, щоб вкладатися в 4m30s.
5. **Сигнатура:** з `Promise<SyncReport>` на `Promise<Result<SyncReport>>`. Це зачепить `worker.ts`, який лежить у репозиторії деплою, — це треба узгодити окремо.

**Терміново, ще до будь-якого деплою:** на проді у файлі зараз записано 1970, тож цикл триває. Новий код сам по собі його не зупинить: із покроковим збереженням він ще раз розішле всю історію, тільки один раз. Людині треба:
- зупинити воркер;
- вручну записати в `/srv/lead-sync/data/sync-state.json` значення `createdAt` ліда `ld_1284`, останнього успішного о 23:55;
- запустити воркер знову.

Рядки, які вже потрапили в Google-таблицю, доведеться прибрати окремо.

Я не змінював жодного файлу. Чекаю підтвердження, перш ніж писати тести й виправлення.

## Підсумок прогону (з запису)

- Ходів: 8; тривалість: 71 с; вартість за записом: $0.338
- Відмов у дозволах: 0
