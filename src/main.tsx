import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App, { getInitialLocale } from "./App";
import "./style.css";

const container = document.getElementById("root")!;
const locale = getInitialLocale();
const app = (
  <StrictMode>
    <App initialLocale={locale} />
  </StrictMode>
);

// dist/index.html is prerendered in English. Hydrate it when that is the visitor's
// locale; otherwise render fresh so the markup never mismatches.
if (container.hasChildNodes() && locale === "en") {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
