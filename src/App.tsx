import { useEffect, useState } from "react";
import en from "./content/en.json";
import nl from "./content/nl.json";
import zhHant from "./content/zh-Hant.json";
import type { Locale, LocaleContent } from "./content/types";
import { InfoCard } from "./components/InfoCard";
import { LinkTree } from "./components/LinkTree";
import type { Theme } from "./components/ThemeSwitch";
import { asset } from "./assets";

const content: Record<Locale, LocaleContent> = {
  en: en as LocaleContent,
  "zh-Hant": zhHant as LocaleContent,
  nl: nl as LocaleContent,
};

const locales = Object.keys(content) as Locale[];
const localeStorageKey = "tiam-tiam-eat-locale-choice";
const themeStorageKey = "tiam-tiam-eat-theme";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as string[]).includes(value);
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const savedLocale = window.localStorage.getItem(localeStorageKey);
    if (isLocale(savedLocale)) return savedLocale;
  } catch {
    // Local storage may be unavailable; English is the default.
  }

  return "en";
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "black";
}

// Only called from an effect, so it never runs during prerender.
function readSavedTheme(): Theme {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    if (isTheme(savedTheme)) return savedTheme;
  } catch {
    // Local storage may be unavailable; light is the default.
  }

  return "light";
}

// Keeps <html data-theme> and the two meta tags in step with the theme.
// The inline script in index.html does the same before first paint.
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", theme === "black" ? "dark" : "light");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "black" ? "#120d0b" : "#D47449");
}

type Props = {
  initialLocale: Locale;
};

function App({ initialLocale }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  // Starts on light so the first render matches the prerendered HTML.
  const [theme, setTheme] = useState<Theme>("light");
  const currentContent = content[locale];
  const featured =
    currentContent.projects.find((project) => project.id === currentContent.featured) ??
    currentContent.projects[0];

  const changeLocale = (next: Locale) => {
    setLocale(next);

    try {
      window.localStorage.setItem(localeStorageKey, next);
    } catch {
      // The language switch still works when local storage is unavailable.
    }
  };

  const changeTheme = (next: Theme) => {
    setTheme(next);
    applyTheme(next);

    try {
      window.localStorage.setItem(themeStorageKey, next);
    } catch {
      // The theme still switches when local storage is unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Apply the saved choice after mount. The head script has already set it before first paint.
  useEffect(() => {
    const savedTheme = readSavedTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // The fruit drifts up a little slower than the page as you scroll (see .decor in style.css).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      document.documentElement.style.setProperty("--scroll", `${window.scrollY}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="site">
      <div className="decor" aria-hidden="true">
        <img
          alt=""
          decoding="sync"
          fetchPriority="high"
          height={3440}
          sizes="(min-width: 768px) 860px, 100vw"
          src={asset("keyvisual-800.webp")}
          srcSet={`${asset("keyvisual-800.webp")} 800w, ${asset("keyvisual-1200.webp")} 1200w, ${asset("keyvisual-2400.webp")} 2400w`}
          width={2580}
        />
      </div>
      <main className="stack">
        <LinkTree
          content={currentContent}
          locale={locale}
          onLocaleChange={changeLocale}
          theme={theme}
          onThemeChange={changeTheme}
        />
        <InfoCard project={featured} ui={currentContent.ui} />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} {currentContent.group.name}
      </footer>
    </div>
  );
}

export default App;
