# Repository Guidelines

## Project Structure & Module Organization
- `web/` contains the Next.js app; keep UI logic in `components/`, server/client helpers in `lib/`, shared state in `contexts/`, and custom hooks in `hooks/`.
- Pages live under `web/pages/` with static routes (`index.js`) and dynamic segments (`test/[id].js`, `result/[id].js`, etc.); assets belong in `public/`.
- Localization lives in `web/locales/` (nested JSON keys) with reference data in `web/data/`; ship language additions in sync.
- Use root translation scripts (`create_translations.py`, `translate_tests.py`, `translate_batch.sh`) to batch-generate or reconcile content before committing, and prefer `scripts/add_love_tests.py` when bulk-extending the love/relationship catalog with multilingual data.

## Build, Test, and Development Commands
```bash
cd web
npm run dev      # Start the Next.js dev server with hot reload
npm run build    # Create the static export in web/out
npm run start    # Serve the production build locally
npm run migrate  # Populate Firestore using scripts/migrate-to-firestore.js
```

## Coding Style & Naming Conventions
- Write modern ES modules with 2-space indentation; rely on the Next.js formatter (`npx next lint --fix` when enabled) and avoid manual stylistic tweaks.
- Use `PascalCase` for React components, `camelCase` for functions/variables, and kebab-case for file names. Keep translation keys lowercase with dot-separated scopes (`seo.home.title`).
- Import via the `@/` alias (configured in `jsconfig.json`) instead of relative paths when referencing modules inside `web/`.

## Testing Guidelines
- Automated E2E tests have been removed; rely on targeted manual QA flows (home → test → result, language switching, consent banner).
- Capture browser console output when reporting regressions; attach reproduction steps to PR descriptions.
- Keep the root `tests_*.json` fixtures aligned with translated locales to avoid mismatched copy.

## Commit & Pull Request Guidelines
- Follow the existing Conventional Commit style (`feat: …`, `fix: …`, `chore: …`) with concise scope and allow Korean descriptions where appropriate.
- Each PR should describe the user-facing change, list the commands run (build/tests/migrate), and link related issues or translation batches (e.g., `batch_04.json`).
- Attach UI screenshots when visuals shift, note migration or Playwright prerequisites, and confirm sensitive files (notably `lib/firebase-admin.js`) stay untracked.

## Localization & Content Workflow
- Update `web/locales/<lang>.json` alongside `tests_<lang>*.json` so language copies remain aligned.
- Log manual edits in `translation_log.txt` and update README localization notes when coverage statistics move.
- Land large content imports as standalone PRs to keep reviews focused and deployments stable.
