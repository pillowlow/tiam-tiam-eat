import type { LocaleContent } from "../content/types";

type Props = {
  group: LocaleContent["group"];
};

export function Footer({ group }: Props) {
  return (
    <footer className="site-footer">
      <span>{group.handle}</span>
      <span className="footer-line" aria-hidden="true" />
      <span>{group.established}</span>
      <span className="footer-line" aria-hidden="true" />
      <span>© {new Date().getFullYear()} {group.name}</span>
    </footer>
  );
}
