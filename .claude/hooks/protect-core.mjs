#!/usr/bin/env node
// PreToolUse-хук: правило .claude/rules/do-not-touch.md ПРОСИТЬ не чіпати захищені
// шляхи — цей скрипт НЕ ДАЄ. Читає JSON зі stdin, дістає шлях і, якщо той веде в
// захищену зону, пише причину в stderr і виходить з кодом 2 (дію заблоковано).
//
// Node, а не bash — щоб працювало й на Windows.
import { relative, resolve, sep } from "node:path";

/** Теки з do-not-touch.md. Усе, що всередині, — недоторкане. */
const PROTECTED_DIRS = ["app/src/core", "app/scripts", "materials", ".github"];
/** Окремі файли звідти ж. */
const PROTECTED_FILES = [".coderabbit.yaml"];

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

const root = resolve(payload.cwd ?? process.cwd());
const rel = relative(root, resolve(root, filePath)).split(sep).join("/");

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
