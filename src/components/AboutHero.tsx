"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroSection = sectionRef.current;
    if (!heroSection) return;

    const headings = Array.from(
      heroSection.querySelectorAll(".about-hero-text .heading")
    ) as HTMLElement[];
    const pills = Array.from(
      heroSection.querySelectorAll(".work-hero-pill")
    ) as HTMLElement[];
    const svgPath = heroSection.querySelector(
      ".about-hero-path svg path"
    ) as SVGPathElement | null;
    const chairImg = heroSection.querySelector(
      ".about-hero-img"
    ) as HTMLElement | null;
    const para = heroSection.querySelector(
      ".about-hero-para"
    ) as HTMLElement | null;

    // 1. Line-by-Line Heading Setup
    let allHeadingLines: HTMLElement[] = [];
    headings.forEach((heading) => {
      const rawText = heading.textContent?.trim() || "";
      heading.innerHTML = `<span class="about-hero-line-mask" style="display:block;overflow:hidden;"><span class="about-hero-line" style="display:block;will-change:transform,opacity;">${rawText}</span></span>`;
      const line = heading.querySelector(".about-hero-line") as HTMLElement | null;
      if (line) {
        gsap.set(line, { y: "115%", opacity: 0 });
        allHeadingLines.push(line);
      }
      gsap.set(heading, { opacity: 1 });
    });

    // 2. Pills Setup
    pills.forEach((pill) => {
      const pillTextEl = pill.querySelector(".hero-pill-text") as HTMLElement | null;
      if (pillTextEl) {
        const textContent = pillTextEl.textContent?.trim() || "";
        pillTextEl.innerHTML = `<span class="about-hero-pill-text-mask" style="display:block;overflow:hidden;"><span class="about-hero-pill-inner" style="display:block;will-change:transform,opacity;">${textContent}</span></span>`;
        const inner = pillTextEl.querySelector(".about-hero-pill-inner") as HTMLElement | null;
        if (inner) {
          gsap.set(inner, { y: "105%", opacity: 0 });
        }
      }
      gsap.set(pill, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });
    });

    // 3. SVG Path Setup
    let pathLen = 2500;
    if (svgPath) {
      svgPath.style.strokeLinecap = "round";
      svgPath.style.strokeLinejoin = "round";
      pathLen = svgPath.getTotalLength ? svgPath.getTotalLength() : 2500;
      svgPath.style.strokeDasharray = `${pathLen}`;
      svgPath.style.strokeDashoffset = `${pathLen}`;
      gsap.set(svgPath, { strokeWidth: 0 });
    }

    // 4. Chair illustration Setup
    if (chairImg) {
      gsap.set(chairImg, {
        opacity: 0,
        scale: 0.65,
        rotation: -6,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });
    }

    // 5. Paragraph Lines Setup
    let allParaLines: HTMLElement[] = [];
    if (para) {
      const rawPara = para.textContent?.trim() || "";
      const words = rawPara.split(" ");
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(" ");
      const line2 = words.slice(mid).join(" ");

      para.innerHTML = `
        <span class="about-hero-line-mask" style="display:block;overflow:hidden;"><span class="about-hero-para-line" style="display:block;will-change:transform,opacity;">${line1}</span></span>
        <span class="about-hero-line-mask" style="display:block;overflow:hidden;"><span class="about-hero-para-line" style="display:block;will-change:transform,opacity;">${line2}</span></span>
      `;
      const lines = Array.from(para.querySelectorAll(".about-hero-para-line")) as HTMLElement[];
      gsap.set(lines, { y: "115%", opacity: 0 });
      gsap.set(para, { opacity: 1 });
      allParaLines = lines;
    }

    // 6. Master About Hero Entrance Timeline
    const totalLinesTime = allHeadingLines.length * 0.12 + 0.5;
    const heroTl = gsap.timeline({
      defaults: { ease: "power2.out" },
      delay: 0.15,
    }).timeScale(0.85);

    // A. Headings reveal
    if (allHeadingLines.length) {
      heroTl.to(
        allHeadingLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
        0
      );
    }

    // B. Pills pop in
    const pillPercents = [0.35, 0.7];
    pills.forEach((pill, i) => {
      const pillStart = totalLinesTime * (pillPercents[i] || 0.5);
      const inner = pill.querySelector(".about-hero-pill-inner");

      heroTl.to(
        pill,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(2.5)",
        },
        pillStart
      );

      if (inner) {
        heroTl.to(
          inner,
          {
            y: "0%",
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
          },
          pillStart + 0.12
        );
      }
    });

    // C. SVG Path draw
    if (svgPath) {
      const startTime = totalLinesTime * 0.35;
      heroTl
        .to(
          svgPath,
          {
            strokeDashoffset: 0,
            duration: 1.0,
            ease: "power2.out",
          },
          startTime
        )
        .to(
          svgPath,
          {
            strokeWidth: 30,
            duration: 0.9,
            ease: "power2.out",
          },
          startTime
        );
    }

    // D. Chair illustration pop
    if (chairImg) {
      heroTl.to(
        chairImg,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.85,
          ease: "back.out(2.2)",
        },
        totalLinesTime * 0.45
      );
    }

    // E. Paragraph lines reveal
    if (allParaLines.length) {
      heroTl.to(
        allParaLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        totalLinesTime * 0.5
      );
    }

    return () => {
      heroTl.kill();
    };
  }, []);

  return (
    <div ref={sectionRef} className="section-about-hero-wrapper">
      <div className="about-hero-text">
        <h1 className="heading left-align">Small studio,</h1>
        <div className="work-hero-pill two">
          <div className="hero-pill-text">Boutique feel</div>
        </div>
        <h1 className="heading right-align less-max">big brand energy</h1>
        <div className="work-hero-pill one">
          <div className="hero-pill-text">Big brand energy</div>
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
            NexusCzar is a software architecture, full-stack product engineering, and digital growth studio. We partner with ambitious enterprises and high-growth brands to build scalable web apps, custom platforms, and technical growth infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
}
