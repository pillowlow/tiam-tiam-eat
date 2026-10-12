import { renderToString } from "react-dom/server";
import App from "./App";

/** Used by scripts/prerender.mjs to bake the English page into dist/index.html. */
export function render(): string {
  return renderToString(<App initialLocale="en" />);
}
