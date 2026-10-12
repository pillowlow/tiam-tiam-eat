import { useEffect, useState } from "react";
import en from "./content/en.json";
import zhHant from "./content/zh-Hant.json";
import type { Locale, LocaleContent } from "./content/types";
import { Footer } from "./components/Footer";
import { GroupLinks } from "./components/GroupLinks";
import { Hero } from "./components/Hero";
import { ProjectAbout } from "./components/ProjectAbout";
import { Projects } from "./components/Projects";
import { TopBar } from "./components/TopBar";

const content: Record<Locale, LocaleContent> = {
  en: en as LocaleContent,
  "zh-Hant": zhHant as LocaleContent,
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
  const featured =
    currentContent.projects.find((project) => project.id === currentContent.featured) ??
    currentContent.projects[0];

  useEffect(() => {
    document.documentElement.lang = locale === "zh-Hant" ? "zh-Hant" : "en";

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // The language switch still works when local storage is unavailable.
    }
  }, [locale]);

  return (
    <div className="site">
      <TopBar content={currentContent} locale={locale} onLocaleChange={setLocale} />
      <main>
        <Hero project={featured} ui={currentContent.ui} />
        <ProjectAbout project={featured} ui={currentContent.ui} />
        <Projects projects={currentContent.projects} ui={currentContent.ui} />
        <GroupLinks group={currentContent.group} links={currentContent.links} ui={currentContent.ui} />
      </main>
      <Footer group={currentContent.group} />
    </div>
  );
}

export default App;
