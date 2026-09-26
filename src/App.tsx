import { useEffect, useState } from "react";
import en from "./content/en.json";
import zhHant from "./content/zh-Hant.json";

type Locale = "en" | "zh-Hant";

type LinkItem = {
  id: string;
  label: string;
  href: string;
};

type LocaleContent = {
  name: string;
  tagline: string;
  links: LinkItem[];
};

const content: Record<Locale, LocaleContent> = {
  en,
  "zh-Hant": zhHant,
};

const localeLabels: Record<Locale, string> = {
  en: "EN",
  "zh-Hant": "繁",
};

const localeStorageKey = "tiam-tiam-eat-locale";

function getInitialLocale(): Locale {
  try {
    const savedLocale = window.localStorage.getItem(localeStorageKey);

    if (savedLocale === "en" || savedLocale === "zh-Hant") {
      return savedLocale;
    }
  } catch {
    // Local storage may be unavailable; browser language is a safe fallback.
  }

  return navigator.language.toLowerCase().startsWith("zh") ? "zh-Hant" : "en";
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const currentContent = content[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // The language switch still works when local storage is unavailable.
    }
  }, [locale]);

  return (
    <main className="site-shell">
      <div className="ambient-orb ambient-orb--top" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--bottom" aria-hidden="true" />

      <section className="link-card" aria-labelledby="group-name">
        <header className="card-header">
          <p className="eyebrow">Artist group / 001</p>
          <div className="language-switch" role="group" aria-label="Language">
            {(Object.keys(localeLabels) as Locale[]).map((option) => (
              <button
                className={option === locale ? "language-button is-active" : "language-button"}
                key={option}
                onClick={() => setLocale(option)}
                type="button"
              >
                {localeLabels[option]}
              </button>
            ))}
          </div>
        </header>

        <div className="identity">
          <div className="identity-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="identity-kicker">TTE</p>
          <h1 id="group-name">{currentContent.name}</h1>
          <p className="tagline">{currentContent.tagline}</p>
        </div>

        <nav className="link-list" aria-label="Group links">
          {currentContent.links.map((link, index) => {
            const isPlaceholder = link.href === "#";
            const isExternal = link.href.startsWith("http");

            return (
              <a
                className={isPlaceholder ? "link-button is-placeholder" : "link-button"}
                href={link.href}
                key={link.id}
                onClick={isPlaceholder ? (event) => event.preventDefault() : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                <span className="link-index">0{index + 1}</span>
                <span>{link.label}</span>
                <span className="link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            );
          })}
        </nav>

        <footer className="card-footer">
          <span>@tiam_tiam_eat</span>
          <span className="footer-line" aria-hidden="true" />
          <span>Est. 2025</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
