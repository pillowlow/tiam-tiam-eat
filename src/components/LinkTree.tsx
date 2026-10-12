import type { Locale, LocaleContent, Project } from "../content/types";
import { LanguageSwitch } from "./LanguageSwitch";

type Props = {
  content: LocaleContent;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

type Row = {
  id: string;
  label: string;
  sub?: string;
  href: string;
  external: boolean;
};

function projectRow(project: Project, ui: LocaleContent["ui"]): Row {
  if (project.href) {
    return {
      id: project.id,
      label: project.title,
      sub: project.status === "demo" ? `${ui.demo} · ${ui.openArtwork}` : project.subtitle,
      href: project.href,
      external: project.href.startsWith("http"),
    };
  }

  // No site yet: the row scrolls to the info card below.
  return {
    id: project.id,
    label: project.title,
    sub: project.status === "current" ? `${ui.currentProject} · ${project.date}` : ui.comingSoon,
    href: `#${project.id}`,
    external: false,
  };
}

export function LinkTree({ content, locale, onLocaleChange }: Props) {
  const { group, ui, projects, links } = content;
  const rows: Row[] = [
    ...projects.map((project) => projectRow(project, ui)),
    ...links.map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      external: link.href.startsWith("http"),
    })),
  ];

  return (
    <section className="card card--tree" aria-labelledby="group-name">
      <header className="card-header">
        <p className="label">{ui.group}</p>
        <LanguageSwitch label={ui.language} locale={locale} onLocaleChange={onLocaleChange} />
      </header>

      <div className="identity">
        <h1 id="group-name">{group.name}</h1>
        <p className="tagline">{group.tagline}</p>
      </div>

      <nav className="tree" aria-label={ui.links}>
        {rows.map((row, index) => (
          <a
            className="tree-row"
            href={row.href}
            key={row.id}
            rel={row.external ? "noreferrer" : undefined}
            target={row.external ? "_blank" : undefined}
          >
            <span className="tree-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="tree-text">
              <span className="tree-label">{row.label}</span>
              {row.sub ? <span className="tree-sub">{row.sub}</span> : null}
            </span>
            <span className="tree-arrow" aria-hidden="true">
              {row.external ? "↗" : "↓"}
            </span>
          </a>
        ))}
      </nav>

      <footer className="card-footer">
        <span>{group.handle}</span>
        <span className="footer-line" aria-hidden="true" />
        <span>{group.established}</span>
      </footer>
    </section>
  );
}
