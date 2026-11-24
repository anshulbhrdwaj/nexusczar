"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const row1Images = [
  "/nexusczar/moodboard/1a.jpg",
  "/nexusczar/moodboard/2a.jpg",
  "/nexusczar/moodboard/3a.jpg",
  "/nexusczar/moodboard/4a.jpg",
  "/nexusczar/moodboard/5a.jpg",
];

const row2Images = [
  "/nexusczar/moodboard/6a.jpg",
  "/nexusczar/moodboard/7a.jpg",
  "/nexusczar/moodboard/8a.jpg",
  "/nexusczar/moodboard/9a.jpg",
  "/nexusczar/moodboard/10a.jpg",
];

const imageRows = [row1Images, row2Images];
const BASE_SPEED = 1.35;
const FRAME_MS = 1000 / 60;
const REST_THRESHOLD = 0.01;

export default function AboutMoodboard() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = gsap.matchMedia(section);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const canHover = window.matchMedia("(hover: hover) and (min-width: 992px)");
      const rows = [...section.querySelectorAll<HTMLElement>(".moodboard-slider-wrapper")]
        .flatMap((wrapper, index) => {
          const track = wrapper.querySelector<HTMLElement>(".moodboard-slider");
          const group = track?.querySelector<HTMLElement>(".moodboard-slide-group");
          if (!track || !group) return [];

          return [{
            wrapper,
            track,
            group,
            width: group.getBoundingClientRect().width,
            direction: index === 0 ? -1 : 1,
            x: 0,
            hover: { factor: 1, changing: false },
            loop: null as Animation | null,
          }];
        });

      type Row = (typeof rows)[number];
      let currentDirection = 1;
      let targetDirection = 1;
      let velocityBoost = 0;
      let lastScrollY = window.scrollY;
      let visible = false;
      let ticking = false;

      const render = (row: Row) => {
        row.track.style.transform = `translate3d(${row.x}px, 0, 0)`;
      };

      // Steady motion runs on the compositor. GSAP only drives the short speed transitions.
      const startLoop = (row: Row) => {
        if (!visible || row.loop || !row.width || row.hover.factor === 0) return;
        const duration = row.width * FRAME_MS / BASE_SPEED;
        const reverse = row.direction * currentDirection > 0;
        const phase = Math.abs(row.x) / row.width;

        row.loop = row.track.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
          { duration, iterations: Infinity, direction: reverse ? "reverse" : "normal" },
        );
        row.loop.currentTime = (reverse ? 1 - phase : phase) * duration;
      };

      const stopLoop = (row: Row) => {
        if (!row.loop) return;
        const progress = row.loop.effect?.getComputedTiming().progress;
        if (typeof progress === "number") {
          row.x = -progress * row.width;
          render(row);
        }
        row.loop.cancel();
        row.loop = null;
      };

      const tick = (_time: number, delta: number) => {
        const frames = Math.min(delta, 50) / FRAME_MS;
        currentDirection += (targetDirection - currentDirection) * (1 - 0.94 ** frames);
        velocityBoost *= 0.92 ** frames;

        rows.forEach((row) => {
          if (!row.width || row.hover.factor === 0) return;
          const step = (BASE_SPEED + velocityBoost) * row.direction * currentDirection * row.hover.factor;
          row.x = gsap.utils.wrap(-row.width, 0, row.x + step * frames);
          render(row);
        });

        const settled = Math.abs(targetDirection - currentDirection) < REST_THRESHOLD && velocityBoost < REST_THRESHOLD;
        if (settled && rows.every((row) => !row.hover.changing)) {
          currentDirection = targetDirection;
          velocityBoost = 0;
          gsap.ticker.remove(tick);
          ticking = false;
          rows.forEach(startLoop);
        }
      };

      const wake = () => {
        if (!visible || ticking) return;
        rows.forEach(stopLoop);
        ticking = true;
        gsap.ticker.add(tick);
      };

      const handleScroll = () => {
        const currentY = window.scrollY;
        const distance = currentY - lastScrollY;
        if (Math.abs(distance) > 0.5) targetDirection = Math.sign(distance);
        velocityBoost = Math.min(Math.abs(distance) * 0.15, 8);
        lastScrollY = currentY;
        wake();
      };

      const removeHoverHandlers = rows.map((row) => {
        const setHover = gsap.quickTo(row.hover, "factor", {
          duration: 0.65,
          ease: "power2.out",
          onComplete: () => { row.hover.changing = false; },
        });
        const hoverTo = (factor: number) => {
          if (row.hover.factor === factor && !row.hover.changing) return;
          row.hover.changing = true;
          setHover(factor);
          wake();
        };
        const pause = () => { if (canHover.matches) hoverTo(0); };
        const resume = () => hoverTo(1);
        row.wrapper.addEventListener("pointerenter", pause);
        row.wrapper.addEventListener("pointerleave", resume);
        return () => {
          row.wrapper.removeEventListener("pointerenter", pause);
          row.wrapper.removeEventListener("pointerleave", resume);
          setHover.tween.kill();
        };
      });

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const row = rows.find(({ group }) => group === entry.target);
          const width = entry.borderBoxSize[0]?.inlineSize ?? entry.target.getBoundingClientRect().width;
          if (!row || row.width === width) return;

          stopLoop(row);
          row.x = row.width ? row.x * width / row.width : 0;
          row.width = width;
          render(row);
          if (!ticking) startLoop(row);
        });
      });
      rows.forEach((row) => resizeObserver.observe(row.group));

      const stop = () => {
        visible = false;
        gsap.ticker.remove(tick);
        ticking = false;
        window.removeEventListener("scroll", handleScroll);
        rows.forEach(stopLoop);
      };

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          lastScrollY = window.scrollY;
          currentDirection = targetDirection;
          velocityBoost = 0;
          if (rows.some((row) => row.hover.changing)) wake();
          else rows.forEach(startLoop);
          window.addEventListener("scroll", handleScroll, { passive: true });
        } else {
          stop();
        }
      });
      visibilityObserver.observe(section.querySelector(".div-block-3") ?? section);

      return () => {
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        stop();
        removeHoverHandlers.forEach((cleanup) => cleanup());
        rows.forEach((row) => { row.track.style.removeProperty("transform"); });
      };
    });

    return () => motion.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-moodboard">
      <div className="section-moodboard-wrapper">
        <div className="section-projects-header">
          <div className="section-about-text">OFF THE CLOCK</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">Behind the work</h2>
            <h2 className="section-heading orange">Behind the work</h2>
          </div>
        </div>

        <div className="div-block-3">
          {imageRows.map((images, rowIndex) => (
            <div key={images[0]} className="moodboard-slider-wrapper">
              <div className="moodboard-slider">
                {[false, true].map((duplicate) => (
                  <div
                    key={String(duplicate)}
                    className="moodboard-slide-group"
                    aria-hidden={duplicate || undefined}
                  >
                    {images.map((src, imageIndex) => (
                      <div key={src} className="moodboard-slide">
                        <Image
                          src={src}
                          alt={duplicate ? "" : `Culture & Craft ${rowIndex * images.length + imageIndex + 1}`}
                          width={480}
                          height={360}
                          className="moodboard-img"
                          sizes="(max-width: 479px) 50vw, (max-width: 767px) 35vw, (max-width: 991px) 31vw, (max-width: 1920px) 28vw, (max-width: 2666px) 534px, 20vw"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
