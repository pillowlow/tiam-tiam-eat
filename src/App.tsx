import { useEffect, useState } from "react";
import en from "./content/en.json";
import nl from "./content/nl.json";
import zhHant from "./content/zh-Hant.json";
import type { Locale, LocaleContent } from "./content/types";
import { InfoCard } from "./components/InfoCard";
import { LinkTree } from "./components/LinkTree";
import { asset } from "./assets";

const content: Record<Locale, LocaleContent> = {
  en: en as LocaleContent,
  "zh-Hant": zhHant as LocaleContent,
  nl: nl as LocaleContent,
};

const locales = Object.keys(content) as Locale[];
const localeStorageKey = "tiam-tiam-eat-locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as string[]).includes(value);
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const savedLocale = window.localStorage.getItem(localeStorageKey);
    if (isLocale(savedLocale)) return savedLocale;
  } catch {
    // Local storage may be unavailable; browser language is a safe fallback.
  }

  const language = navigator.language.toLowerCase();
  if (language.startsWith("zh")) return "zh-Hant";
  if (language.startsWith("nl")) return "nl";
  return "en";
}

type Props = {
  initialLocale: Locale;
};

function App({ initialLocale }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const currentContent = content[locale];
  const featured =
    currentContent.projects.find((project) => project.id === currentContent.featured) ??
    currentContent.projects[0];

  useEffect(() => {
    document.documentElement.lang = locale;

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // The language switch still works when local storage is unavailable.
    }
  }, [locale]);

  return (
    <div className="site">
      <div className="decor" aria-hidden="true">
        <img
          alt=""
          decoding="sync"
          fetchPriority="high"
          height={3000}
          sizes="(min-width: 768px) 860px, 100vw"
          src={asset("keyvisual-800.webp")}
          srcSet={`${asset("keyvisual-800.webp")} 800w, ${asset("keyvisual-1200.webp")} 1200w, ${asset("keyvisual-2400.webp")} 2400w`}
          width={2400}
        />
      </div>
      <main className="stack">
        <LinkTree content={currentContent} locale={locale} onLocaleChange={setLocale} />
        <InfoCard project={featured} ui={currentContent.ui} />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} {currentContent.group.name}
      </footer>
    </div>
  );
}

export default App;
