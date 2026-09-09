---
name: create-slides
description: >-
  Build consulting-quality editable PPTX decks from a SlideSpec JSON using a
  design rulebook, 62 slide templates, PptxGenJS export, and mechanical checks.
  Use when the user asks to create slides, make a presentation, build a PPTX
  deck, draft a consulting-style deck, or follow slide rules / archetype catalog.
---

# Create slides (PPTX)

Produce an **editable `.pptx`**. Do not generate HTML decks or Chrome PDFs.

Plugin root for scripts: the directory that contains `scripts/`, `references/`, and `slide-spec/` (this plugin). Run Node/Python commands from that root after `npm install` once.

## Before writing any slide

1. Agree purpose, deliverable definition, and scope IN/OUT in 3–5 lines.
2. Read [`references/slide-rules.md`](../../references/slide-rules.md) **in full**.
3. Write a **storyline**: one title line per slide, plus a layout hint (chart / table / chevron / two-column / KPI cards). Trends, mix, distribution, and correlation must be charts — not tables of numbers.

## Rule digest (entry only — full file is mandatory)

- Title = conclusion. Noun-style (no です/ます). One line preferred; two lines only at a meaning break. Never shrink type to force one line.
- One message per slide. Left = facts/figure, right = implication when using two columns.
- No rounded corners on large boxes. Filled shapes have no border.
- Tables are axis tables (rows = items, columns = lenses). Header larger/bolder than body; no rule under the last row.
- Counts in the title must match body numbering («3段階» ↔ three steps).
- One term per concept across the deck. Scan [`references/ai-smell-lexicon.md`](../../references/ai-smell-lexicon.md) before handoff.

## Build pipeline

1. Pick a `template` ID per storyline row from [`references/archetype-catalog.md`](../../references/archetype-catalog.md). Templates are a starting kit — drop them when they fight the story.
2. Write a SlideSpec JSON (`deckTitle`, optional `skin`/`palette`/`attribution`, `slides[]`). Mirror field shapes in `slide-spec/example_deck.json` and `slide-spec/schema.json`. Shared fields: `title`, `kicker`, `source`, `note`. Put type-specific data in `table` / `chart` / `kpis` / `parts` / etc.
3. Validate:

```bash
node scripts/validate_spec.mjs path/to/deck.json
```

4. Export:

```bash
mkdir -p generated
node scripts/export_spec_to_editable_pptx.mjs path/to/deck.json generated/deck.pptx
```

5. Mechanical check until **FAIL 0** (WARN may remain if intentional):

```bash
python3 scripts/check_deck.py generated/deck.pptx
```

Read the printed title list top-to-bottom. Fix story gaps before continuing.

6. Hand off to the **`review-slides`** skill (separate agent, no construction context). Apply accepted findings, re-export, re-check.
7. Open the PPTX in PowerPoint or Keynote and visually inspect every page (orphans, overflow, empty lower half, uneven column bottoms, missing legends).

## Commands cheat sheet

| Step | Command |
| --- | --- |
| List schema templates | Inspect `slide-spec/schema.json` `template.enum` or `references/archetype-catalog.md` |
| Validate | `node scripts/validate_spec.mjs <spec.json>` |
| Export | `node scripts/export_spec_to_editable_pptx.mjs <spec.json> <out.pptx>` |
| Check | `python3 scripts/check_deck.py <out.pptx>` |
| Rebuild 62-type catalog JSON | `node scripts/build_parts_template.mjs` |

## Attribution

Do **not** append a default “created with …” footer. Only if the user asks, set root `"attribution": "<text>"` on the SlideSpec.

## Additional resources

- Rules: [`references/slide-rules.md`](../../references/slide-rules.md)
- Templates: [`references/archetype-catalog.md`](../../references/archetype-catalog.md)
- Review prompt: [`references/content-review-prompt.md`](../../references/content-review-prompt.md)
- AI-slop lexicon: [`references/ai-smell-lexicon.md`](../../references/ai-smell-lexicon.md)
- Third-party notice: [`LICENSE-THIRD-PARTY.md`](../../LICENSE-THIRD-PARTY.md)
