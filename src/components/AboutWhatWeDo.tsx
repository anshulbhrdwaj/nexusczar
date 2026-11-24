"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { gsap } from "gsap";

const capabilities = [
  "Custom Next.js Apps",
  "Cloud Architecture",
  "UI/UX Architecture",
  "Scalable Design Systems",
  "Programmatic SEO",
  "Sub-Second CWV",
  "Data Security (DSPM)",
  "REST & GraphQL APIs",
  "Microservices & Serverless",
  "Brand Identity",
  "Kinetic Motion Design",
  "Interactive Prototypes",
  "Structured Schema (JSON-LD)",
  "Automated PII Discovery",
  "Cloud Compliance",
  "PostgreSQL Modeling",
  "Design Audits & Revamps",
  "High-ROAS Paid Acquisition",
  "Funnel & Attribution",
  "Zero-Trust Architecture",
  "Vulnerability Audits",
  "Technical Indexation Audits",
  "Cross-Platform Apps",
  "Data Access Governance",
  "Real-Time WebSockets",
];

const BRUSH_PATH = "M275.442 89.5C275.442 89.5 315.942 46.9995 298.942 28C263.713 -11.373 199.942 117 178.442 89.5C159.869 65.7436 223.442 40.9995 209.942 19C185.09 -21.5005 106.942 115 83.9422 89.5C64.5454 67.9953 122.442 36.4999 106.942 19C80.2505 -11.1362 41.4424 89.5 14.4422 64.5C-2.00465 49.2716 32.4422 10 32.4422 10";

export default function AboutWhatWeDo() {
  const hoverTimelines = useRef(new Map<HTMLElement, gsap.core.Timeline>());

  useEffect(() => {
    const timelines = hoverTimelines.current;
    return () => {
      timelines.forEach((timeline) => timeline.revert());
      timelines.clear();
    };
  }, []);

  function playBrush(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const pill = event.currentTarget;
    const timelines = hoverTimelines.current;
    let timeline = timelines.get(pill);

    if (!timeline) {
      const path = pill.querySelector(".do-pill-fill path");
      const text = pill.querySelector(".do-pill-text");
      if (!path || !text) return;

      timeline = gsap.timeline({ paused: true })
        .to(path, {
          attr: { "stroke-dashoffset": 0 },
          strokeWidth: 200,
          duration: 0.95,
          ease: "power2.inOut",
        }, 0)
        .to(text, { color: "#f0f7f9", duration: 0.6, ease: "power1.out" }, 0.15);
      timelines.set(pill, timeline);
    }

    timeline.timeScale(1).play();
  }

  function reverseBrush(event: PointerEvent<HTMLDivElement>) {
    hoverTimelines.current.get(event.currentTarget)?.timeScale(1.1).reverse();
  }

  return (
    <section className="section-what-we-do">
      <div className="section-what-we-do-wrapper">
        <div className="section-projects-header">
          <div className="section-about-text">
            <strong>CAPABILITIES</strong>
          </div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">WE’VE GOT RANGE</h2>
          </div>
        </div>

        <div className="what-we-do-cms w-dyn-list">
          <div role="list" className="do-cms-list w-dyn-items">
            {capabilities.map((pill) => (
              <div
                key={pill}
                role="listitem"
                className="do-cms--pill w-dyn-item"
                onPointerEnter={playBrush}
                onPointerLeave={reverseBrush}
              >
                <div className="do-pill-text">{pill}</div>
                <div aria-hidden="true" className="do-pill-fill">
                  <svg viewBox="0 0 314 104" width="100%" height="100%" preserveAspectRatio="none" fill="none">
                    <path
                      d={BRUSH_PATH}
                      pathLength={1}
                      stroke="#2f849c"
                      strokeWidth={0}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="1 1"
                      strokeDashoffset={1}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
