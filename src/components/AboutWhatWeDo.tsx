"use client";

import React, { useEffect, useRef } from "react";
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

const SVG_TEMPLATE = `
  <svg width="100%" height="100%" viewBox="0 0 314 104" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M275.442 89.5C275.442 89.5 315.942 46.9995 298.942 28C263.713 -11.373 199.942 117 178.442 89.5C159.869 65.7436 223.442 40.9995 209.942 19C185.09 -21.5005 106.942 115 83.9422 89.5C64.5454 67.9953 122.442 36.4999 106.942 19C80.2505 -11.1362 41.4424 89.5 14.4422 64.5C-2.00465 49.2716 32.4422 10 32.4422 10" stroke="#2f849c" stroke-width="200" stroke-linecap="round"/>
  </svg>
`;

export default function AboutWhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pills = Array.from(section.querySelectorAll(".do-cms--pill")) as HTMLElement[];
    if (!pills.length) return;

    const COLOR_TEAL = "#2f849c";
    const COLOR_WHITE = "#f0f7f9";

    const cleanups: (() => void)[] = [];

    pills.forEach((pill) => {
      const text = pill.querySelector(".do-pill-text") as HTMLElement | null;
      let fill = pill.querySelector(".do-pill-fill") as HTMLElement | null;

      if (!fill) {
        fill = document.createElement("div");
        fill.className = "do-pill-fill";
        pill.appendChild(fill);
      }

      if (!fill.querySelector("svg")) {
        fill.innerHTML = SVG_TEMPLATE.trim();
      }

      const path = fill.querySelector("path") as SVGPathElement | null;
      if (!path) return;

      path.style.strokeLinecap = "round";
      path.style.strokeLinejoin = "round";

      const targetStrokeWidth =
        parseFloat(path.getAttribute("stroke-width") || "200") || 200;

      const pathLength = path.getTotalLength ? path.getTotalLength() : 1000;
      path.style.strokeDasharray = `${pathLength} ${pathLength}`;
      path.style.strokeDashoffset = `${pathLength}`;
      gsap.set(path, { strokeWidth: 0 });

      if (text) {
        gsap.set(text, { color: COLOR_TEAL });
      }

      const hoverTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
      });

      hoverTl
        .to(
          path,
          {
            strokeDashoffset: 0,
            strokeWidth: targetStrokeWidth,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          text,
          {
            color: COLOR_WHITE,
            duration: 0.6,
            ease: "power1.out",
          },
          0.15
        );

      const onEnter = () => hoverTl.timeScale(1).play();
      const onLeave = () => hoverTl.timeScale(1.1).reverse();

      pill.addEventListener("mouseenter", onEnter);
      pill.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        pill.removeEventListener("mouseenter", onEnter);
        pill.removeEventListener("mouseleave", onLeave);
        hoverTl.kill();
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-what-we-do">
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
            {capabilities.map((pill, i) => (
              <div key={i} role="listitem" className="do-cms--pill w-dyn-item">
                <div className="do-pill-text">{pill}</div>
                <div
                  className="do-pill-fill"
                  dangerouslySetInnerHTML={{ __html: SVG_TEMPLATE.trim() }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
