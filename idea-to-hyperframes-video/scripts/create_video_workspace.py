#!/usr/bin/env python3
"""Create a production workspace for an idea-to-HyperFrames video."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
import csv


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "video-project"


def write_if_missing(path: Path, content: str) -> None:
    if not path.exists():
        path.write_text(content, encoding="utf-8")


def write_csv_if_missing(path: Path, rows: list[list[str]]) -> None:
    if path.exists():
        return
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a video production workspace.")
    parser.add_argument("slug", help="Project slug or title")
    parser.add_argument("--output", "-o", default=".", help="Parent output directory")
    args = parser.parse_args()

    slug = slugify(args.slug)
    root = Path(args.output).expanduser().resolve() / slug

    for directory in [
        "00-input",
        "01-brief",
        "02-script",
        "03-assets/downloads",
        "04-hyperframes",
        "05-render",
    ]:
        (root / directory).mkdir(parents=True, exist_ok=True)

    write_if_missing(
        root / "00-input" / "raw-idea.md",
        "# Raw Idea\n\nPaste the original idea, notes, links, or user brief here.\n",
    )
    write_if_missing(
        root / "00-input" / "transcript.md",
        "# Transcript\n\nAdd voice-note transcription here when available.\n",
    )
    write_if_missing(
        root / "01-brief" / "video-brief.md",
        "# Video Brief\n\n- Audience:\n- Platform:\n- Duration:\n- Intent:\n- Tone:\n- Core promise:\n- Constraints:\n",
    )
    write_csv_if_missing(
        root / "02-script" / "chapter-script.csv",
        [[
            "Chapter",
            "Estimated time",
            "Purpose",
            "Voiceover",
            "Subtitle",
            "Visual beat",
            "Asset need",
            "Transition",
        ]],
    )
    write_if_missing(
        root / "02-script" / "spoken-script.md",
        "# Spoken Script\n\n## Core Promise\n\n\n## Hook Options\n\n1. \n2. \n3. \n\n## Final Script\n\n### 01 Hook\n\n\n### 02 Problem\n\n\n### 03 Core Idea\n\n\n### 04 Proof or Example\n\n\n### 05 Takeaway\n\n",
    )
    write_if_missing(
        root / "02-script" / "subtitle-lines.md",
        "# Subtitle Lines\n\n| Time | Voiceover | Subtitle |\n|---:|---|---|\n",
    )
    write_if_missing(
        root / "02-script" / "script-review.md",
        "# Script Review\n\n- Hook strength:\n- Spoken naturalness:\n- Visual executability:\n- Pacing:\n- Claims needing verification:\n- Lines to cut:\n- Lines to keep:\n",
    )
    manifest = {
        "project": slug,
        "assets": [],
    }
    write_if_missing(
        root / "03-assets" / "asset-manifest.json",
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
    )
    write_if_missing(
        root / "03-assets" / "source-notes.md",
        "# Source Notes\n\n| Asset ID | Source URL | Creator/Site | License note | Retrieval date | Fit | Restrictions |\n|---|---|---|---|---|---|---|\n",
    )
    write_if_missing(
        root / "03-assets" / "generation-prompts.md",
        "# Generation Prompts\n\n| Asset ID | Prompt | Negative constraints | Notes |\n|---|---|---|---|\n",
    )
    write_if_missing(
        root / "04-hyperframes" / "DESIGN.md",
        "# DESIGN\n\n## Style Prompt\n\n\n## Colors\n\n- Background:\n- Primary text:\n- Accent:\n- Support:\n\n## Typography\n\n- Display:\n- Body:\n\n## Motion\n\n- Entrance:\n- Emphasis:\n- Transitions:\n- Avoid:\n\n## What NOT to Do\n\n- \n",
    )
    write_csv_if_missing(
        root / "04-hyperframes" / "storyboard.csv",
        [[
            "Scene",
            "Start",
            "Duration",
            "Chapter",
            "Layout state",
            "Assets",
            "Text",
            "Motion",
            "Audio",
        ]],
    )
    write_csv_if_missing(
        root / "04-hyperframes" / "timed-storyboard.csv",
        [[
            "Scene",
            "Start",
            "End",
            "Duration",
            "Recording line",
            "Subtitle",
            "Visual job",
            "Layout state",
            "Asset IDs",
            "Motion",
            "Transition",
            "Notes",
        ]],
    )
    write_if_missing(
        root / "04-hyperframes" / "production-brief.md",
        "# HyperFrames Production Brief\n\n- Target resolution:\n- Total duration:\n- Composition list:\n- Caption strategy:\n- Audio/voiceover:\n- Transition strategy:\n- Risks:\n",
    )

    print(root)


if __name__ == "__main__":
    main()
