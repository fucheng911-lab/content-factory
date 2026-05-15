# Storyboard Framework

Use this reference when converting a spoken script into scenes, visual beats, asset needs, and transitions.

## Principle

The storyboard is the bridge between language and production. Every scene must answer: what does the viewer hear, what do they see, why does this visual belong here, and how does it move to the next moment?

## Scene Splitting

Split scenes by:

- New idea or chapter.
- New visual subject.
- Change in emotional energy.
- Proof/detail moment.
- Transition from problem to method, method to proof, or proof to takeaway.

Short-form pacing guide:

- 0-3s: Hook or visual interruption.
- 3-8s: Context and tension.
- 8-20s: Method, example, or proof.
- 20-35s: Development and payoff.
- Final 3-6s: takeaway or action.

Adjust to the requested duration and platform.

## Storyboard Table

Use editable spreadsheet-style tables as the primary output. Prefer CSV files because they open cleanly in Numbers, Excel, Google Sheets, and most editors.

Primary files:

- `02-script/chapter-script.csv`: chapter-level script planning.
- `04-hyperframes/storyboard.csv`: scene-level storyboard before user recording.
- `04-hyperframes/timed-storyboard.csv`: scene-level storyboard after matching real recorded audio/video timing.

Use this column set for `storyboard.csv`:

| Scene | Start | Duration | Voiceover | On-screen text | Visual job | Layout state | Asset need | Motion | Transition |
|---|---:|---:|---|---|---|---|---|---|---|

Column rules:

- `Scene`: stable IDs like `s01-hook`, `s02-problem`, `s03-proof`.
- `Start` and `Duration`: exact seconds once timing is known; estimates are acceptable in draft.
- `Voiceover`: spoken line or line range.
- `On-screen text`: subtitle, headline, label, stat, or none.
- `Visual job`: prove, clarify, dramatize, compare, locate, humanize, establish mood, or bridge.
- `Layout state`: describe the most visible frame before animation.
- `Asset need`: concrete search/generation/design need.
- `Motion`: entrance, emphasis, camera movement, reveal, text animation.
- `Transition`: meaningful movement into the next scene.

Use this column set for `chapter-script.csv`:

| Chapter | Estimated time | Purpose | Voiceover | Subtitle | Visual beat | Asset need | Transition |
|---|---:|---|---|---|---|---|---|

Use this column set for `timed-storyboard.csv` after a real recording exists:

| Scene | Start | End | Duration | Recording line | Subtitle | Visual job | Layout state | Asset IDs | Motion | Transition | Notes |
|---|---:|---:|---:|---|---|---|---|---|---|---|---|

When the user wants to edit the storyboard, produce or update CSV instead of Markdown. Markdown tables are acceptable only for quick chat previews.

## Visual Beat Standards

Weak:

- "Show product."
- "Add background image."
- "Use some B-roll."

Strong:

- "Macro shot of the product clasp enters from darkness while the line names the hidden detail."
- "Split screen compares messy transcript on left and tightened script table on right."
- "Cursor highlights the exact row where voiceover becomes visual beat."

## Transition Patterns

Use transitions that express meaning:

- Contrast cut: before/after, wrong/right, messy/clear.
- Match cut: same shape or object carries viewer to the next scene.
- Push-in: move from broad idea to detail.
- Pull-back: move from detail to system.
- Wipe by object: a card, image, phone screen, or caption block clears the frame.
- Caption strike: cross out weak wording and reveal stronger wording.
- Timeline jump: chapter markers move the viewer forward.

Avoid generic transitions when no narrative reason exists.

## Asset Planning Link

After the storyboard table is drafted, read `asset-research.md` and convert every `Asset need` into an asset manifest row.

## Quality Checklist

- Every scene has one clear job.
- No scene depends only on vague mood.
- Voiceover, text, visual, and motion point to the same idea.
- The layout state is concrete enough for HyperFrames implementation.
- The transition explains why the next scene follows.
