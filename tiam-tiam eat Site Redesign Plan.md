# tiam-tiam eat Site Redesign Plan

Oct 13, 2026 · @pillow

## Goal

tiam-tiam-eat.com stays the group's home, and 釘點芳 *Ripe for the pickin'* becomes its featured current project. The site moves from a dark link card to a warm, light page built on the new gradient, brush wordmark and fruit illustration.

- The group identity (tiam-tiam eat) frames the page; the project gets the hero.
- Future projects slot in as new entries in a Projects list, so 釘點芳 can later move from featured to archived without a redesign.
- Stack, bilingual EN / 繁 switching and the GitHub Pages deploy stay as they are.

## Current state

The repo [pillowlow/tiam-tiam-eat](https://github.com/pillowlow/tiam-tiam-eat) is a one-card link tree on Vite 7, React 19 and TypeScript, last changed Sept 26, 2026.

| Part | Today | Keep or change |
| --- | --- | --- |
| `src/App.tsx` | One component: header, TTE mark, name, tagline, 2 links, footer | Split into sections |
| `src/style.css` | 294 lines, dark `#171b19` with orange and green orbs, Roboto Slab | Rewrite |
| `src/content/*.json` | `name`, `tagline`, `links[]` (Instagram, Demo work as `#`) | Extend |
| `index.html` | Title and description only | Add OG, favicon, theme color |
| `public/assets/` | Empty | Add prepared assets |
| Deploy | Pages Action on push to `main`, CNAME tiam-tiam-eat.com | Keep |

## Visual direction

Warm paper, not dark tech: the gradient is the page, the brush wordmark and fruit carry the identity, and the UI stays quiet.

**Palette**, sampled from the gradient file top to bottom:

| Token | Hex | Use |
| --- | --- | --- |
| `--persimmon` | `#D47449` | Accent, links, active language button |
| `--apricot` | `#E18D5A` | Hover, highlights |
| `--wheat` | `#CDAA7C` | Secondary text on light areas, tags |
| `--sage` | `#C2B88F` | Dividers, card borders |
| `--cream` | `#DBD7C5` | Card and section surfaces |
| `--ink` | `#2B2522` | Body text, matches the brush ink |

**Type**

- Display: the brush wordmark image only. No web font imitates it.
- Body: Noto Serif TC for Chinese, EB Garamond or Cormorant Garamond for Latin. Drop Roboto Slab.
- Small labels (index numbers, dates): the same serif in small caps, letter-spaced.

**Texture and motion**

- Keep the existing SVG noise overlay at about 0.05 opacity so the CSS gradient reads as paper.
- One slow motion only: the juice droplets drift a few pixels on scroll. Respect `prefers-reduced-motion`.
- Two themes. Light is the default and sets `color-scheme: light`. A Black switch in the card footer sets `data-theme="black"` on `<html>`, which swaps in a warm dark gradient, dark cards and about 0.035 grain. The choice is saved as `tiam-tiam-eat-theme` in localStorage.

## Page structure

One scrolling page, six blocks, no router.

1. **Top bar**: small "tiam-tiam eat" text mark on the left, EN / 繁 switch on the right. Transparent over the gradient.
2. **Featured project hero** (full viewport height): 釘點芳 wordmark on the left, fruit illustration on the right, a small "Current project" label above the wordmark. On phones: label, wordmark, then fruit, stacked.
3. **About the project**: two or three bilingual sentences on 釘點芳, plus date and place if it is an exhibition or event.
4. **Projects**: a list of cards, 釘點芳 first and marked current. Each card: thumbnail, title, year, one line, link. Cards with no link yet show "coming soon" instead of a dead `#`.
5. **About the group + links**: one line on tiam-tiam eat, then pill buttons (Instagram, email, future links) in cream with ink text.
6. **Footer**: @tiam\_tiam\_eat, Est. 2025, copyright year.

## Asset preparation

All three files are 1932 × 2576 or 1080 × 1080 masters; each needs a web export before it goes in `public/assets/`.

| File | Finding | Action | Output |
| --- | --- | --- | --- |
| 漸層底圖.jpg (308 KB) | Plain vertical gradient, #D47449 to #DBD7C5 | Rebuild as a CSS `linear-gradient`; keep the JPG only as a fallback | CSS, plus `bg-gradient.webp` at 1200 px |
| 釘點芳\_標準字.png (398 KB) | Already transparent, black ink | Trim the empty margins; trace to SVG so the ink can take `--ink` | `wordmark.svg`, `wordmark@2x.png` |
| 新版主視覺.jpg (551 KB) | Fruit on an orange disc with a white top left corner | Make the white corner transparent so the disc edge sits on the page gradient | `keyvisual-1200.webp`, `keyvisual-2400.webp` with `srcset` |
| Favicon | None today | Crop the 釘 character from the wordmark | `favicon.svg`, 180 px Apple icon |
| Share image | None today | Wordmark plus fruit on the gradient | `og.jpg` at 1200 × 630 |

Target: the first screen loads under 400 KB total on mobile.

## Content model and code

All copy stays in `en.json` and `zh-Hant.json`; project data is shared and only its text is translated.

```json
{
  "group": { "name": "tiam-tiam eat", "about": "..." },
  "featured": "ripe-for-the-pickin",
  "projects": [
    {
      "id": "ripe-for-the-pickin",
      "title": "釘點芳 Ripe for the pickin'",
      "year": "2026",
      "summary": "...",
      "status": "current",
      "href": null
    }
  ],
  "links": [ { "id": "instagram", "label": "Instagram", "href": "..." } ]
}
```

**Files**

| File | Change |
| --- | --- |
| `src/App.tsx` | Becomes a shell: locale state (unchanged logic) plus the section components |
| `src/components/` | New: `TopBar`, `Hero`, `ProjectAbout`, `Projects`, `GroupLinks`, `Footer` |
| `src/content/*.json` | New schema above; `href: null` replaces the `#` placeholder |
| `src/style.css` | Rewritten around the palette tokens; mobile first, breakpoint at 768 px |
| `index.html` | `lang`, OG and Twitter tags, `theme-color` #D47449, favicon, font preconnect |
| `public/assets/` | Prepared assets from the table above |
| `.github/workflows/pages.yml`, `public/CNAME` | No change |

## Build phases

Work happens on a `redesign` branch; `main` deploys only after review, so the live site never shows a half state.

**1. Hero mock-up**

- [ ] Static hero with real assets on the gradient, desktop and phone
- [ ] Pillow approves layout, type and wordmark size

**2. Assets**

- [ ] Export wordmark SVG and trimmed PNG
- [ ] Key visual with transparent corner, WebP in two sizes
- [ ] Favicon and OG image

**3. Build**

- [ ] New content schema in both locales
- [ ] Section components and new `style.css`
- [ ] `index.html` meta and favicon

**4. Check and ship**

- [ ] Test at 375, 768 and 1440 px; both languages
- [ ] Lighthouse: performance and accessibility at 90 or above
- [ ] Contrast check for ink on cream and white on persimmon
- [ ] Merge to `main`, confirm tiam-tiam-eat.com updates

## Open questions

- Final copy for 釘點芳 in both languages: what it is, and date and place if it is a show.
- Are there other past projects to list now, or does 釘點芳 stand alone at launch?
- Should the Chinese tagline and group intro be rewritten, or kept from the current site?
- Any links beyond Instagram (email, shop, press)?
