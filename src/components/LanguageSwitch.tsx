import type { Locale } from "../content/types";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  "zh-Hant": "繁",
  nl: "NL",
};

type Props = {
  label: string;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function LanguageSwitch({ label, locale, onLocaleChange }: Props) {
  return (
    <div className="language-switch" role="group" aria-label={label}>
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
  );
}
