# HyperFrames Handoff

Use this reference before generating HyperFrames composition HTML.

## Required Package

Create these files before composition work:

- `DESIGN.md`: visual identity, palette, typography, motion rules, anti-patterns.
- `storyboard.csv`: editable scene timing and scene states.
- `timed-storyboard.csv`: editable final scene timing when matched to real user recording.
- `production-brief.md`: implementation notes for HyperFrames.
- `../02-script/spoken-script.md`: approved or draft voiceover.
- `../02-script/subtitle-lines.md`: compressed caption lines.
- `../03-assets/asset-manifest.json`: all images, video, audio, and graphics.

## DESIGN.md Shape

```markdown
# DESIGN

## Style Prompt
[One paragraph that describes the visual world.]

## Colors
- Background: #...
- Primary text: #...
- Accent: #...
- Support: #...

## Typography
- Display: ...
- Body: ...

## Motion
- Entrance:
- Emphasis:
- Transitions:
- Avoid:

## What NOT to Do
- ...
```

The visual identity must come from the subject and audience, not default UI colors.

## Storyboard Table Shape

Use CSV as the working format:

```csv
Scene,Start,Duration,Chapter,Layout state,Assets,Text,Motion,Audio
s01-hook,0.0,3.5,Hook,"Hero image fills frame, headline lower-left",ch01-hero-01,"Main caption","Slow push-in, caption reveal","VO line 1"
```

Rules:

- Use exact seconds.
- Keep scene IDs stable and filename-safe.
- Define the most visible layout state before describing animation.
- If a scene reuses space over time, describe entry and exit order.
- Keep track-index intent clear when video/audio/overlays coexist.
- If a real recording exists, use `timed-storyboard.csv` as the source of truth instead of estimated storyboard timing.

## Production Brief

Include:

- Target aspect ratio and resolution: `1920x1080`, `1080x1920`, or other.
- Total duration.
- Composition list and whether each is root or sub-composition.
- Asset paths and intended crop.
- Caption strategy: burned-in captions, emphasized keywords, lower thirds, or none.
- Voiceover/audio files if present.
- Transition strategy.
- Data-track plan: video, audio, composition overlays, captions, and decorative layers.
- Risk list: missing assets, unverified claims, license uncertainties, timing risk.

## HyperFrames Rules to Preserve

- Build final layout first, then animate into and out of it.
- Register timelines synchronously with `window.__timelines["composition-id"] = tl`.
- Use `data-duration`; do not fake duration with empty tweens.
- Keep video muted and pair it with separate audio when audio is needed.
- Use deterministic animation; no `Math.random()` or time-based layout.
- Do not use infinite repeats; calculate finite repeat counts.

## Handoff Checklist

- `DESIGN.md` exists before HTML work starts.
- Every scene has duration, chapter, layout state, text, and motion.
- Every visual asset has an ID that matches the manifest.
- Missing assets have generation prompts or fallback treatments.
- Current facts and claims are verified or marked.
- The final package is ready for HyperFrames lint, preview, and render.
