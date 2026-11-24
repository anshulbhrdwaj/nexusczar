"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { projectsData } from "./projectData";

export default function ShowcaseMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label="Project artwork" className="section-slider-showcase">
      <div className="section-slider-wrapper">
        <div className="showcase-slider" data-paused={paused}>
          {[false, true].map((duplicate) => (
            <div
              key={String(duplicate)}
              className="showcase-slide-group"
              aria-hidden={duplicate || undefined}
            >
              {projectsData.map((project) => (
                <div key={project.id} className="showcase-slide">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.artwork}
                    alt={duplicate ? "" : `Concept artwork for ${project.name}. ${project.artworkAlt}.`}
                    width={1440}
                    height={1080}
                    fetchPriority="low"
                    decoding="async"
                    className="showcase-slide-img"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="showcase-motion-button"
        aria-label={paused ? "Play project slider" : "Pause project slider"}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </section>
  );
}
