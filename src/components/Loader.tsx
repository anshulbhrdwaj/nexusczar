"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { NexusCzarLoaderSvg } from "./NexusCzarLoaderSvg";

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    // Accessibility check: Skip animation immediately if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      loader.style.display = "none";
      loader.style.pointerEvents = "none";
      document.body.setAttribute("data-nexusczar-loader-done", "true");
      if (typeof window !== "undefined") {
        (window as unknown as { __nexusczarLoaderDone?: boolean }).__nexusczarLoaderDone = true;
        window.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
        document.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
      }
      if (onComplete) onComplete();
      return;
    }

    // Lock scrolling during loader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1. Elements Selection
    const bgSvg = loader.querySelector(".svg-bg-stroke svg");
    const bgPaths = bgSvg ? Array.from(bgSvg.querySelectorAll("path")) : [];

    // Path 0: Primary Teal (#2f849c) | Path 1: Light Tint (#d8eef3)
    const pathTealBg = bgPaths[0] as SVGPathElement | undefined;
    const pathIceBg = bgPaths[1] as SVGPathElement | undefined;

    const logoContainer = loader.querySelector(".loader-inner, .logo-animation") as HTMLElement | null;
    const logoSvg = loader.querySelector(".nexus-logo-svg") as SVGSVGElement | null;

    if (!logoSvg) {
      document.body.style.overflow = originalOverflow;
      loader.style.display = "none";
      return;
    }

    // 2. Initial Setup for Background Strokes
    const BG_STROKE_WIDTH_START = 3000;
    const BG_STROKE_WIDTH_END = 1000;

    if (pathTealBg) {
      pathTealBg.style.strokeLinecap = "round";
      pathTealBg.setAttribute("stroke-linecap", "round");
      const len0 = pathTealBg.getTotalLength ? pathTealBg.getTotalLength() : 3000;
      pathTealBg.style.strokeDasharray = `${len0}`;
      pathTealBg.style.strokeDashoffset = "0";
      gsap.set(pathTealBg, {
        x: 0,
        y: 0,
        strokeWidth: BG_STROKE_WIDTH_START,
      });
    }

    if (pathIceBg) {
      pathIceBg.style.strokeLinecap = "round";
      pathIceBg.setAttribute("stroke-linecap", "round");
      const len1 = pathIceBg.getTotalLength ? pathIceBg.getTotalLength() : 3000;
      pathIceBg.style.strokeDasharray = `${len1}`;
      pathIceBg.style.strokeDashoffset = "0";
      gsap.set(pathIceBg, {
        x: 0,
        y: 0,
        strokeWidth: BG_STROKE_WIDTH_START,
      });
    }

    // 3. Initial Setup for NexusCzar Logo Elements
    const ribbon = logoSvg.querySelector(".nexus-ribbon-path") as SVGPathElement | null;
    const emblem = logoSvg.querySelector(".nexus-emblem-path") as SVGPathElement | null;
    const letters = Array.from(logoSvg.querySelectorAll(".nexus-letter-path")) as SVGPathElement[];
    const subtext = logoSvg.querySelector(".nexus-subtext-path") as SVGPathElement | null;

    // Ribbon setup
    if (ribbon) {
      ribbon.style.strokeLinecap = "round";
      ribbon.style.strokeLinejoin = "round";
      const len = ribbon.getTotalLength ? ribbon.getTotalLength() : 2000;
      ribbon.style.strokeDasharray = `${len * 0.05} ${len}`;
      ribbon.style.strokeDashoffset = `${len}`;
      gsap.set(ribbon, { strokeWidth: 0 });
    }

    // Emblem setup with GSAP svgOrigin
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
      } catch (e) {
        gsap.set(emblem, { scale: 0, rotation: -18 });
      }
    }

    // Letters setup with GSAP svgOrigin
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
      } catch (e) {
        gsap.set(letter, { scale: 0, rotation: randomAngle });
      }
    });

    // Subtext setup
    if (subtext) {
      gsap.set(subtext, { opacity: 0, y: 15 });
    }

    // Reveal SVG now that initial zeroed states are applied
    logoSvg.style.visibility = "visible";

    // 4. Build the Kinetic Logo Reveal Timeline (1.25x speed / 25% faster)
    const logoTimeline = gsap.timeline({ delay: 0.2 }).timeScale(1.25);

    // Step A: Ribbon stroke growth and travel across the logo
    if (ribbon) {
      const len = ribbon.getTotalLength ? ribbon.getTotalLength() : 2000;
      logoTimeline
        .to(ribbon, { strokeWidth: 19, duration: 0.9, ease: "power2.in" }, 0)
        .to(ribbon, { strokeDashoffset: len * 0.45, duration: 1.7, ease: "power1.inOut" }, 0);
    }

    // Step B: Emblem pops in energetically as ribbon sweeps past
    if (emblem) {
      logoTimeline.to(
        emblem,
        {
          scale: 1,
          rotation: 0,
          duration: 0.65,
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

    // Step C: Ribbon sweeps out to right and strokeWidth thins out
    if (ribbon) {
      const len = ribbon.getTotalLength ? ribbon.getTotalLength() : 2000;
      logoTimeline
        .to(ribbon, { strokeDashoffset: -len * 0.05, duration: 1.0, ease: "power2.inOut" }, "-=0.4")
        .to(ribbon, { strokeWidth: 0, duration: 0.5, ease: "power2.in" }, "-=0.55");
    }

    // Step D: Staggered bouncy pop-in for letters N, E, X, U, S, C, Z, A, R
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

    // 5. Exit Sequence (Ice Wipe -> Teal Wipe -> Page Reveal)
    function runLoaderExitSequence() {
      const exitTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          loader!.style.display = "none";
          loader!.style.pointerEvents = "none";
          document.body.setAttribute("data-nexusczar-loader-done", "true");
          if (typeof window !== "undefined") {
            (window as unknown as { __nexusczarLoaderDone: boolean }).__nexusczarLoaderDone = true;
            window.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
            document.dispatchEvent(new CustomEvent("nexusczar:loaderComplete"));
          }
          if (onComplete) onComplete();
        },
      });

      // Small hold so user enjoys the complete logo for a moment
      exitTl.to({}, { duration: 0.25 });

      // Phase 1: Light Ice Stroke (#d8eef3, Path 1) slithers down & right out of viewport
      const SWEEP_DURATION = 0.65;

      if (pathIceBg) {
        const len1 = pathIceBg.getTotalLength ? pathIceBg.getTotalLength() : 3000;
        exitTl.to(
          pathIceBg,
          {
            strokeDashoffset: -len1 * 0.5,
            strokeWidth: BG_STROKE_WIDTH_END,
            y: 1800,
            x: 900,
            duration: SWEEP_DURATION,
            ease: "power2.inOut",
          },
          "iceStart"
        );
      }

      // Logo fades seamlessly into the Teal layer as Ice sweeps past 20%
      if (logoContainer || logoSvg) {
        exitTl.to(
          logoContainer || logoSvg,
          {
            opacity: 0,
            duration: 0.15,
            ease: "power1.out",
          },
          "iceStart+=" + SWEEP_DURATION * 0.2
        );
      }

      // Phase 2: Teal Stroke (#2f849c, Path 0) slithers down & left out of viewport (starts at 25% into ice)
      if (pathTealBg) {
        const len0 = pathTealBg.getTotalLength ? pathTealBg.getTotalLength() : 3000;
        exitTl.to(
          pathTealBg,
          {
            strokeDashoffset: -len0 * 0.5,
            strokeWidth: BG_STROKE_WIDTH_END,
            y: 1800,
            x: -900,
            duration: SWEEP_DURATION,
            ease: "power2.inOut",
          },
          "iceStart+=" + SWEEP_DURATION * 0.25
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
            stroke="#d8eef3"
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
