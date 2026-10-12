import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Google Fonts splits Noto Serif TC into ~100 KB unicode-range chunks, so a page with a
 * few dozen Chinese characters pulls over a megabyte. Instead, collect every non-ASCII
 * character used in src/content/*.json and request only those glyphs via `text=`.
 * The placeholders %FONTS_LATIN_HREF% and %FONTS_CJK_HREF% in index.html are replaced in dev and build.
 */
function fontSubsetPlugin(): Plugin {
  const contentDir = fileURLToPath(new URL("./src/content", import.meta.url));

  const LATIN_HREF =
    "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap";

  // `text=` subsets every family in a request, so the CJK face gets a request of its own.
  const cjkHref = () => {
    const chars = new Set<string>();
    for (const file of readdirSync(contentDir)) {
      if (!file.endsWith(".json")) continue;
      for (const ch of readFileSync(join(contentDir, file), "utf8")) {
        if (ch.codePointAt(0)! > 0x7f && !/\s/.test(ch)) chars.add(ch);
      }
    }
    const text = encodeURIComponent([...chars].sort().join(""));
    return `https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600&text=${text}&display=swap`;
  };

  return {
    name: "font-subset",
    transformIndexHtml(html) {
      return html
        .split("%FONTS_LATIN_HREF%")
        .join(LATIN_HREF)
        .split("%FONTS_CJK_HREF%")
        .join(cjkHref());
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), fontSubsetPlugin()],
});
