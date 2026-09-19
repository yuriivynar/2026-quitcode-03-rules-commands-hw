# CLAUDE.md

@AGENTS.md

Специфічне для Claude Code:

- Правила проєкту — `.claude/rules/`. `do-not-touch.md` без `paths` (діє завжди);
  `architecture.md` і `conventions.md` прив'язані до `app/src/**`.
- Команди — `.claude/commands/`: `/analyze-error`, `/refactor`,
  `/generate-integration`.
- Перевірити, що базу завантажено: `/context` → розділ **Memory files**.
