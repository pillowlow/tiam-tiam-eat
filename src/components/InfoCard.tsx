import type { LocaleContent, Project } from "../content/types";
import { asset } from "../assets";

type Props = {
  project: Project;
  ui: LocaleContent["ui"];
};

export function InfoCard({ project, ui }: Props) {
  return (
    <section className="card card--info" id={project.id} aria-labelledby="project-title">
      <p className="label">
        {ui.currentProject} · {project.year}
      </p>
      <h2 className="info-wordmark" id="project-title">
        <img
          alt={project.title}
          decoding="async"
          height={1182}
          sizes="(min-width: 560px) 300px, 60vw"
          src={asset("wordmark-800.webp")}
          srcSet={`${asset("wordmark-800.webp")} 800w, ${asset("wordmark-1200.webp")} 1200w`}
          width={1200}
        />
      </h2>
      <p className="info-subtitle">{project.subtitle}</p>
      <p className="info-summary">{project.summary}</p>

      <div className="info-block">
        <h3 className="label">{ui.venues}</h3>
        <p className="info-date">{project.date}</p>
        <ul className="venue-list">
          {project.venues.map((venue) => (
            <li className="venue" key={venue.city}>
              <span className="venue-city">
                {venue.city} <span className="venue-name">{venue.name}</span>
              </span>
              <span className="venue-address">{venue.address}</span>
              {venue.hours.map((line) => (
                <span className="venue-hours" key={line}>
                  {line}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div className="info-block">
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
    </section>
  );
}
