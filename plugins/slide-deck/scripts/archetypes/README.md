# Archetype plugins (one file = one template)

Each module exports an editable PPTX layout for a SlideSpec `template` id.
`export_spec_to_editable_pptx.mjs` loads this folder at startup and routes
`item.template === id` to `pptx(ctx, item, pageNum)`.

## Required exports

```js
export const id = "axis_table";
export const name = "軸のある表";
export const part = 9;
export const doc = "Describe parts.* fields for authors";
export const example = { template: id, kicker: "...", title: name, source: "出典：Source 1", parts: { ... } };
export function pptx(ctx, item, pageNum) {
  const slide = ctx.addShell(item, pageNum, { titleRule: false, balance: false });
  // draw shapes into slide
}
```

## Rules

- Put slide-specific data under `item.parts`. Shared fields: `title`, `kicker`, `source`, `note`.
- Placeholder style in examples: body `Text 1`, labels `ラベル 1`, headings `タイトル 1`, numbers `00`, years `YYYY年`, source `出典：Source 1`.
- Title field in examples is the template name only (no sample claim — slide-rules §2.8).
- No rounded corners; filled shapes without borders; no bottom rule under the last table row; bullets via formatting, not literal `•` in text; body ≥ 9pt (tables ≥ 10pt).
- Dense layouts: `balance: false`. Footer/source comes from `addFooter` — do not draw it in the plugin.
- Charts: use pptxgenjs `slide.addChart` (native editable), not hand-drawn bars.

## Rebuild super template

```bash
node scripts/build_parts_template.mjs
```
