"use client";

import React, { useEffect, useRef } from "react";
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const cards = Array.from(section.querySelectorAll(".value-card")) as HTMLElement[];
    const totalCards = cards.length;
    if (totalCards === 0) return;

    // Helper: Dynamic em calculation probe
    const getEm = (emCount: number) => {
      const probe = document.createElement("div");
      probe.style.cssText = `height:${emCount}em;width:0;position:absolute;visibility:hidden;pointer-events:none;`;
      wrapper.appendChild(probe);
      const px = probe.offsetHeight;
      wrapper.removeChild(probe);
      return px > 5 ? px : emCount * 16;
    };

    const getBaseTop = () => getEm(5);
    const getStepOffset = () => {
      const isMobile = window.innerWidth < 768;
      return isMobile ? getEm(3) : getEm(5);
    };

    // 1. Apply Responsive CSS sticky positioning
    const applyStickyPositions = () => {
      const baseTop = getBaseTop();
      const stepOffset = getStepOffset();

      cards.forEach((card, index) => {
        const stickyTop = baseTop + index * stepOffset;
        card.style.position = "sticky";
        card.style.top = `${stickyTop}px`;
        card.style.zIndex = `${10 + index * 10}`;
      });
    };

    applyStickyPositions();

    // 2. Add sticky spacer after last card
    const addSpacer = () => {
      const old = wrapper.querySelector(".values-sticky-spacer");
      if (old) old.remove();

      const baseTop = getBaseTop();
      const stepOffset = getStepOffset();
      const lastPinTop = baseTop + (totalCards - 1) * stepOffset;
      const lastCardHeight = cards[totalCards - 1].offsetHeight;
      const spacerHeight = Math.max(
        0,
        window.innerHeight - lastPinTop - lastCardHeight
      );

      const spacer = document.createElement("div");
      spacer.className = "values-sticky-spacer";
      spacer.style.cssText = `height:${spacerHeight}px;width:100%;pointer-events:none;flex-shrink:0;`;
      wrapper.appendChild(spacer);
    };

    addSpacer();

    // 3. Synchronized Progress Bars
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      const progress = card.querySelector(".value-progress") as HTMLElement | null;
      if (!progress) return;

      const getPinTop = () => {
        const baseTop = getBaseTop();
        const stepOffset = getStepOffset();
        return baseTop + index * stepOffset;
      };

      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      const st = ScrollTrigger.create({
        trigger: card,
        start: index === 0 ? "top center" : "top bottom",
        end: () => `top ${getPinTop()}px`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progress, { scaleX: self.progress });
        },
      });

      triggers.push(st);

      // Kinetic text entrance
      const heading = card.querySelector(".value-heading");
      const para = card.querySelector(".value-para");
      if (heading && para) {
        gsap.fromTo(
          [heading, para],
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
          }
        );
      }
    });

    const handleResize = () => {
      applyStickyPositions();
      addSpacer();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      triggers.forEach((st) => st.kill());
      const spacer = wrapper.querySelector(".values-sticky-spacer");
      if (spacer) spacer.remove();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-values">
      <div ref={wrapperRef} className="section-values-wrapper">
        {valuesData.map((val, idx) => (
          <div key={idx} className="value-card">
            <div className="value-text">{val.rule}</div>
            <div className="value-content">
              <h2 className="value-heading">{val.heading}</h2>
              <p className="value-para">{val.para}</p>
            </div>
            <div className="value-progress"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
