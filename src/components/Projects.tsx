import type { LocaleContent, Project } from "../content/types";
import { asset } from "../assets";

type Props = {
  projects: Project[];
  ui: LocaleContent["ui"];
};

export function Projects({ projects, ui }: Props) {
  return (
    <section className="section section--projects" aria-labelledby="projects-heading">
      <p className="label" id="projects-heading">
        {ui.projects}
      </p>
      <ol className="project-list">
        {projects.map((project, index) => {
          const isExternal = project.href?.startsWith("http") ?? false;

          return (
            <li className="project-card" key={project.id}>
              <div className="project-thumb">
                {project.image ? (
                  <img
                    alt=""
                    decoding="async"
                    height={600}
                    loading="lazy"
                    src={asset(project.image)}
                    width={800}
                  />
                ) : null}
              </div>
              <div className="project-body">
                <p className="label">
                  {String(index + 1).padStart(2, "0")} · {project.year}
                  {project.status === "current" ? ` · ${ui.currentProject}` : null}
                </p>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                {project.href ? (
                  <a
                    className="pill"
                    href={project.href}
                    rel={isExternal ? "noreferrer" : undefined}
                    target={isExternal ? "_blank" : undefined}
                  >
                    {ui.visit} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="pill pill--muted">{ui.comingSoon}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
