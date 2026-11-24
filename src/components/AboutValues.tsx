"use client";

import React, { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const valuesData = [
  {
    rule: "The Office Rules 01",
    heading: "THE BRIEF IS NOT SET IN STONE",
    para: "A brief is a starting point, not a set of commandments. We’ll challenge assumptions and push boundaries if we see a more high-impact path to your objectives.",
  },
  {
    rule: "The Office Rules 02",
    heading: "GOOD IDEAS NEED SPACE",
    para: "We don’t settle for the first solution that barely works. Giving architecture and craft sufficient breathing room produces software that compounds value over years.",
  },
  {
    rule: "The Office Rules 03",
    heading: "PRETTY IS NOT A STRATEGY",
    para: "Visual beauty without underlying technical performance is decoration. We engineer conversion funnels, sub-second latency, and scalable databases behind every pristine interface.",
  },
  {
    rule: "The Office Rules 04",
    heading: "IF IT CAN BE SIMPLe, SIMPLIFY",
    para: "Complexity for complexity's sake breeds technical debt and friction. If your product architecture can accomplish more with less overhead, we make it happen.",
  },
];

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const spacer = spacerRef.current;
    if (!section || !spacer) return;

    const cards = [...section.querySelectorAll<HTMLElement>(".value-card")];
    const lastCard = cards.at(-1);
    if (!lastCard) return;

    const sizeSpacer = () => {
      const top = parseFloat(getComputedStyle(lastCard).top);
      const height = Math.max(0, window.innerHeight - top - lastCard.offsetHeight);
      spacer.style.height = `${height}px`;
    };
    sizeSpacer();
    ScrollTrigger.addEventListener("refreshInit", sizeSpacer);

    const motion = gsap.matchMedia(section);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      cards.forEach((card, index) => {
        const progress = card.querySelector(".value-progress");
        if (progress) {
          gsap.fromTo(progress, { scaleX: 0 }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: index === 0 ? "top center" : "top bottom",
              end: () => `top ${getComputedStyle(card).top}`,
              scrub: true,
            },
          });
        }

        gsap.fromTo(
          card.querySelectorAll(".value-heading, .value-para"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              once: true,
            },
          },
        );
      });
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", sizeSpacer);
      motion.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-values">
      <div className="section-values-wrapper">
        {valuesData.map((val, idx) => (
          <div key={val.rule} className="value-card" style={{ "--value-card-index": idx } as CSSProperties}>
            <div className="value-text">{val.rule}</div>
            <div className="value-content">
              <h2 className="value-heading">{val.heading}</h2>
              <p className="value-para">{val.para}</p>
            </div>
            <div className="value-progress"></div>
          </div>
        ))}
        <div ref={spacerRef} className="values-sticky-spacer" aria-hidden="true" />
      </div>
    </section>
  );
}
