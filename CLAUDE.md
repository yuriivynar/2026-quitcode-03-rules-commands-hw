# CLAUDE.md

@AGENTS.md

Специфічне для Claude Code:

- Правила проєкту — `.claude/rules/`. `do-not-touch.md` без `paths` (діє завжди);
  `architecture.md` і `conventions.md` прив'язані до `app/src/**`.
- Команди — `.claude/commands/`: `/analyze-error`, `/refactor`,
  `/generate-integration`.
- Хук — `.claude/settings.json` → `PreToolUse` запускає
  `.claude/hooks/protect-core.mjs`: спроба змінити захищений шлях завершується
  кодом `2`, тобто дію заблоковано, а не відмовлено на словах. Читається на
  старті сесії — після правки хука Claude Code треба перезапустити.
- Перевірити, що базу завантажено: `/context` → розділ **Memory files**.
