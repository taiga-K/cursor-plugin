# slide-deck

Cursor plugin for building consulting-quality **PPTX** decks from a SlideSpec JSON, a design rulebook, and mechanical checks.

Method adapted from [consulting-pptx-skill](https://github.com/carnot-tech/consulting-pptx-skill) (MIT). This plugin is **PPTX-only** — no HTML parts library or Chrome PDF path.

## Included

| Path | Role |
| --- | --- |
| `skills/create-slides/` | Create a deck (rules → storyline → SlideSpec → export → check) |
| `skills/review-slides/` | Fresh-eye review after mechanical checks pass |
| `references/slide-rules.md` | Design rulebook (read before building) |
| `references/archetype-catalog.md` | 62 slide templates and when to use them |
| `references/content-review-prompt.md` | Prompt for a separate review agent |
| `references/ai-smell-lexicon.md` | Phrases that read as AI slop |
| `slide-spec/` | JSON schema, example deck, 62-type super template |
| `scripts/` | `validate_spec.mjs`, `export_spec_to_editable_pptx.mjs`, `check_deck.py`, archetype plugins |

## Setup

```bash
cd plugins/slide-deck
npm install
pip3 install python-pptx   # for check_deck.py
```

## Quick commands

```bash
# Validate a SlideSpec
node scripts/validate_spec.mjs slide-spec/example_deck.json

# Export editable PPTX
node scripts/export_spec_to_editable_pptx.mjs slide-spec/example_deck.json generated/example.pptx

# Mechanical rule check (FAIL 0 required)
python3 scripts/check_deck.py generated/example.pptx
```

## Workflow

1. Agree purpose, deliverable, and scope in 3–5 lines.
2. Read `references/slide-rules.md` in full.
3. Write a storyline (one title line per slide + layout hint).
4. Pick templates from `references/archetype-catalog.md` and write a SlideSpec JSON.
5. Validate → export → `check_deck.py` until FAIL 0.
6. Run `review-slides` with a separate agent that does not know how the deck was built.
7. Open the PPTX and visually inspect every page.

## Attribution

See [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) for the upstream MIT notice.
Optional deck-level attribution: set `"attribution": "your text"` on the SlideSpec root. Omit or set `false` to skip.
