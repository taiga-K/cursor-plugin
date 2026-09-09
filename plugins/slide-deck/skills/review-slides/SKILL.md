---
name: review-slides
description: >-
  Review a PPTX deck with mechanical rule checks and a fresh-eye content review
  by a separate agent. Use when the user asks to review slides, critique a
  presentation, run check_deck, fresh-eye review, or polish a consulting deck
  before delivery.
---

# Review slides (PPTX)

Input: path to a `.pptx` (and the SlideSpec JSON used to build it, if available).

## Procedure

1. **Mechanical check** from the plugin root:

```bash
python3 scripts/check_deck.py path/to/deck.pptx
```

Fix every FAIL before content review. Treat WARN as triage (fix unless intentional).

2. **Fresh-eye review**: spawn a **separate** agent (Task tool or new chat) that has **no** knowledge of how the deck was built. Do not share skills, rules, or design intent.

   - Copy the instruction block from [`references/content-review-prompt.md`](../../references/content-review-prompt.md).
   - Replace `{FILE}` with the PPTX path and `{N}` with the slide count.
   - Tell the reviewer only to Read that file and follow the prompt.

3. **Decision table**: classify each finding as 日本語 / 論理 / 破綻 / 体裁 and mark 採用 / 不採用 / 保留 with a one-line reason. Ask the user when a change would alter meaning or structure.

4. **Apply accepted fixes** to the SlideSpec (preferred) or call out exact PPTX edits if no spec exists. Re-export and re-run `check_deck.py` until FAIL 0.

5. **AI-slop scan**: walk titles and body against [`references/ai-smell-lexicon.md`](../../references/ai-smell-lexicon.md). Prefer concrete verbs over business nouns; delete empty intensifiers and dash-linked clauses.

## Output format

Return:

1. `check_deck` summary (FAIL / WARN counts + title list verdict)
2. Decision table (all fresh-eye findings)
3. Spec diffs or concrete edit list for accepted items
4. Remaining risks for human visual QA

## Additional resources

- Review prompt: [`references/content-review-prompt.md`](../../references/content-review-prompt.md)
- Rules: [`references/slide-rules.md`](../../references/slide-rules.md)
- Lexicon: [`references/ai-smell-lexicon.md`](../../references/ai-smell-lexicon.md)
