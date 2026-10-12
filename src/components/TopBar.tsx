import type { Locale, LocaleContent } from "../content/types";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  "zh-Hant": "繁",
};

type Props = {
  content: LocaleContent;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function TopBar({ content, locale, onLocaleChange }: Props) {
  return (
    <header className="top-bar">
      <a className="top-mark" href="#top">
        {content.group.name}
      </a>
      <div className="language-switch" role="group" aria-label={content.ui.language}>
        {(Object.keys(localeLabels) as Locale[]).map((option) => (
          <button
            aria-pressed={option === locale}
            className={option === locale ? "language-button is-active" : "language-button"}
            key={option}
            onClick={() => onLocaleChange(option)}
            type="button"
          >
            {localeLabels[option]}
          </button>
        ))}
      </div>
    </header>
  );
}
