# C:/Program Files/Git/refactor app/src/integrations/sheets-append.ts — слеш-виклик у свіжій сесії

Свіжа сесія 27.11.2026 за рев'ю 22.09 / 16.11. Запуск: окремий процес `claude -p` (неінтерактивний режим) з клону репо поза VS Code, оточення без жодних змінних VS Code і батьківської сесії Claude Code, `MSYS_NO_PATHCONV=1` (інакше Git Bash переписує `/команду` на шлях Windows), без MCP-серверів (`--strict-mcp-config`). Пам'ять проєкту (`CLAUDE.md`, `AGENTS.md`, `.claude/rules/`) вантажиться як у звичайній сесії — перевірено окремим прогоном `rules-in-context.md`. Запустив агент Claude Code за дорученням студента; запис — `--output-format stream-json`. Шлях клону замінено на `<клон-репо>`. Стан коду — як до Task C: `app/src/` зі стартового коміту `2155c65` (у `sheets-append.ts` 7 порушень, `TOTAL 8`, 18 тестів, `telegram-notify` ще немає), а `.claude/` (команди, правила, хук), `AGENTS.md`, `CLAUDE.md` — чинні з `774ba86`. Перед кожною сесією клон повертався в цей стан. Дозволи: `--permission-mode acceptEdits` і `--allowedTools "Bash(npm *)" "Bash(cd *)" "Bash(node *)" "Bash(git diff*)" "Bash(git status*)"`; усе інше в неінтерактивному режимі відхиляється (відмови перелічено в підсумку). Діф результату — `slash-refactor.diff`.

## Ініціалізація сесії (з запису, дослівно)

- Claude Code: `2.1.330`; модель: `claude-opus-5-5`; сесія: `db2bbf6c-0e10-4cbf-af4e-c4fbf77568c2`
- MCP-сервери: 
- MCP-інструментів у сесії: 0; інструментів `mcp__ide__*`: 0

<details><summary>Список MCP-інструментів</summary>

```text

```

</details>

## Розмова

**Виклик:** `PowerShell`

```json
{
  "command": "cd app; npm run check:rules",
  "description": "Run rules check (before)"
}
```

**Виклик:** `PowerShell`

```json
{
  "command": "cd app; npm test",
  "description": "Run tests (before)"
}
```

**Результат (помилка / відмова):**

```text
Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) — relative paths cannot be validated against the original cwd and require manual approval
```

**Виклик:** `PowerShell`

```json
{
  "command": "cd app; npm run typecheck",
  "description": "Run typecheck (before)"
}
```

**Результат (помилка / відмова):**

```text
Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) — relative paths cannot be validated against the original cwd and require manual approval
```

**Результат (помилка / відмова):**

```text
Compound command changes working directory (Set-Location/Push-Location/Pop-Location/New-PSDrive) — relative paths cannot be validated against the original cwd and require manual approval
```

**Виклик:** `PowerShell`

```json
{
  "command": "npm --prefix app run check:rules",
  "description": "Run rules check (before)"
}
```

**Результат (помилка / відмова):**

```text
This PowerShell command contains multiple operations. The following part requires approval: npm --prefix app run check:rules
```

**Виклик:** `PowerShell`

```json
{
  "command": "npm --prefix app test",
  "description": "Run tests (before)"
}
```

**Виклик:** `PowerShell`

```json
{
  "command": "npm --prefix app run typecheck",
  "description": "Run typecheck (before)"
}
```

**Результат (помилка / відмова):**

```text
This PowerShell command contains multiple operations. The following part requires approval: npm --prefix app test
```

**Результат (помилка / відмова):**

```text
This PowerShell command contains multiple operations. The following part requires approval: npm --prefix app run typecheck
```

**Виклик:** `Bash`

```json
{
  "command": "cd app && npm run check:rules",
  "description": "Run rules check (before)"
}
```

**Виклик:** `Bash`

```json
{
  "command": "cd app && npm test 2>&1 | tail -15",
  "description": "Run tests (before)"
}
```

**Виклик:** `Bash`

```json
{
  "command": "cd app && npm run typecheck",
  "description": "Run typecheck (before)"
}
```

**Результат:**

```text
> check:rules
> node scripts/check-rules.mjs

check:rules — 10 source files, 7 rules

  src/integrations/sheets-append.ts  no-any           line 6
  src/integrations/sheets-append.ts  http-via-core    line 7
  src/integrations/sheets-append.ts  env-via-config   line 7
  src/integrations/sheets-append.ts  json-via-parse   line 12
  src/integrations/sheets-append.ts  no-any           line 12
  src/integrations/sheets-append.ts  log-via-logger   line 14
  src/integrations/sheets-append.ts  log-via-logger   line 17
  src/sync/state.ts                  json-via-parse   line 14

by rule:
  http-via-core     1   HTTP only through postJson() from src/core/http.ts
  env-via-config    1   environment only through readEnv() from src/core/config.ts
  json-via-parse    2   JSON only through parseJson(text, guard) from src/core/parse.ts
  log-via-logger    2   logging only through log from src/core/log.ts (it redacts secrets)
  no-any            2   no `any`: use `unknown` plus a guard
  no-new-deps       0
  core-untouched    0

by file:
  src/integrations/sheets-append.ts    7
  src/sync/state.ts                    1

TOTAL: 8 violation(s)
```

**Результат (помилка / відмова):**

```text
Exit code 1
/usr/bin/bash: line 1: cd: app: No such file or directory
```

**Результат (помилка / відмова):**

```text
Exit code 1
/usr/bin/bash: line 1: cd: app: No such file or directory
```

**Виклик:** `Bash`

```json
{
  "command": "npm test 2>&1 | tail -15",
  "description": "Run tests (before)"
}
```

**Виклик:** `Bash`

```json
{
  "command": "npm run typecheck",
  "description": "Run typecheck (before)"
}
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\integrations\\sheets-append.ts"
}
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\integrations\\sheets-append.test.ts"
}
```

**Результат:**

```text
> test
> vitest run


 RUN  v5.0.0 <клон-репо>/app


 Test Files  6 passed (6)
      Tests  18 passed (18)
   Start at  10:13:36
   Duration  446ms (transform 45%, import 24%, tests 22%, worker 9%)
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\.claude\\rules\\conventions.md"
}
```

**Результат:**

```text
> typecheck
> tsc --noEmit
```

**Результат:**

```text
1	---
2	paths:
3	  - "app/src/**"
4	  - "app/package.json"
5	  - "app/tsconfig.json"
6	---
7	
8	# Конвенції коду lead-sync
9	
10	## Контекст
11	
12	Кожну конвенцію ядро реалізує однією функцією, а `npm run check:rules` перевіряє
13	статично. Обхід — це втрата таймаутів, повторів, маскування секретів або тихо
14	пошкоджені дані. Заборони стосуються **дії, а не токена**: псевдонім
15	(`const c = console`), `process["env"]`, `node:`-двійник (`node:https`,
16	`node:process`), `res.json()`, `process.stdout.write`, `new Function` — той самий
17	обхід; `check:rules` їх не бачить, правило діє.
18	
19	## Правило
20	
21	- **Помилки — значення.** Що може не вдатися, повертає `Result<T>`; `send()` —
22	  `Promise<Result<void>>`. Винятків назовні не кидай — `{ ok: false, error }`.
23	- **HTTP — лише `postJson`** з `core/http.ts` (таймаут, повтори на 5xx/429,
24	  маскування URL у журналі): без `fetch(`, axios / got / ky, `node:https`.
25	- **Змінні середовища — лише `readEnv(name)`**; `process.env` — тільки в
26	  `core/config.ts`. Секрет не пиши в журнал і не вшивай у код.
27	- **Секрети не виходять у `Result.error`.** Помилка `postJson` містить повний URL
28	  (`POST <url> failed: …`), а з ним `?token=`, `/bot<token>/` чи URL вебхука. Перед
29	  `log.*` і поверненням заміни відоме значення секрету (`.replaceAll(token, "<REDACTED>")`)
30	  і пропусти текст через `redact`. Тест: помилка запиту → ні в `Result.error`, ні в
31	  аргументах `log.error` немає значення секрету.
32	- **Зовнішній текст — лише `parseJson(text, guard, label?)`** з guard (`isRecord` /
33	  `isString` / `isNumber`): без `JSON.parse`, `res.json()` і власних парсерів.
34	  Невалідний JSON чи інша форма — `ok: false`; мовчки підставити значення за
35	  замовчуванням і працювати далі не можна.
36	- **Журнал — лише `log.info` / `log.warn` / `log.error`** (+ `redact`), не `console.*`.
37	- **Без `any` і глушників:** ні `: any`, `as any`, `<any>`, `as unknown as T`,
38	  `@ts-ignore` / `@ts-expect-error`. Невідоме — `unknown` + guard.
39	- **Без нових залежностей** у `app/package.json` (ні `dependencies`, ні
40	  `devDependencies`). У production-файлах (`app/src/**` без `*.test.ts`) — лише
41	  відносні імпорти й `node:*`; у тестах ще `vitest`, інше — те саме порушення. У
42	  `app/src/` лише `.ts`. Потрібна бібліотека — питання в PR, не `npm install`.
43	- **Мінімізація даних.** У сповіщення (Slack, месенджери) — лише ім'я, джерело й
44	  бюджет, поіменно; не `lead` цілим і не імена полів із рядків. `lead.email` і
45	  `lead.phone` — лише в системи обліку (`sheets-append.ts`, CRM).
46	- **Імена:** файли kebab-case; `name` інтеграції = ім'я файлу.
47	- **Тести:** Vitest, `*.test.ts` поруч, без реальної мережі (`vi.stubGlobal("fetch", …)`,
48	  `vi.stubEnv`). Заборони на `any`, глушники, мережу, справжні секрети й `console.*`
49	  діють і тут (`check:rules` тестів не сканує — дивись очима).
50	  `vi.spyOn(console, …).mockImplementation(…)` лише щоб приглушити вивід; перевіряєш
51	  запис у журнал — шпигуй за `log`. `JSON.parse` над власною фікстурою в асерті
52	  (`JSON.parse(String(init?.body))`) — норма проєкту.
53	- **Наявні тести не слабшають:** асерти й фікстури не видаляй, не `it.skip`, не
54	  слабши (`toEqual` → `toMatchObject` / `toContain`). Асерт змінюй, лише коли задача
55	  прямо описує нову поведінку, — і перелічи кожен у підсумку.
56	- **Спадковий код** (`sheets-append.ts`, `sync/state.ts`) переписується окремою
57	  задачею без зміни поведінки: URL, тіло запиту й тексти помилок ті самі (виняток —
58	  маскування секрету за пунктом вище).
59	
60	## Як перевірити
61	
62	Числа звіряй зі станом **до своїх змін**: перший крок задачі — зняти
63	`npm run check:rules` і `npm test` до правок (константи у файлах застарівають).
64	
65	- `cd app && npm run check:rules` → `TOTAL` не більший, ніж до змін; у `by file`
66	  немає нових рядків для твоїх файлів; `core-untouched` = `0`.
67	- `cd app && npm test && npm run typecheck` → зелено, тестів не менше, ніж було.
68	- Мінімізація даних (git bash):
69	  `grep -rnE "lead\.(email|phone)|\blead\b\s*[,}]" app/src/integrations/ --include="*.ts" | grep -v "\.test\.ts:"`
70	  → лише `sheets-append.ts`; модуль-сповіщення тут — порушення.
71	- Секрети в помилках: у кожному модулі з секретом у URL є тест на помилку запиту, що
72	  перевіряє `Result.error` і `log.error`.
73	- Нових залежностей немає: `git diff HEAD -- app/package.json app/package-lock.json`
74	  → порожньо, `no-new-deps` = `0`.
75	
```

**Результат:**

```text
1	import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
2	import type { Lead } from "../core/types.js";
3	import sheetsAppend from "./sheets-append.js";
4	
5	const lead: Lead = {
6	  id: "ld_0002",
7	  name: "Андрій Тестовий",
8	  email: "andrii@studio-nova.example.test",
9	  source: "instagram",
10	  createdAt: "2026-09-10T09:30:00.000Z",
11	};
12	
13	beforeEach(() => {
14	  vi.stubEnv("SHEETS_WEBHOOK_URL", "https://sheets.example.test/append");
15	  vi.stubEnv("SHEETS_TOKEN", "fake-sheets-token-0000");
16	  vi.spyOn(console, "log").mockImplementation(() => {});
17	});
18	
19	afterEach(() => {
20	  vi.unstubAllEnvs();
21	  vi.unstubAllGlobals();
22	  vi.restoreAllMocks();
23	});
24	
25	describe("sheets-append", () => {
26	  it("додає рядок у таблицю і повертає ok", async () => {
27	    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{"status":"ok"}', { status: 200 }));
28	    vi.stubGlobal("fetch", fetchMock);
29	
30	    await expect(sheetsAppend.send(lead)).resolves.toEqual({ ok: true, value: undefined });
31	
32	    const [url, init] = fetchMock.mock.calls[0]!;
33	    expect(url).toBe("https://sheets.example.test/append?token=fake-sheets-token-0000");
34	    expect(JSON.parse(String(init?.body))).toEqual({
35	      values: [["2026-09-10T09:30:00.000Z", "Андрій Тестовий", "andrii@studio-nova.example.test", "", "instagram"]],
36	    });
37	  });
38	
39	  it("повертає помилку, якщо таблиця відповіла не ok", async () => {
40	    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"status":"quota_exceeded"}', { status: 200 })));
41	
42	    await expect(sheetsAppend.send(lead)).resolves.toEqual({ ok: false, error: "sheets error: quota_exceeded" });
43	  });
44	});
45	
```

**Результат:**

```text
1	// Перенесено з експорту n8n-воркфлоу «Leads → Google Sheets» (2024). Працює — не чіпали.
2	export default {
3	  name: "sheets-append",
4	  requiredEnv: ["SHEETS_WEBHOOK_URL", "SHEETS_TOKEN"],
5	
6	  async send(lead: any) {
7	    const res = await fetch(process.env.SHEETS_WEBHOOK_URL + "?token=" + process.env.SHEETS_TOKEN, {
8	      method: "POST",
9	      headers: { "content-type": "application/json" },
10	      body: JSON.stringify({ values: [[lead.createdAt, lead.name, lead.email, lead.phone ?? "", lead.source]] }),
11	    });
12	    const data: any = JSON.parse(await res.text());
13	    if (data.status !== "ok") {
14	      console.log("sheets-append failed: " + res.url + " -> " + data.status);
15	      return { ok: false as const, error: "sheets error: " + data.status };
16	    }
17	    console.log("sheets-append: row added for lead " + lead.id);
18	    return { ok: true as const, value: undefined };
19	  },
20	};
21	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\core\\http.ts"
}
```

**Результат:**

```text
1	// Єдиний HTTP-клієнт проєкту: таймаут, повтори на 5xx/429 і мережеві збої,
2	// помилки повертаються як значення. Тіло відповіді — сирий текст:
3	// розбирайте його через parseJson() з guard.
4	import { log } from "./log.js";
5	import type { Result } from "./types.js";
6	
7	export interface PostOptions {
8	  headers?: Record<string, string>;
9	  /** Таймаут однієї спроби, мс. */
10	  timeoutMs?: number;
11	  /** Скільки разів повторити після першої невдалої спроби. */
12	  retries?: number;
13	  /** Пауза між спробами, мс (множиться на номер спроби). */
14	  backoffMs?: number;
15	}
16	
17	const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
18	
19	export async function postJson(url: string, body: unknown, options: PostOptions = {}): Promise<Result<string>> {
20	  const { headers = {}, timeoutMs = 10_000, retries = 2, backoffMs = 300 } = options;
21	  let lastError = "unknown error";
22	
23	  for (let attempt = 1; attempt <= retries + 1; attempt++) {
24	    try {
25	      const response = await fetch(url, {
26	        method: "POST",
27	        headers: { "content-type": "application/json", ...headers },
28	        body: JSON.stringify(body),
29	        signal: AbortSignal.timeout(timeoutMs),
30	      });
31	      const text = await response.text();
32	      if (response.ok) return { ok: true, value: text };
33	      lastError = `HTTP ${response.status}`;
34	      if (response.status < 500 && response.status !== 429) break; // 4xx: повтор не допоможе
35	    } catch (error) {
36	      lastError = error instanceof Error ? error.message : String(error);
37	    }
38	    log.warn(`http: attempt ${attempt} to ${url} failed: ${lastError}`);
39	    if (attempt <= retries && backoffMs > 0) await sleep(backoffMs * attempt);
40	  }
41	
42	  return { ok: false, error: `POST ${url} failed: ${lastError}` };
43	}
44	
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

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\core\\config.ts"
}
```

**Результат:**

```text
1	// Єдине місце, де код читає змінні середовища.
2	// Інтеграції отримують значення лише через readEnv() — і ніколи їх не логують.
3	import type { Result } from "./types.js";
4	
5	export function readEnv(name: string, env: NodeJS.ProcessEnv = process.env): Result<string> {
6	  const value = env[name];
7	  if (value === undefined || value.trim() === "") {
8	    return { ok: false, error: `missing environment variable ${name}` };
9	  }
10	  return { ok: true, value };
11	}
12	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\core\\log.ts"
}
```

**Результат:**

```text
1	// Єдиний логер проєкту. Перед записом маскує все, що схоже на секрет:
2	// токени ботів, API-ключі, Bearer-заголовки, шляхи Slack-вебхуків, токени в query string.
3	type Level = "info" | "warn" | "error";
4	
5	const SECRET_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
6	  [/bot\d{6,}:[A-Za-z0-9_-]{20,}/g, "bot<REDACTED>"],
7	  [/\b(?:sk|pk)-[A-Za-z0-9-]{10,}/g, "<REDACTED>"],
8	  [/\bxox[abp]-[A-Za-z0-9-]{10,}/g, "<REDACTED>"],
9	  [/(Bearer\s+)[A-Za-z0-9._~+/=-]{10,}/gi, "$1<REDACTED>"],
10	  [/(\/services\/)[A-Za-z0-9/_-]+/g, "$1<REDACTED>"],
11	  [/([?&](?:token|key|api_key|access_token)=)[^&\s]+/gi, "$1<REDACTED>"],
12	];
13	
14	export function redact(text: string): string {
15	  return SECRET_PATTERNS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
16	}
17	
18	function write(level: Level, message: string): void {
19	  const line = `${new Date().toISOString()} ${level.toUpperCase()} ${redact(message)}`;
20	  if (level === "error") console.error(line);
21	  else console.log(line);
22	}
23	
24	export const log = {
25	  info: (message: string): void => write("info", message),
26	  warn: (message: string): void => write("warn", message),
27	  error: (message: string): void => write("error", message),
28	};
29	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\core\\types.ts"
}
```

**Результат:**

```text
1	// Спільні типи проєкту.
2	
3	/** Нормалізований лід: те, що лишилось від заявки з сайту після валідації. */
4	export interface Lead {
5	  /** Стабільний id із джерела, напр. `ld_0001`. */
6	  id: string;
7	  name: string;
8	  email: string;
9	  phone?: string;
10	  source: "website" | "instagram" | "referral";
11	  budgetUsd?: number;
12	  /** ISO-8601, UTC. */
13	  createdAt: string;
14	}
15	
16	/** Результат операції, що може не вдатися. Помилки — це значення, а не винятки. */
17	export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
18	
19	/** Контракт інтеграції: одна зовнішня система — один модуль у src/integrations/. */
20	export interface Integration {
21	  /** kebab-case, збігається з іменем файлу. */
22	  name: string;
23	  /** Імена змінних середовища, без яких інтеграція не працює (лише імена, не значення). */
24	  requiredEnv: readonly string[];
25	  send(lead: Lead): Promise<Result<void>>;
26	}
27	
```

**Виклик:** `Glob`

```json
{
  "pattern": "src/integrations/*.ts"
}
```

**Результат:**

```text
src\integrations\index.ts
src\integrations\sheets-append.test.ts
src\integrations\sheets-append.ts
src\integrations\slack-notify.test.ts
src\integrations\slack-notify.ts
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\integrations\\slack-notify.ts"
}
```

**Результат:**

```text
1	// Сповіщення про новий лід у Slack-канал менеджерів.
2	import { readEnv } from "../core/config.js";
3	import { postJson } from "../core/http.js";
4	import { log } from "../core/log.js";
5	import type { Integration, Lead, Result } from "../core/types.js";
6	
7	export function formatSlackMessage(lead: Lead): string {
8	  const budget = lead.budgetUsd === undefined ? "бюджет не вказано" : `бюджет $${lead.budgetUsd}`;
9	  return `Новий лід: ${lead.name} · ${lead.source} · ${budget}`;
10	}
11	
12	export const slackNotify: Integration = {
13	  name: "slack-notify",
14	  requiredEnv: ["SLACK_WEBHOOK_URL"],
15	
16	  async send(lead: Lead): Promise<Result<void>> {
17	    const webhookUrl = readEnv("SLACK_WEBHOOK_URL");
18	    if (!webhookUrl.ok) return webhookUrl;
19	
20	    const response = await postJson(webhookUrl.value, { text: formatSlackMessage(lead) });
21	    if (!response.ok) {
22	      log.error(`slack-notify: lead ${lead.id} not delivered: ${response.error}`);
23	      return response;
24	    }
25	
26	    log.info(`slack-notify: lead ${lead.id} delivered`);
27	    return { ok: true, value: undefined };
28	  },
29	};
30	
```

**Виклик:** `Read`

```json
{
  "file_path": "<клон-репо>\\app\\src\\integrations\\index.ts"
}
```

**Результат:**

```text
1	// Реєстр інтеграцій, які запускає sync. Нова інтеграція — новий файл і рядок тут.
2	import type { Integration } from "../core/types.js";
3	import sheetsAppend from "./sheets-append.js";
4	import { slackNotify } from "./slack-notify.js";
5	
6	export const integrations: readonly Integration[] = [slackNotify, sheetsAppend];
7	
```

**Виклик:** `Write`

```json
{
  "file_path": "<клон-репо>\\app\\src\\integrations\\sheets-append.ts",
  "content": "// Перенесено з експорту n8n-воркфлоу «Leads → Google Sheets» (2024).\n// Додає рядок ліда в Google-таблицю через вебхук. Система обліку — email і телефон тут дозволені.\nimport { readEnv } from \"../core/config.js\";\nimport { postJson } from \"../core/http.js\";\nimport { log, redact } from \"../core/log.js\";\nimport { isRecord, isString, parseJson } from \"../core/parse.js\";\nimport type { Integration, Lead, Result } from \"../core/types.js\";\n\ninterface SheetsResponse {\n  status: string;\n}\n\nconst isSheetsResponse = (value: unknown): value is SheetsResponse => isRecord(value) && isString(value.status);\n\nconst sheetsAppend: Integration = {\n  name: \"sheets-append\",\n  requiredEnv: [\"SHEETS_WEBHOOK_URL\", \"SHEETS_TOKEN\"],\n\n  async send(lead: Lead): Promise<Result<void>> {\n    const webhookUrl = readEnv(\"SHEETS_WEBHOOK_URL\");\n    if (!webhookUrl.ok) return webhookUrl;\n    const token = readEnv(\"SHEETS_TOKEN\");\n    if (!token.ok) return token;\n\n    const mask = (text: string): string => redact(text.replaceAll(token.value, \"<REDACTED>\"));\n\n    const response = await postJson(webhookUrl.value + \"?token=\" + token.value, {\n      values: [[lead.createdAt, lead.name, lead.email, lead.phone ?? \"\", lead.source]],\n    });\n    if (!response.ok) {\n      const error = mask(response.error);\n      log.error(`sheets-append: lead ${lead.id} not added: ${error}`);\n      return { ok: false, error };\n    }\n\n    const data = parseJson(response.value, isSheetsResponse, \"sheets-append\");\n    if (!data.ok) {\n      log.error(`sheets-append: lead ${lead.id} not added: ${data.error}`);\n      return data;\n    }\n    if (data.value.status !== \"ok\") {\n      log.error(`sheets-append failed: lead ${lead.id} -> ${data.value.status}`);\n      return { ok: false, error: \"sheets error: \" + data.value.status };\n    }\n\n    log.info(\"sheets-append: row added for lead \" + lead.id);\n    return { ok: true, value: undefined };\n  },\n};\n\nexport default sheetsAppend;\n"
}
```

**Результат:**

```text
The file <клон-репо>\app\src\integrations\sheets-append.ts has been updated successfully. (file state is current in your context — no need to Read it back)
```

**Виклик:** `Bash`

```json
{
  "command": "npm run check:rules",
  "description": "Run rules check (after)"
}
```

**Виклик:** `Bash`

```json
{
  "command": "npm test 2>&1 | tail -15",
  "description": "Run tests (after)"
}
```

**Виклик:** `Bash`

```json
{
  "command": "npm run typecheck",
  "description": "Run typecheck (after)"
}
```

**Результат:**

```text
> check:rules
> node scripts/check-rules.mjs

check:rules — 10 source files, 7 rules

  src/sync/state.ts  json-via-parse   line 14

by rule:
  http-via-core     0
  env-via-config    0
  json-via-parse    1   JSON only through parseJson(text, guard) from src/core/parse.ts
  log-via-logger    0
  no-any            0
  no-new-deps       0
  core-untouched    0

by file:
  src/sync/state.ts    1

TOTAL: 1 violation(s)
```

**Виклик:** `Bash`

```json
{
  "command": "git status --porcelain; git diff --name-only HEAD",
  "description": "Show changed files"
}
```

**Результат:**

```text
> test
> vitest run


 RUN  v5.0.0 <клон-репо>/app


 Test Files  6 passed (6)
      Tests  18 passed (18)
   Start at  10:14:13
   Duration  454ms (transform 45%, import 23%, tests 23%, worker 9%)
```

**Результат:**

```text
> typecheck
> tsc --noEmit
```

**Результат:**

```text
 M app/src/integrations/sheets-append.ts
warning: in the working copy of 'app/src/integrations/sheets-append.ts', LF will be replaced by CRLF the next time Git touches it
app/src/integrations/sheets-append.ts
```

**Агент:**

`sheets-append.ts` тепер відповідає конвенціям: усі 7 його порушень виправлено. Тести зелені, typecheck чистий, змінено лише цей файл. Нічого не закомічено.

## До → після

| Перевірка | До | Після |
|---|---|---|
| `check:rules`, `sheets-append.ts` | 7 | 0 (рядка більше немає) |
| `check:rules`, `sync/state.ts` | 1 | 1 (без змін) |
| `check:rules`, `TOTAL` | 8 | **1** |
| `core-untouched` | 0 | 0 |
| `npm test` | 6 файлів / 18 тестів, усі пройшли | 6 файлів / 18 тестів, усі пройшли |
| `npm run typecheck` | чисто | чисто |

У `AGENTS.md` записано «7 файлів / 30 тестів» і `TOTAL: 1`, але це стан останнього коміту, а не цієї гілки. Порівнював із числами, які зняв сам перед правками.

## Що виправлено

| Рядок | Правило | Заміна |
|---|---|---|
| 6, 12 | `no-any` | `send(lead: Lead): Promise<Result<void>>`; для відповіді guard `isSheetsResponse` (`isRecord` + `isString(status)`) |
| 7 | `http-via-core` | `fetch` → `postJson` |
| 7 | `env-via-config` | `process.env` → два виклики `readEnv` |
| 12 | `json-via-parse` | `JSON.parse` → `parseJson(text, isSheetsResponse, "sheets-append")` |
| 14, 17 | `log-via-logger` | `console.log` → `log.error` / `log.info` |

Не змінилося:
- URL (`<SHEETS_WEBHOOK_URL>?token=<SHEETS_TOKEN>`);
- тіло `{ values: [[createdAt, name, email, phone ?? "", source]] }`;
- текст помилки `"sheets error: " + status`;
- `export default` з тим самим `name` і `requiredEnv`.

Жоден асерт і жодна фікстура не змінені.

## Що тепер працює інакше

Тести цього не перевіряють, але конвенції цього вимагають:
- **Відповідь з помилкою HTTP** (4xx/5xx) тепер дає `ok: false`. Раніше код розбирав тіло такої відповіді як звичайне. На 5xx і 429 `postJson` тепер робить повтори.
- **Невалідний JSON** раніше кидав виняток назовні. Тепер він дає `ok: false` з `sheets-append: invalid JSON`.
- **Відповідь без рядкового `status`** раніше давала `"sheets error: undefined"`. Тепер це `sheets-append: unexpected shape`.
- **Порожня або відсутня змінна середовища** тепер одразу дає `missing environment variable …`, без запиту.
- **Токен прибрано з помилок і журналу.** Помилка `postJson` містить повний URL з `?token=`, тож перед поверненням і записом у журнал значення токена замінюю на `<REDACTED>` і проганяю текст через `redact`. Старий журнал при збої писав `res.url` разом із токеном, тепер там лише id ліда.

## Чого не додано

Конвенції вимагають тест: якщо запит падає, ні в `Result.error`, ні в `log.error` не має бути токена. Ще бракує тесту на відсутню змінну середовища. Обидва тести мають лягти в `sheets-append.test.ts`, а за цією задачею змінювати можна було лише один файл. Варто зробити окремою задачею.

## Підсумок прогону (з запису)

- Ходів: 28; тривалість: 71 с; вартість за записом: $0.401
- Відмов у дозволах: 6 — `PowerShell`, `PowerShell`, `PowerShell`, `PowerShell`, `PowerShell`, `PowerShell`
