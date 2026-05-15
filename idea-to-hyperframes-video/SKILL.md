---
name: idea-to-hyperframes-video
description: Use when turning rough creative ideas, voice-note transcripts, scattered notes, topic briefs, product inputs, or reference links into polished spoken video scripts, storyboard tables, visual asset plans, or HyperFrames-ready production handoffs.
---

# Idea to HyperFrames Video

## Overview

Turn vague source material into a production-ready video package through three linked stages: spoken script, storyboard, and HyperFrames handoff. Keep the chain continuous so the hook, narration, visuals, timing, assets, and final composition all express the same idea.

## First Move

Start from the user's raw input. If a voice file is supplied, transcribe it first with the available transcription tooling, then treat the transcript as raw input. If only an idea is supplied, ask at most three missing-context questions before drafting; otherwise make explicit assumptions and continue.

Use `scripts/create_video_workspace.py <slug> --output <dir>` when a new video project needs a clean production folder.

## Integrated Workflow

### 1. Voice or Idea to Spoken Script

Read `references/spoken-script.md` and `references/script-framework.md`.

Do this before writing the full script:

   - Identify topic, audience, platform, duration, tone, intended action, and any forbidden claims.
   - Distill the core promise into one sentence.
   - Preserve user language that has personality; clean up only what blocks comprehension.
   - Extract reusable lines, hooks, examples, proof points, and emotional turns from the raw input.

Then produce:

   - `01-brief/video-brief.md`
   - `02-script/spoken-script.md`
   - `02-script/subtitle-lines.md`
   - `02-script/script-review.md`

### 2. Spoken Script to Storyboard

Read `references/storyboard-framework.md`.

Convert the spoken script into visual production logic:

   - Split narration into timed chapters and scenes.
   - Give every spoken beat a visual job: prove, clarify, dramatize, compare, locate, or transition.
   - Write on-screen text separately from voiceover; it must be shorter and mobile-readable.
   - Define scene transitions as narrative movement, not generic decoration.

Then produce:

   - `02-script/chapter-script.csv`
   - `03-assets/asset-manifest.json`
   - `03-assets/source-notes.md`
   - `03-assets/generation-prompts.md`

### 3. Storyboard to HyperFrames Handoff

Read `references/hyperframes-handoff.md`.

Prepare production-ready instructions:

   - Produce `04-hyperframes/DESIGN.md` before any composition HTML is written.
   - Output exact scene timing, layout states, asset IDs, caption strategy, audio notes, and motion notes.
   - Check HyperFrames constraints before implementation.
   - Then invoke the HyperFrames skills for HTML composition, linting, preview, and render.

Then produce:

   - `04-hyperframes/DESIGN.md`
   - `04-hyperframes/storyboard.csv`
   - `04-hyperframes/timed-storyboard.csv` when a user recording is available
   - `04-hyperframes/production-brief.md`

## Output Contract

For a full video package, create or update these files:

- `00-input/raw-idea.md` or `00-input/transcript.md`
- `01-brief/video-brief.md`
- `02-script/spoken-script.md`
- `02-script/subtitle-lines.md`
- `02-script/chapter-script.csv`
- `02-script/script-review.md`
- `03-assets/asset-manifest.json`
- `03-assets/source-notes.md`
- `03-assets/generation-prompts.md`
- `04-hyperframes/DESIGN.md`
- `04-hyperframes/storyboard.csv`
- `04-hyperframes/timed-storyboard.csv` when matched to real recording timing
- `04-hyperframes/production-brief.md`

For quick requests, return the same structure inline with only the relevant sections.

## Quality Gates

- No full script before the core promise is clear.
- No article-like copy; spoken scripts must survive reading aloud.
- No line of voiceover without a visual beat or an intentional audio-only reason.
- No storyboard scene without timing, layout state, text, assets, motion, and audio notes.
- No HyperFrames HTML before visual identity exists.
- No stock-like asset brief when the topic needs a real product, place, person, interface, document, or scene.
- No unsupported claims in narration; label research gaps clearly.
- No orphaned chapter: each chapter must have a script purpose, visual purpose, and timing.
- No asset without a source note or generation prompt.
- No generic transitions; each transition should express narrative movement.

## Common Mistakes

- Treating the voice transcript as final copy instead of extracting intent and rhythm.
- Optimizing for beautiful written language instead of natural spoken delivery.
- Writing a script with no visual beat per sentence.
- Collecting images before defining what each chapter must prove or evoke.
- Using one visual style for every topic; choose style from the subject, audience, and platform.
- Handing HyperFrames vague direction instead of exact dimensions, durations, asset names, and scene states.
