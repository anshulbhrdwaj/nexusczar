"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  const textContent =
    "We build digital engines that accelerate business growth. From high-performance web applications and custom software to SEO and performance media, we give forward-thinking companies the technical edge they need to lead.";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const aboutPara = paraRef.current;
    if (!section || !aboutPara) return;

    const pills = Array.from(section.querySelectorAll(".about-pill")) as HTMLElement[];
    const chars = Array.from(aboutPara.querySelectorAll(".about-char")) as HTMLElement[];

    gsap.set(section, {
      willChange: "transform",
      backfaceVisibility: "hidden",
      force3D: true,
    });

    gsap.set(chars, {
      color: "rgba(47, 132, 156, 0.45)",
      scale: 1,
      rotation: 0,
      display: "inline-block",
      transformOrigin: "center center",
      textShadow: "0px 0px 0px rgba(47,132,156,0)",
      willChange: "transform, color",
      backfaceVisibility: "hidden",
    });

    if (pills.length) {
      gsap.set(pills, {
        opacity: 0,
        scale: 0.6,
        y: 24,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      });
    }

    const getPinDistance = () => {
      const width = window.innerWidth;
      if (width < 480) return 1150;
      if (width < 992) return 1550;
      return 2200;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getPinDistance()}`,
        pin: section,
        pinSpacing: true,
        scrub: window.innerWidth < 992 ? 0.6 : 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
      },
    });

    const totalChars = chars.length;
    const letterAnimSpan = 85;

    chars.forEach((char, i) => {
      const startTime = (i / totalChars) * letterAnimSpan;

      // Stage 1: Scale 1.12, Random ±3-4 deg tilt, glowing #2f849c
      tl.to(
        char,
        {
          color: "#2f849c",
          scale: 1.12,
          rotation: () => gsap.utils.random(-4, 4),
          textShadow:
            "0.6px 0.6px 0 #2f849c, -0.6px -0.6px 0 #2f849c, 0.6px -0.6px 0 #2f849c, -0.6px 0.6px 0 #2f849c",
          duration: 3.5,
          ease: "power1.out",
        },
        startTime
      );

      // Stage 2: Settle to normal scale 1, 0 deg, clean deep navy #0b1326
      tl.to(
        char,
        {
          color: "#0b1326",
          scale: 1,
          rotation: 0,
          textShadow: "0px 0px 0px rgba(0,0,0,0)",
          duration: 3.5,
          ease: "power1.inOut",
        },
        startTime + 3.5
      );
    });

    // Milestone Pills Reveal
    if (pills[0]) {
      tl.to(pills[0], { opacity: 1, scale: 1, y: 0, duration: 6, ease: "back.out(2)" }, 35);
    }
    if (pills[1]) {
      tl.to(pills[1], { opacity: 1, scale: 1, y: 0, duration: 6, ease: "back.out(2)" }, 72);
    }
    if (pills[2]) {
      tl.to(pills[2], { opacity: 1, scale: 1, y: 0, duration: 6, ease: "back.out(2)" }, 96);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-about">
      <div className="section-about-wrapper">
        <div className="about-pinned">
          <div className="about-text">A BIT ABOUT US</div>

          <p ref={paraRef} className="about-para">
            {textContent.split(" ").map((word, wordIndex, wordsArr) => (
              <React.Fragment key={wordIndex}>
                <span className="about-word" style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {word.split("").map((c, charIndex) => (
                    <span key={charIndex} className="about-char" style={{ display: "inline-block" }}>
                      {c}
                    </span>
                  ))}
                </span>
                {wordIndex < wordsArr.length - 1 && " "}
              </React.Fragment>
            ))}
          </p>

          <div className="about-pill second">
            <div className="hero-pill-text">1000+ Businesses Scaled</div>
          </div>

          <div className="about-pill first">
            <div className="hero-pill-text">Greater Noida West • HQ</div>
          </div>

          <div className="about-pill third">
            <div className="hero-pill-text">Zero Technical Debt</div>
          </div>
        </div>
      </div>
    </section>
  );
}
