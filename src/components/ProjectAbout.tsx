import type { LocaleContent, Project } from "../content/types";

type Props = {
  project: Project;
  ui: LocaleContent["ui"];
};

export function ProjectAbout({ project, ui }: Props) {
  return (
    <section className="section section--about" aria-labelledby="about-project">
      <p className="label" id="about-project">
        {ui.aboutProject}
      </p>
      <div className="about-grid">
        <div className="about-copy">
          <h2 className="section-title">{project.title}</h2>
          <p className="section-lede">{project.summary}</p>
          <ul className="tag-list" aria-label="Tags">
            {project.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="about-details">
          <h3 className="label">{ui.venues}</h3>
          <p className="about-date">{project.date}</p>
          <div className="venue-list">
            {project.venues.map((venue) => (
              <article className="venue" key={venue.city}>
                <h4 className="venue-city">
                  {venue.city} <span className="venue-name">{venue.name}</span>
                </h4>
                <p className="venue-address">{venue.address}</p>
                <ul className="venue-hours">
                  {venue.hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <h3 className="label">{ui.credits}</h3>
          <dl className="credits">
            {project.credits.map((credit) => (
              <div className="credit" key={credit.role}>
                <dt>{credit.role}</dt>
                <dd>{credit.names}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
