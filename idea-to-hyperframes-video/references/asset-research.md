# Asset Research

Use this reference when planning, finding, generating, or documenting materials for each video chapter.

## Asset Planning Before Search

For each chapter, define:

- Visual job: prove, clarify, dramatize, compare, locate, humanize, establish mood, or show texture.
- Required subject: product, person, place, interface, object, document, scene, data, abstract graphic.
- Specific search terms: include nouns, era, location, style, angle, and distinguishing features.
- Format: photo, screenshot, product cutout, generated image, chart, texture, icon, map, archival image, B-roll.
- Orientation: 16:9, 9:16, 1:1, transparent cutout, wide crop, close detail.
- Usage note: public domain, user-owned, licensed stock, editorial reference only, AI-generated, needs permission.

## Search Strategy

Search in layers:

1. Exact subject: brand/product/place/person/title + image terms.
2. Contextual subject: environment, use case, adjacent objects, historical period.
3. Detail subject: close-up, texture, interface state, packaging, document, material.
4. Backup: AI image prompt or simple graphic treatment if source imagery is unavailable.

For current, commercial, legal, medical, financial, or named-entity content, verify from primary or reputable sources. Keep URLs in `source-notes.md`.

## Asset Manifest Fields

Use this JSON shape:

```json
{
  "project": "video-slug",
  "assets": [
    {
      "id": "ch01-hero-01",
      "chapter": "01-hook",
      "type": "image",
      "status": "needed",
      "visual_job": "show the real product detail that creates curiosity",
      "description": "macro photo of brushed metal clasp on black leather bag",
      "source_url": "",
      "license_note": "",
      "local_path": "",
      "crop": "9:16 center crop, keep clasp in upper third",
      "fallback_prompt": "Photoreal macro shot of a brushed metal clasp on black leather, soft studio light, shallow depth of field"
    }
  ]
}
```

Status values: `needed`, `found`, `downloaded`, `generated`, `user-supplied`, `blocked`, `replace`.

## Source Notes

For every found asset, record:

- Asset ID
- Source URL
- Creator or site
- License/permission note
- Retrieval date
- Why it fits the chapter
- Any restrictions or uncertainties

Do not present copyrighted images as safe for commercial reuse unless the license clearly permits it.

## Image Generation Prompts

Use generation when:

- The scene is conceptual or composite.
- The user wants a consistent visual universe.
- No usable licensed source exists.
- A background, texture, cutaway, or illustrative scene is needed.

Prompt structure:

`[medium/style], [subject], [setting], [composition], [lighting], [color palette], [mood], [camera/lens if relevant], [negative constraints]`

Keep generated visuals consistent with `DESIGN.md`. Avoid generating logos, real public figures, or trademarked product replicas unless the user owns the rights or requests an editorial-safe treatment.

## Quality Checklist

- Asset matches the chapter's visual job.
- Subject is specific, legible, and not merely atmospheric.
- Crop works for the target aspect ratio.
- Color and texture can fit the planned visual identity.
- Source or prompt is documented.
- Backup exists for hard-to-license assets.
