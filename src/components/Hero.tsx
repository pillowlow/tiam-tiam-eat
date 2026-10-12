import { useRef } from "react";
import type { LocaleContent, Project } from "../content/types";
import { asset } from "../assets";
import { useDrift } from "../useDrift";

type Props = {
  project: Project;
  ui: LocaleContent["ui"];
};

export function Hero({ project, ui }: Props) {
  const cities = project.venues.map((venue) => venue.city).join(" · ");
  const artRef = useRef<HTMLDivElement>(null);
  useDrift(artRef);

  return (
    <section className="hero" id="top" aria-labelledby="project-title">
      <div className="hero-copy">
        <p className="label">
          {ui.currentProject} · {project.year}
        </p>
        <h1 className="hero-wordmark" id="project-title">
          <img
            alt={project.title}
            decoding="async"
            fetchPriority="high"
            height={1182}
            sizes="(min-width: 768px) 520px, calc(100vw - 32px)"
            src={asset("wordmark-800.webp")}
            srcSet={`${asset("wordmark-800.webp")} 800w, ${asset("wordmark-1200.webp")} 1200w`}
            width={1200}
          />
        </h1>
        <p className="hero-subtitle">{project.subtitle}</p>
        <p className="hero-meta">
          <span>{project.date}</span>
          <span>{cities}</span>
        </p>
      </div>
      <div className="hero-art" aria-hidden="true" ref={artRef}>
        <img
          alt=""
          decoding="async"
          fetchPriority="high"
          height={3440}
          sizes="(min-width: 768px) 55vw, 100vw"
          src={asset("keyvisual-1200.webp")}
          srcSet={`${asset("keyvisual-1200.webp")} 1200w, ${asset("keyvisual-2400.webp")} 2400w`}
          width={2580}
        />
      </div>
    </section>
  );
}
