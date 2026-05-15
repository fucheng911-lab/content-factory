# Content Factory V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 local web app for project creation, Markdown skill management, project-level skill enablement, AI-assisted spoken-script editing, version history, and final recording script saving.

**Architecture:** A local-first app with a React/Vite frontend and an Express backend. The frontend never sees third-party API keys; the server reads local settings, stores JSON/Markdown files under `data/`, assembles AI prompts from project data and enabled skills, and calls an OpenAI-compatible provider.

**Tech Stack:** React, TypeScript, Vite, TipTap, Node.js, Express, Vitest, local filesystem JSON/Markdown storage.

---

## File Structure

- `package.json`: root scripts and dependencies.
- `tsconfig.json`: shared TypeScript defaults.
- `apps/web/`: React frontend.
- `apps/web/src/App.tsx`: page routing shell and application state.
- `apps/web/src/api/client.ts`: browser API client for the local backend.
- `apps/web/src/components/`: focused UI components for project list, creation form, skill manager, editor, and version history.
- `apps/web/src/styles.css`: complete responsive app styling.
- `apps/server/index.js`: Express local API.
- `apps/server/lib/store.js`: filesystem storage for projects, skills, versions, and settings.
- `apps/server/lib/skills.js`: Markdown frontmatter parsing and validation.
- `apps/server/lib/ai.js`: OpenAI-compatible provider adapter and prompt assembly.
- `apps/server/lib/script.js`: fallback local script generation/rewrite helpers for empty provider settings.
- `apps/server/lib/*.test.js`: backend unit tests.
- `data/.gitkeep`: placeholder for local runtime data; generated JSON/Markdown data stays ignored.
- `.gitignore`: excludes dependencies, build output, local settings, and runtime data.
- `README.md`: local setup and usage instructions.

## Tasks

### Task 1: Scaffold Local App

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/styles.css`
- Create: `apps/server/index.js`
- Create: `.gitignore`
- Create: `data/.gitkeep`

- [ ] **Step 1: Create root scripts**

Use root scripts for `dev`, `build`, `test`, `dev:web`, and `dev:server`. `dev` runs web and server together.

- [ ] **Step 2: Create minimal React app**

Implement a basic shell that calls `/api/health` and renders the V1 layout placeholder.

- [ ] **Step 3: Create Express health endpoint**

Expose `GET /api/health` returning `{ "ok": true }`.

- [ ] **Step 4: Verify**

Run `npm install`, `npm run build`, and start `npm run dev`. Check `http://127.0.0.1:5173/` and `http://127.0.0.1:5174/api/health`.

- [ ] **Step 5: Commit**

Commit as `Scaffold content factory V1 app`.

### Task 2: Implement Local Storage and Skill Library

**Files:**
- Create: `apps/server/lib/store.js`
- Create: `apps/server/lib/skills.js`
- Create: `apps/server/lib/skills.test.js`
- Modify: `apps/server/index.js`
- Modify: `apps/web/src/api/client.ts`
- Create: `apps/web/src/components/SkillManager.tsx`

- [ ] **Step 1: Test Markdown skill validation**

Test valid frontmatter, missing `name`, invalid `name`, missing `description`, and unsupported extension.

- [ ] **Step 2: Implement skill parser**

Parse frontmatter from Markdown, require `name` and `description`, default `displayName` to `name`, default `type` to `script-writing`, and default `version` to `1.0.0`.

- [ ] **Step 3: Implement skill storage**

Save skills under `data/skills/<name>.md`, list metadata, read full content, and delete skills.

- [ ] **Step 4: Add API routes**

Add:
- `GET /api/skills`
- `GET /api/skills/:id`
- `POST /api/skills`
- `DELETE /api/skills/:id`

- [ ] **Step 5: Build Skill Manager UI**

Support file upload, list, preview, and delete. Uploaded skills become global library resources and do not auto-enable for projects.

- [ ] **Step 6: Verify**

Run `npm test` and `npm run build`.

- [ ] **Step 7: Commit**

Commit as `Add Markdown skill library`.

### Task 3: Implement Projects and Project-Level Skill Enablement

**Files:**
- Modify: `apps/server/lib/store.js`
- Create: `apps/server/lib/projects.test.js`
- Modify: `apps/server/index.js`
- Create: `apps/web/src/components/ProjectList.tsx`
- Create: `apps/web/src/components/ProjectForm.tsx`
- Create: `apps/web/src/components/ProjectSkillPicker.tsx`
- Modify: `apps/web/src/App.tsx`

- [ ] **Step 1: Test project persistence**

Test creating, listing, reading, updating, deleting projects, and saving project-level `enabledSkillIds`.

- [ ] **Step 2: Implement project storage**

Store each project at `data/projects/<projectId>/project.json`; include all PRD fields and timestamps.

- [ ] **Step 3: Add API routes**

Add:
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`

- [ ] **Step 4: Build project UI**

Implement project list, create form, open project, delete project, and status display.

- [ ] **Step 5: Build project skill picker**

Allow each project to select skills from the global Skill Library. Persist `enabledSkillIds` only on the current project.

- [ ] **Step 6: Verify**

Run `npm test` and `npm run build`.

- [ ] **Step 7: Commit**

Commit as `Add project management and project skill enablement`.

### Task 4: Implement AI Script Generation and Editing

**Files:**
- Create: `apps/server/lib/ai.js`
- Create: `apps/server/lib/script.js`
- Create: `apps/server/lib/ai.test.js`
- Modify: `apps/server/index.js`
- Create: `apps/web/src/components/ScriptEditor.tsx`
- Create: `apps/web/src/components/AiPanel.tsx`
- Modify: `apps/web/src/App.tsx`

- [ ] **Step 1: Test prompt assembly**

Verify AI context order: system base rules, project info, enabled skills, current script, selected text, user instruction, output format.

- [ ] **Step 2: Implement provider adapter**

Read provider settings from environment variables or local settings. Support OpenAI-compatible `baseUrl`, `apiKey`, and `model`. If no API key exists, use deterministic local fallback output so the UI remains usable during setup.

- [ ] **Step 3: Add AI API routes**

Add:
- `POST /api/projects/:id/generate-script`
- `POST /api/projects/:id/rewrite-full`
- `POST /api/projects/:id/rewrite-selection`

- [ ] **Step 4: Build TipTap editor**

Use TipTap for the main script editor. Support editing, selection capture, save draft, and save final script.

- [ ] **Step 5: Build AI operation panel**

Support generate initial draft, rewrite full text, rewrite selected text, and custom instruction.

- [ ] **Step 6: Verify**

Run `npm test`, `npm run build`, and manually verify local fallback AI actions.

- [ ] **Step 7: Commit**

Commit as `Add AI script editor workflow`.

### Task 5: Implement Version History and Documentation

**Files:**
- Modify: `apps/server/lib/store.js`
- Create: `apps/server/lib/versions.test.js`
- Modify: `apps/server/index.js`
- Create: `apps/web/src/components/VersionHistory.tsx`
- Modify: `apps/web/src/App.tsx`
- Create: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Test version history**

Test version creation for generate, full rewrite, selection rewrite, manual save, final script, and rollback.

- [ ] **Step 2: Implement version storage**

Store versions under `data/projects/<projectId>/versions/<versionId>.json`.

- [ ] **Step 3: Add version API routes**

Add:
- `GET /api/projects/:id/versions`
- `POST /api/projects/:id/versions`
- `POST /api/projects/:id/versions/:versionId/restore`
- `POST /api/projects/:id/final-script`

- [ ] **Step 4: Build version history UI**

Show version source, time, instruction, enabled skills, preview, restore action, and final-script marker.

- [ ] **Step 5: Write README**

Document local startup, provider environment variables, Markdown skill format, and V1 boundaries.

- [ ] **Step 6: Final verification**

Run:
- `npm test`
- `npm run build`
- `npm run dev`

Manually verify project creation, skill upload, project-level skill enablement, AI generation fallback, editing, version save, rollback, and final script save.

- [ ] **Step 7: Commit and push**

Commit as `Complete content factory V1 MVP` and push to GitHub.

## Self-Review

- Spec coverage: The plan covers project management, Markdown skill management, project-level skill enablement, AI provider adapter, TipTap editor, version history, and final script saving.
- Out of scope: Video production, recording, transcription, storyboard, asset collection, HyperFrames, accounts, collaboration, cloud database, and publishing remain excluded.
- Data consistency: `Project.enabledSkillIds` is project-level and references global skills stored under `data/skills/`.
- Provider safety: API keys stay server-side; browser calls only local backend routes.
