// Bakes the server-rendered English page into dist/index.html so the first paint
// does not wait for the React bundle. Run after `vite build` and the SSR build:
//   vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const indexPath = `${root}dist/index.html`;
const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);

const html = readFileSync(indexPath, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}
writeFileSync(indexPath, html.replace(marker, `<div id="root">${render()}</div>`));
rmSync(`${root}dist-ssr`, { recursive: true, force: true });
console.log("prerender: dist/index.html now contains the rendered page");
