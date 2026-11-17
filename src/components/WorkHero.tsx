"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function WorkHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const heroSection = sectionRef.current;
    if (!heroSection) return;

    const headings = Array.from(
      heroSection.querySelectorAll(".work-hero-text .heading")
    ) as HTMLElement[];
    const pills = Array.from(
      heroSection.querySelectorAll(".work-hero-pill")
    ) as HTMLElement[];
    const svgPath = heroSection.querySelector(
      ".work-hero-path svg path"
    ) as SVGPathElement | null;
    const catWorkWrapper = heroSection.querySelector(
      ".cat-work-wrapper"
    ) as HTMLElement | null;
    const para = heroSection.querySelector(
      ".work-hero-para"
    ) as HTMLElement | null;

    // 1. Line-by-Line Heading Setup
    let allHeadingLines: HTMLElement[] = [];
    headings.forEach((heading) => {
      const rawText = heading.textContent?.trim() || "";
      heading.innerHTML = `<span class="work-hero-line-mask" style="display:block;overflow:hidden;"><span class="work-hero-line" style="display:block;will-change:transform,opacity;">${rawText}</span></span>`;
      const line = heading.querySelector(".work-hero-line") as HTMLElement | null;
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
        pillTextEl.innerHTML = `<span class="work-hero-pill-text-mask" style="display:block;overflow:hidden;"><span class="work-hero-pill-inner" style="display:block;will-change:transform,opacity;">${textContent}</span></span>`;
        const inner = pillTextEl.querySelector(".work-hero-pill-inner") as HTMLElement | null;
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
    let pathLen = 1500;
    if (svgPath) {
      svgPath.style.strokeLinecap = "round";
      svgPath.style.strokeLinejoin = "round";
      pathLen = svgPath.getTotalLength ? svgPath.getTotalLength() : 1500;
      svgPath.style.strokeDasharray = `${pathLen}`;
      svgPath.style.strokeDashoffset = `${pathLen}`;
      gsap.set(svgPath, { strokeWidth: 0 });
    }

    // 4. Cat illustration Setup (wrapper scaled & rotated)
    if (catWorkWrapper) {
      gsap.set(catWorkWrapper, {
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
      const rawPara = para.innerHTML.trim();
      para.innerHTML = `<span class="work-hero-line-mask" style="display:block;overflow:hidden;"><span class="work-hero-para-line" style="display:block;will-change:transform,opacity;">${rawPara}</span></span>`;
      const lines = Array.from(para.querySelectorAll(".work-hero-para-line")) as HTMLElement[];
      gsap.set(lines, { y: "115%", opacity: 0 });
      gsap.set(para, { opacity: 1 });
      allParaLines = lines;
    }

    // 6. Master Work Hero Entrance Timeline
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
      const inner = pill.querySelector(".work-hero-pill-inner");

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

    // D. Cat illustration
    if (catWorkWrapper) {
      heroTl.to(
        catWorkWrapper,
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

    // E. Paragraph reveal
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
    <section ref={sectionRef} className="section-work-hero">
      <div className="section-work-hero-wrapper">
        <div className="work-hero-text">
          <h1 className="heading left-align">A few projects</h1>
          <div className="work-hero-pill two">
            <div className="hero-pill-text">Just a few</div>
          </div>
          <h1 className="heading right-align">to brag about</h1>
          <div className="work-hero-pill one">
            <div className="hero-pill-text">Kind of proud</div>
          </div>
        </div>

        <div className="work-hero-path">
          <div className="code-embed-2 w-embed">
            <svg
              width="230"
              height="575"
              viewBox="0 0 230 575"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: "visible" }}
            >
              <path
                d="M171.769 562.464C171.769 562.464 -1.40879 424.611 16.2688 279.464C25.7685 201.464 68.7349 148.19 136.269 152.464C206.346 156.9 248.62 311.964 179.269 311.964C138.269 311.964 85.2685 223.964 101.269 138.964C114.373 69.3474 171.769 10.4645 171.769 10.4645"
                stroke="#2f849c"
                strokeWidth="30"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="work-hero-btm">
          <div className="cat-work-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nexusczar/cat-work.svg"
              alt="NexusCzar Work"
              className="cat-work-img"
            />
          </div>
          <p className="work-hero-para">
            A selection of brands, identities, scalable web applications and technical growth engines we’ve engineered. Different challenges, bespoke architectures, same focus on perfection.
          </p>
        </div>
      </div>
    </section>
  );
}
