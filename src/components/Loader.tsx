"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { NexusCzarLoaderSvg } from "./NexusCzarLoaderSvg";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    // Universal notifier so Hero and page scripts sync with loader completion
    function notifyLoaderComplete() {
      document.body.setAttribute("data-nexusczar-loader-done", "true");
      document.body.setAttribute("data-two26-loader-done", "true");
      if (typeof window !== "undefined") {
        (window as unknown as { __two26LoaderDone?: boolean; __nexusczarLoaderDone?: boolean }).__two26LoaderDone = true;
        (window as unknown as { __two26LoaderDone?: boolean; __nexusczarLoaderDone?: boolean }).__nexusczarLoaderDone = true;
        window.dispatchEvent(new CustomEvent("two26:loaderComplete"));
        document.dispatchEvent(new CustomEvent("two26:loaderComplete"));
        window.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
        document.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
      }
      if (onComplete) onComplete();
    }

    // Accessibility check: Skip animation immediately if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      loader.style.display = "none";
      loader.style.pointerEvents = "none";
      notifyLoaderComplete();
      return;
    }

    // Lock scrolling during loader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1. Elements Selection
    const bgStrokeContainer = loader.querySelector(".svg-bg-stroke");
    const bgSvg = bgStrokeContainer ? bgStrokeContainer.querySelector("svg") : null;
    const bgPaths = bgSvg ? Array.from(bgSvg.querySelectorAll("path")) : [];

    // Path 0: Primary Teal (#2f849c) | Path 1: Light Ice Tint (#f0f7f9)
    const pathOrangeBg = bgPaths[0] as SVGPathElement | undefined;
    const pathPinkBg = bgPaths[1] as SVGPathElement | undefined;

    const logoContainer = loader.querySelector(".loader-inner, .logo-animation") as HTMLElement | null;
    const logoSvg = loader.querySelector(
      ".two26-logo-svg, .nexus-logo-svg, svg[data-logo='two26']"
    ) as SVGSVGElement | null;

    if (!logoSvg) {
      document.body.style.overflow = originalOverflow;
      loader.style.display = "none";
      notifyLoaderComplete();
      return;
    }

    // 2. Initial Setup for Background Strokes
    const BG_STROKE_WIDTH_START = 3000;
    const BG_STROKE_WIDTH_END = 1000;

    let len0 = 3000;
    if (pathOrangeBg) {
      pathOrangeBg.style.strokeLinecap = "round";
      pathOrangeBg.setAttribute("stroke-linecap", "round");
      len0 = pathOrangeBg.getTotalLength ? pathOrangeBg.getTotalLength() : 3000;
      pathOrangeBg.style.strokeDasharray = `${len0}`;
      pathOrangeBg.style.strokeDashoffset = "0";
      gsap.set(pathOrangeBg, {
        x: 0,
        y: 0,
        strokeWidth: BG_STROKE_WIDTH_START,
      });
    }

    let len1 = 3000;
    if (pathPinkBg) {
      pathPinkBg.style.strokeLinecap = "round";
      pathPinkBg.setAttribute("stroke-linecap", "round");
      len1 = pathPinkBg.getTotalLength ? pathPinkBg.getTotalLength() : 3000;
      pathPinkBg.style.strokeDasharray = `${len1}`;
      pathPinkBg.style.strokeDashoffset = "0";
      gsap.set(pathPinkBg, {
        x: 0,
        y: 0,
        strokeWidth: BG_STROKE_WIDTH_START,
      });
    }

    // 3. Initial Setup for NexusCzar Logo SVG Paths
    const ribbon = logoSvg.querySelector(".nexus-ribbon-path") as SVGPathElement | null;
    const emblem = logoSvg.querySelector(".nexus-emblem-path") as SVGPathElement | null;
    const letters = Array.from(logoSvg.querySelectorAll(".nexus-letter-path")) as SVGPathElement[];
    const subtext = logoSvg.querySelector(".nexus-subtext-path") as SVGPathElement | null;

    let lenRibbon = 2500;
    if (ribbon) {
      ribbon.style.strokeLinecap = "round";
      ribbon.style.strokeLinejoin = "round";
      lenRibbon = ribbon.getTotalLength ? ribbon.getTotalLength() : 2500;
      ribbon.style.strokeDasharray = `${lenRibbon * 0.05} ${lenRibbon}`;
      ribbon.style.strokeDashoffset = `${lenRibbon}`;
      gsap.set(ribbon, { strokeWidth: 0 });
    }

    if (emblem) {
      emblem.setAttribute("stroke", "#2f849c");
      emblem.setAttribute("stroke-linejoin", "round");
      try {
        const bbox = emblem.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        gsap.set(emblem, {
          scale: 0,
          rotation: -18,
          strokeWidth: 6,
          svgOrigin: `${cx} ${cy}`,
        });
      } catch {
        gsap.set(emblem, { scale: 0, rotation: -18, strokeWidth: 6 });
      }
    }

    letters.forEach((letter) => {
      if (!letter) return;
      const randomAngle = gsap.utils.random(-25, 25);
      letter.setAttribute("stroke", "#2f849c");
      letter.setAttribute("stroke-linejoin", "round");
      try {
        const bbox = letter.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;
        gsap.set(letter, {
          scale: 0,
          rotation: randomAngle,
          strokeWidth: 6,
          svgOrigin: `${cx} ${cy}`,
        });
      } catch {
        gsap.set(letter, { scale: 0, rotation: randomAngle, strokeWidth: 6 });
      }
    });

    if (subtext) {
      gsap.set(subtext, { opacity: 0, y: 15 });
    }

    // Reveal SVG now that all initial zeroed states are applied (prevents FOUC)
    logoSvg.style.visibility = "visible";

    // 4. Build the Kinetic Logo Reveal Timeline (1.25x speed / 25% faster)
    const logoTimeline = gsap.timeline({ delay: 0.2 }).timeScale(1.25);

    // Step A: Ribbon stroke growth and travel across the screen
    if (ribbon) {
      logoTimeline
        .to(ribbon, { strokeWidth: 19, duration: 0.9, ease: "power2.in" }, 0)
        .to(ribbon, { strokeDashoffset: lenRibbon * 0.45, duration: 1.7, ease: "power1.inOut" }, 0);
    }

    // Step B: NexusCzar Emblem pops in with energetic elastic spring as ribbon sweeps past
    if (emblem) {
      logoTimeline.to(
        emblem,
        {
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(2.5)",
        },
        0.8
      );
      logoTimeline.to(
        emblem,
        {
          strokeWidth: 0,
          duration: 0.5,
          ease: "power1.in",
        },
        0.85
      );
    }

    // Step C: Ribbon sweeps out to right and strokeWidth drops
    if (ribbon) {
      logoTimeline
        .to(
          ribbon,
          {
            strokeDashoffset: -lenRibbon * 0.05,
            duration: 1.0,
            ease: "power2.inOut",
          },
          "-=0.4"
        )
        .to(
          ribbon,
          {
            strokeWidth: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          "-=0.55"
        );
    }

    // Step D: Staggered bouncy pop-in for brand letters: N, E, X, U, S, C, Z, A, R
    logoTimeline.to(
      letters,
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "back.out(3)",
      },
      "-=0.3"
    );

    logoTimeline.to(
      letters,
      {
        strokeWidth: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power1.in",
      },
      "<"
    );

    // Step E: Subtext smooth fade up
    if (subtext) {
      logoTimeline.to(
        subtext,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    // 5. Exit Sequence (Light Wipe -> Teal Wipe -> Page Reveal)
    function runLoaderExitSequence() {
      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          loader!.style.display = "none";
          loader!.style.pointerEvents = "none";
          notifyLoaderComplete();
        },
      });

      // Small hold so user enjoys the complete logo for a moment
      exitTl.to({}, { duration: 0.2 });

      // Phase 1: Light Ice Stroke (#f0f7f9, Path 1) slithers down & right out of viewport
      const SWEEP_DURATION = 0.65;

      if (pathPinkBg) {
        exitTl.to(
          pathPinkBg,
          {
            strokeDashoffset: -len1 * 0.5,
            strokeWidth: BG_STROKE_WIDTH_END,
            y: 1800,
            x: 900,
            duration: SWEEP_DURATION,
            ease: "power2.inOut",
          },
          "pinkStart"
        );
      }

      // Logo fades seamlessly into the Teal layer as Light sweeps past 20%
      if (logoContainer || logoSvg) {
        exitTl.to(
          logoContainer || logoSvg,
          {
            opacity: 0,
            duration: 0.15,
            ease: "power1.out",
          },
          "pinkStart+=" + SWEEP_DURATION * 0.2
        );
      }

      // Phase 2: Teal Stroke (#2f849c, Path 0) slithers down & left out of viewport (starts at 25% of light)
      if (pathOrangeBg) {
        exitTl.to(
          pathOrangeBg,
          {
            strokeDashoffset: -len0 * 0.5,
            strokeWidth: BG_STROKE_WIDTH_END,
            y: 1800,
            x: -900,
            duration: SWEEP_DURATION,
            ease: "power2.inOut",
          },
          "pinkStart+=" + SWEEP_DURATION * 0.25
        );
      }
    }

    logoTimeline.eventCallback("onComplete", () => {
      runLoaderExitSequence();
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      logoTimeline.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="loader"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "all",
      }}
    >
      {/* Background SVG layer covering entire viewport */}
      <div
        className="svg-bg-stroke"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1500 1093"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {/* Path 0: Teal Primary */}
          <path
            d="M1500 0C687.437 32.0206 767.477 1069.1 4.43459e-05 1093"
            stroke="#2f849c"
            strokeWidth="3000"
            strokeLinecap="round"
          />
          {/* Path 1: Ice Cyan Light */}
          <path
            d="M0 0C812.563 32.0206 732.523 1069.1 1500 1093"
            stroke="#f0f7f9"
            strokeWidth="3000"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Centered logo content */}
      <div
        className="loader-inner"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
          padding: "2rem",
          pointerEvents: "none",
        }}
      >
        <div
          className="logo-animation"
          style={{
            width: "100%",
            maxWidth: "1100px",
            height: "auto",
            display: "block",
          }}
        >
          <NexusCzarLoaderSvg />
        </div>
      </div>
    </div>
  );
}
