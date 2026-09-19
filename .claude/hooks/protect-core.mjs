#!/usr/bin/env node
// PreToolUse-хук: правило .claude/rules/do-not-touch.md ПРОСИТЬ не чіпати захищені
// шляхи — цей скрипт НЕ ДАЄ. Читає JSON зі stdin, дістає шлях і, якщо той веде в
// захищену зону, пише причину в stderr і виходить з кодом 2 (дію заблоковано).
//
// Node, а не bash — щоб працювало й на Windows.
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/** Теки з do-not-touch.md. Усе, що всередині, — недоторкане. */
const PROTECTED_DIRS = [
  "app/src/core",
  "app/scripts",
  "materials",
  ".github",
  // Сам механізм примусу: do-not-touch прямо забороняє «послабити чи вимкнути
  // перевірку … правкою власних правил чи хуків у .claude/**». Без цього рядка
  // хук дозволяв би відредагувати самого себе — а це перший обхід, який агент
  // пропонує, щойно впирається в заборону (див. docs/ab-validation.md, крок 1).
  // `.claude/rules` і `.claude/commands` навмисно НЕ тут: це звичайний робочий
  // вміст, який має лишатись редагованим.
  ".claude/hooks",
];
/** Окремі файли звідти ж. */
const PROTECTED_FILES = [".coderabbit.yaml", ".claude/settings.json"];

const BLOCK = 2;
const ALLOW = 0;

/** Блокує дію: текст зі stderr бачить модель. */
function block(reason) {
  process.stderr.write(
    `Заблоковано хуком protect-core: ${reason}\n` +
      "Це захищена зона (.claude/rules/do-not-touch.md). Правити її не можна — " +
      "ні «дрібний фікс», ні «одне поле», ні обхід копією в integrations/.\n" +
      "Зупинись і дай звіт за чотирма пунктами правила do-not-touch: " +
      "що саме треба змінити (файл, експорт, сигнатура) і навіщо; що вже зроблено " +
      "поза захищеними шляхами; який обхід теоретично можливий і чому він гірший; " +
      "далі чекай відповіді людини.\n",
  );
  process.exit(BLOCK);
}

let raw = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) raw += chunk;

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  // Тихо пропустити не можна: непрочитаний вхід = захисту немає, і ніхто цього не
  // помітить. Це рівно той механізм, що спричинив нічний інцидент у sync/state.ts.
  block("не вдалося розібрати вхідний JSON хука, тому шлях невідомий");
}

const input = payload.tool_input ?? {};
const filePath = input.file_path ?? input.notebook_path ?? input.path;

if (typeof filePath !== "string" || filePath.trim() === "") {
  block(`інструмент ${payload.tool_name ?? "?"} не назвав шлях, який він змінює`);
}

// Корінь репозиторію рахуємо від самого скрипта (.claude/hooks/ → два рівні вгору),
// а НЕ від payload.cwd: якщо сесія працює в підтеці (`cd app`, як у walkthrough),
// шлях, порахований від cwd, перестає збігатися з "app/src/core/**" — і захист
// тихо зникає. Перевірено: з cwd = <repo>/app правка ядра проходила повз хук.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Відносний шлях розкриваємо від cwd сесії (це його справжня база); абсолютний
// resolve() лишає як є. Порівнюємо завжди з коренем репозиторію.
const target = resolve(payload.cwd ?? process.cwd(), filePath);
const rel = relative(repoRoot, target).split(sep).join("/");

// Поза проєктом — не наша зона відповідальності.
if (rel === "" || rel.startsWith("../")) process.exit(ALLOW);

// Windows порівнює шляхи без урахування регістру: app/src/Core/log.ts — той самий файл.
const probe = rel.toLowerCase();

for (const file of PROTECTED_FILES) {
  if (probe === file.toLowerCase()) block(`спроба змінити ${rel}`);
}
for (const dir of PROTECTED_DIRS) {
  const prefix = `${dir.toLowerCase()}/`;
  if (probe === dir.toLowerCase() || probe.startsWith(prefix)) {
    block(`спроба змінити ${rel} — це ${dir}/**`);
  }
}

process.exit(ALLOW);
