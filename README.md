# GlimpseContent

A quiet, frameless article outline. Small lines stay in the bottom-left corner; hover or focus one to reveal its heading.

Vanilla JavaScript + CSS. No dependencies, build step, or framework.

## Install

Copy `glimpse-content.js` and `glimpse-content.css` to your site, then add:

```html
<link rel="stylesheet" href="/glimpse-content.css">
<script defer src="/glimpse-content.js"></script>
```

The first element matching `article, #body, main` is used as the article container. Markdown works once rendered to HTML; homepages work the same way.

## Behavior

- Appears after the page finishes loading, with a 240ms fade at its original position.
- Shows only above 800px, when the article has at least four headings in total.
- Counts `h1`–`h6`, including the article title; lists only `h2` and `h3`.
- Uses shorter lines for `h2` and longer lines for `h3`.
- Reveals only the hovered or keyboard-focused title; the line brightens and grows.
- Highlights the current section while scrolling. Clicking scrolls smoothly.
- Keeps the URL unchanged. Preserves existing heading IDs and creates missing ones.
- Uses solid title backgrounds, rounded corners, system dark mode, and reduced-motion preferences.

The outline is appended to the document. Article content is not wrapped or rearranged.

## Options

Set attributes on the script tag:

```html
<script defer src="/glimpse-content.js"
  data-content="#body"
  data-header="nav"
  data-min-width="800"
  data-min-headings="4"
  data-offset="24"
  data-label="Contents"></script>
```

| Attribute | Default | Purpose |
| --- | --- | --- |
| `data-content` | `article, #body, main` | Article container selector; first match wins. |
| `data-header` | None | Fixed header selector; its height is added to the scroll offset. |
| `data-min-width` | `800` | Minimum viewport width in pixels, exclusive. |
| `data-min-headings` | `4` | Minimum total heading count, inclusive. |
| `data-offset` | `24` | Space below the header in pixels. |
| `data-label` | `Contents` | Accessible navigation label. |

For the original Hugo layout, use `data-content="#body"` and `data-header="nav"`.

## Styling

Load your overrides after the plugin CSS. Set these colors to match your site's theme:

```css
.glimpse-content {
  --glimpse-active: #191813;
  --glimpse-background: #fcfbf8;
  --glimpse-muted: #888;
}

@media (prefers-color-scheme: dark) {
  .glimpse-content {
    --glimpse-active: #fff;
    --glimpse-background: #000;
  }
}
```

Override `left` and `bottom` to move the outline. Title backgrounds use absolute positioning, so their padding does not increase the 22px row spacing.

## Scope

Use a classic script tag in a modern browser. Designed for one static article per page; it reads headings once after `window.load`. Client-side navigation or later content updates require a full page reload. Load each file once, and remove any earlier copy of the outline code before installing.
