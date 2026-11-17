"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroPathLeftSvg, HeroPathRightSvg } from "./svgs";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  // 1. Master Hero Entrance Animation (Heading masked lines, 2-phase pills, drawing SVGs)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    if (!hero) return;

    // A. Elements Selection
    const headings = Array.from(
      hero.querySelectorAll(".hero-text h1, .hero-text .heading, h1, [data-hero-heading]")
    ) as HTMLElement[];
    const pills = Array.from(hero.querySelectorAll(".hero-pill")) as HTMLElement[];
    const allSvgPaths = Array.from(
      hero.querySelectorAll(".hero-path-svg-left svg path, .hero-path-svg-right svg path")
    ) as SVGPathElement[];

    // B. Line-by-Line Heading Splitting (Natural lines or word wrapping)
    let linesList: HTMLElement[] = [];
    headings.forEach((heading) => {
      const rawText = heading.textContent?.trim() || "";
      if (rawText && !heading.querySelector(".hero-line")) {
        // Measure natural line wrapping using inline words
        const words = rawText.split(/\s+/);
        heading.innerHTML = words
          .map((w) => `<span class="hero-temp-w" style="display:inline-block;white-space:nowrap;">${w}&nbsp;</span>`)
          .join("");

        const wordEls = Array.from(heading.querySelectorAll(".hero-temp-w")) as HTMLElement[];
        const linesMap = new Map<number, HTMLElement[]>();

        wordEls.forEach((w) => {
          const top = Math.round(w.offsetTop);
          if (!linesMap.has(top)) {
            linesMap.set(top, []);
          }
          linesMap.get(top)!.push(w);
        });

        heading.innerHTML = "";
        linesMap.forEach((wordsInLine) => {
          const lineText = wordsInLine.map((w) => w.textContent).join("").trim();
          const mask = document.createElement("span");
          mask.className = "hero-line-mask";
          mask.style.display = "block";
          mask.style.overflow = "hidden";

          const lineSpan = document.createElement("span");
          lineSpan.className = "hero-line";
          lineSpan.style.display = "block";
          lineSpan.style.willChange = "transform, opacity";
          lineSpan.textContent = lineText;

          mask.appendChild(lineSpan);
          heading.appendChild(mask);
        });
      }

      const lines = Array.from(heading.querySelectorAll(".hero-line")) as HTMLElement[];
      gsap.set(heading, { opacity: 1 });
      gsap.set(lines, {
        y: "115%",
        opacity: 0,
        display: "block",
      });
      linesList = linesList.concat(lines);
    });

    // C. Initial Setup for Pills (Preserves Designer's Custom Rotation & creates slide-up mask)
    pills.forEach((pill) => {
      const pillTextEl = pill.querySelector<HTMLElement>(".hero-pill-text");
      if (pillTextEl) {
        gsap.set(pillTextEl, { y: "105%", opacity: 0 });
      }

      gsap.set(pill, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });
    });

    // D. Initial Setup for Hero SVG Paths (draw 0 & stroke 0)
    const pathData: { path: SVGPathElement; origWidth: number; len: number }[] = [];
    allSvgPaths.forEach((path) => {
      path.style.strokeLinecap = "round";
      path.style.strokeLinejoin = "round";
      const origWidth = parseFloat(path.getAttribute("stroke-width") || "30") || 30;
      const len = path.getTotalLength ? path.getTotalLength() : 1500;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      gsap.set(path, { strokeWidth: 0 });
      pathData.push({ path, origWidth, len });
    });

    // E. Build Master Hero Timeline
    const heroTl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      })
      .timeScale(1.0);

    // 1. Line-by-Line Heading Entrance
    if (linesList.length) {
      heroTl.to(
        linesList,
        {
          y: "0%",
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        0
      );
    }

    const totalLinesTime = linesList.length ? linesList.length * 0.1 + 0.45 : 1.0;

    // 2. Animate Pills – shell pops in, inner text slides up from mask
    pills.forEach((pill, i) => {
      const pillStart = 0.15 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.6;
      const pillTextEl = pill.querySelector<HTMLElement>(".hero-pill-text");

      // Phase 1: Pill shell appears (scale + y)
      heroTl.to(
        pill,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2.5)",
        },
        pillStart
      );

      // Phase 2: Inner text slides up from behind mask
      if (pillTextEl) {
        heroTl.to(
          pillTextEl,
          {
            y: "0%",
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.6)",
          },
          pillStart + 0.12
        );
      }
    });

    // 3. Animate Hero SVG Paths (draw 0 -> 100% & strokeWidth 0 -> origWidth)
    if (pathData.length) {
      pathData.forEach((item, pIdx) => {
        const startTime = totalLinesTime * 0.4 + pIdx * 0.15;
        heroTl
          .to(
            item.path,
            {
              strokeDashoffset: 0,
              duration: 0.9,
              ease: "power2.out",
            },
            startTime
          )
          .to(
            item.path,
            {
              strokeWidth: item.origWidth,
              duration: 0.9,
              ease: "power2.out",
            },
            startTime
          );
      });
    }

    // F. Play Hero – fires on loaderComplete OR immediate if already done
    let heroPlayed = false;
    function playHero() {
      if (heroPlayed) return;
      heroPlayed = true;
      heroTl.play();
    }

    const isLoaderDone =
      typeof window !== "undefined" &&
      ((window as unknown as { __nexusczarLoaderDone?: boolean }).__nexusczarLoaderDone ||
        document.body.getAttribute("data-nexusczar-loader-done") === "true");

    if (isLoaderDone) {
      playHero();
    } else {
      document.addEventListener("nexusczar:loaderComplete", playHero, { once: true });
      window.addEventListener("nexusczar:loaderComplete", playHero, { once: true });
      const safetyTimer = setTimeout(playHero, 6000);
      return () => {
        document.removeEventListener("nexusczar:loaderComplete", playHero);
        window.removeEventListener("nexusczar:loaderComplete", playHero);
        clearTimeout(safetyTimer);
      };
    }
  }, []);

  // 2. Hero Marquee Curved Path Infinite Loop + ScrollTrigger Right-to-Left Draw
  useEffect(() => {
    const marquee = marqueeContainerRef.current;
    if (!marquee) return;

    const bgPath = marquee.querySelector(".hero-marquee-bg") as SVGPathElement | null;
    const maskPath = marquee.querySelector(".hero-marquee-mask-path") as SVGPathElement | null;
    const textPath = marquee.querySelector(".hero-marquee-tp") as SVGTextPathElement | null;
    const textGroup = marquee.querySelector(".hero-marquee-text-group") as SVGGElement | null;
    const unit = marquee.querySelector(".marquee-unit") as SVGTSpanElement | null;

    if (!bgPath || !maskPath || !textPath) return;

    const bgLen = bgPath.getTotalLength ? bgPath.getTotalLength() : 2000;
    const maskLen = maskPath.getTotalLength ? maskPath.getTotalLength() : 2000;

    // Start hidden on the right end (positive offset)
    bgPath.style.strokeDasharray = `${bgLen}`;
    bgPath.style.strokeDashoffset = `${bgLen}`;
    maskPath.style.strokeDasharray = `${maskLen}`;
    maskPath.style.strokeDashoffset = `${maskLen}`;

    // Start Seamless Infinite Marquee Loop
    let marqueeTween: gsap.core.Tween | null = null;
    const startInfiniteMarquee = () => {
      const unitLength = unit ? unit.getComputedTextLength() : 1600;
      const speedDuration = unitLength / 75; // Smooth slow reading pace matching reference

      marqueeTween = gsap.to(textPath, {
        attr: { startOffset: -unitLength },
        duration: speedDuration,
        ease: "none",
        repeat: -1,
      });
    };

    startInfiniteMarquee();

    const scrollerEl = document.querySelector(".page") || window;

    // ScrollTrigger: Draw Ribbon + Reveal Text simultaneously from Right to Left
    const st = ScrollTrigger.create({
      trigger: marquee,
      scroller: scrollerEl,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to([bgPath, maskPath], {
          strokeDashoffset: 0,
          delay: window.innerWidth < 991 ? 0.3 : 0,
          duration: 1.3,
          ease: "power2.out",
          onComplete: () => {
            if (textGroup) {
              textGroup.removeAttribute("mask");
            }
          },
        });
      },
    });

    return () => {
      if (marqueeTween) marqueeTween.kill();
      st.kill();
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="section-hero hero" data-section="hero">
      <div className="section-hero-wrapper">
        {/* 1. Main Central Typography & Positioned Pills */}
        <div className="hero-text">
          <div className="hero-pill two">
            <span className="hero-pill-text-mask">
              <span className="hero-pill-text">To Right Audience</span>
            </span>
          </div>
          <div className="hero-pill two">
            <span className="hero-pill-text-mask">
              <span className="hero-pill-text">NexusCzar Studio</span>
            </span>
          </div>
          <h1 className="heading line-1">BUILD, MARKET &amp;</h1>
          <h1 className="heading line-2">SCALE</h1>
          <div className="hero-pill one">
            <span className="hero-pill-text-mask">
              <span className="hero-pill-text">Web &amp; Custom Apps</span>
            </span>
          </div>
          <div className="hero-pill three">
            <span className="hero-pill-text-mask">
              <span className="hero-pill-text">Growth &amp; SEO Engines</span>
            </span>
          </div>
        </div>

        {/* 2. Decorative Animated SVG Paths */}
        <div className="hero-path-svg-left">
          <div className="code-embed-3 w-embed">
            <HeroPathLeftSvg />
          </div>
        </div>
        <div className="hero-path-svg-right">
          <div className="code-embed-2 w-embed">
            <HeroPathRightSvg />
          </div>
        </div>

        {/* 3. Authentic NexusCzar Curved Ribbon & Masked TextPath SVG Marquee */}
        <div ref={marqueeContainerRef} className="hero-marquee">
          <div className="code-embed-8 w-embed w-script" style={{ width: "100%" }}>
            <svg
              viewBox="0 0 1440 370"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
            >
              <defs>
                {/* Extended Text Curve (Extends to x:5000 so incoming text flows seamlessly with zero pop-in) */}
                <path
                  id="hero-marquee-curve"
                  d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117 L 5000 507"
                  fill="none"
                />

                {/* SVG Mask for Right-to-Left Text Reveal */}
                <mask id="hero-marquee-text-mask" maskUnits="userSpaceOnUse">
                  <path
                    className="hero-marquee-mask-path"
                    d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117"
                    stroke="#FFFFFF"
                    strokeWidth="220"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </mask>
              </defs>

              {/* 1. Background Teal Ribbon Stroke */}
              <path
                className="hero-marquee-bg"
                d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117"
                stroke="#2f849c"
                strokeWidth="154"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* 2. Text Group revealed via Stroke Mask */}
              <g className="hero-marquee-text-group" mask="url(#hero-marquee-text-mask)">
                <text
                  className="hero-marquee-text"
                  fill="#FFFFFF"
                  dominantBaseline="central"
                  alignmentBaseline="central"
                  fontSize="80"
                  fontWeight="800"
                  fontFamily="inherit"
                  style={{
                    letterSpacing: "0.04em",
                    userSelect: "none",
                    dominantBaseline: "central",
                    alignmentBaseline: "central",
                  }}
                >
                  <textPath
                    href="#hero-marquee-curve"
                    xlinkHref="#hero-marquee-curve"
                    className="hero-marquee-tp"
                    startOffset="0"
                    dominantBaseline="central"
                    alignmentBaseline="central"
                  >
                    <tspan className="marquee-unit" dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                    <tspan dominantBaseline="central" alignmentBaseline="central">
                      BUILD, MARKET &amp; SCALE YOUR BUSINESS &nbsp;•&nbsp; CUSTOM ENTERPRISE SOFTWARE &nbsp;•&nbsp; SEO GROWTH ENGINES &nbsp;•&nbsp;
                    </tspan>
                  </textPath>
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
