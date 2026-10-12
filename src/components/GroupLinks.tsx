import type { LocaleContent } from "../content/types";

type Props = {
  group: LocaleContent["group"];
  links: LocaleContent["links"];
  ui: LocaleContent["ui"];
};

export function GroupLinks({ group, links, ui }: Props) {
  return (
    <section className="section section--group" aria-labelledby="group-heading">
      <p className="label" id="group-heading">
        {ui.aboutGroup}
      </p>
      <h2 className="section-title">{group.name}</h2>
      <p className="section-lede">{group.about}</p>
      <nav className="pill-list" aria-label={ui.links}>
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");

          return (
            <a
              className="pill"
              href={link.href}
              key={link.id}
              rel={isExternal ? "noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          );
        })}
      </nav>
    </section>
  );
}
