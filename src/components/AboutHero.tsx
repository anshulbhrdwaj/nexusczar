"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";

function MaskedLine({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className="about-hero-line-mask">
      <span className={className}>{children}</span>
    </span>
  );
}

export default function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroSection = sectionRef.current;
    if (!heroSection) return;

    const motion = gsap.matchMedia(heroSection);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const headings = heroSection.querySelectorAll(".about-hero-line");
      const pills = [...heroSection.querySelectorAll(".work-hero-pill")];
      const pillLines = heroSection.querySelectorAll(".about-hero-pill-inner");
      const paraLines = heroSection.querySelectorAll(".about-hero-para-line");
      const svgPath = heroSection.querySelector<SVGPathElement>(".about-hero-path path");
      const chair = heroSection.querySelector(".about-hero-img");

      gsap.set([headings, paraLines], { yPercent: 115, opacity: 0 });
      gsap.set(pillLines, { yPercent: 105, opacity: 0 });
      gsap.set(pills, { opacity: 0, scale: 0.4, y: 20, transformOrigin: "center center" });
      gsap.set(chair, { opacity: 0, scale: 0.65, rotation: -6, transformOrigin: "center center" });

      const entrance = gsap.timeline({
        defaults: { ease: "power2.out" },
        delay: 0.15,
      }).timeScale(0.85);
      const headingTime = headings.length * 0.12 + 0.5;

      entrance.to(headings, {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: "back.out(1.4)",
      }, 0);

      pills.forEach((pill, index) => {
        const start = headingTime * (index === 0 ? 0.35 : 0.7);
        entrance
          .to(pill, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(2.5)",
          }, start)
          .to(pillLines[index], {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
          }, start + 0.12);
      });

      if (svgPath) {
        gsap.set(svgPath, {
          attr: { "stroke-dasharray": "1 1", "stroke-dashoffset": 1 },
          strokeWidth: 0,
        });
        const start = headingTime * 0.35;
        entrance
          .to(svgPath, { attr: { "stroke-dashoffset": 0 }, duration: 1 }, start)
          .to(svgPath, { strokeWidth: 30, duration: 0.9 }, start);
      }

      entrance
        .to(chair, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.85,
          ease: "back.out(2.2)",
        }, headingTime * 0.45)
        .to(paraLines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "back.out(1.4)",
        }, headingTime * 0.5);
    });

    return () => motion.revert();
  }, []);

  return (
    <div ref={sectionRef} className="section-about-hero-wrapper">
      <div className="about-hero-text">
        <h1 className="heading left-align">
          <MaskedLine className="about-hero-line">Small studio,</MaskedLine>
        </h1>
        <div className="work-hero-pill two">
          <div className="hero-pill-text">
            <MaskedLine className="about-hero-pill-inner">Boutique feel</MaskedLine>
          </div>
        </div>
        <h1 className="heading right-align less-max">
          <MaskedLine className="about-hero-line">big brand energy</MaskedLine>
        </h1>
        <div className="work-hero-pill one">
          <div className="hero-pill-text">
            <MaskedLine className="about-hero-pill-inner">Big brand energy</MaskedLine>
          </div>
        </div>
      </div>

      <div className="about-hero-path">
        <div className="code-embed-2 w-embed">
          <svg
            width="492"
            height="789"
            viewBox="0 0 492 789"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <path
              d="M346.027 773.963C346.027 773.963 123.155 751.726 37.5236 580.463C-5.47612 494.463 12.1589 403.856 98.5229 359.463C259.022 276.963 386.528 426.963 423.028 500.963C469.82 595.828 230.528 683.463 212.028 548.463C195.241 425.963 407.22 329.963 451.028 251.963C519.452 130.133 435.528 24.9629 380.528 15.9629C337.028 8.84469 282.028 42.1764 282.028 85.9629C282.028 142.463 359.528 181.463 359.528 181.463"
              stroke="#2f849c"
              pathLength={1}
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="about-hero-btm">
        <div className="about-hero-svg-wrapper">
          <Image
            src="/nexusczar/chair.svg"
            alt="NexusCzar Studio"
            width={240}
            height={240}
            className="about-hero-img"
            priority
          />
        </div>
        <div className="abput-para-wrapper">
          <p className="about-hero-para">
            <MaskedLine className="about-hero-para-line">NexusCzar is a software architecture, full-stack product engineering, and digital growth studio. We partner with ambitious</MaskedLine>{" "}
            <MaskedLine className="about-hero-para-line">enterprises and high-growth brands to build scalable web apps, custom platforms, and technical growth infrastructure.</MaskedLine>
          </p>
        </div>
      </div>
    </div>
  );
}
