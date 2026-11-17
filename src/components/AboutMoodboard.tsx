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

interface SliderState {
  wrapper: HTMLElement;
  track: HTMLElement;
  initialSlides: HTMLElement[];
  baseDirection: number;
  setWidth: number;
  x: number;
  hoverFactor: number;
  measureSetWidth: () => number;
}

export default function AboutMoodboard() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sliderWrappers = Array.from(
      section.querySelectorAll(".moodboard-slider-wrapper")
    ) as HTMLElement[];
    if (!sliderWrappers.length) return;

    const BASE_SPEED = 1.35;
    let currentScrollMultiplier = 1;
    let targetScrollMultiplier = 1;
    let velocityBoost = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;
      if (diff > 0.5) {
        targetScrollMultiplier = 1;
      } else if (diff < -0.5) {
        targetScrollMultiplier = -1;
      }
      velocityBoost = Math.min(Math.abs(diff) * 0.15, 8);
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const slidersData: SliderState[] = [];

    sliderWrappers.forEach((wrapper, index) => {
      const track = wrapper.querySelector(".moodboard-slider") as HTMLElement | null;
      if (!track) return;

      const initialSlides = Array.from(
        track.querySelectorAll(".moodboard-slide:not(.is-marquee-clone)")
      ) as HTMLElement[];
      if (!initialSlides.length) return;

      // Top slider (index 0) moves LEFT (-1), Bottom slider (index 1) moves RIGHT (+1)
      const baseDirection = index % 2 === 0 ? -1 : 1;

      // Remove any previous clones
      track.querySelectorAll(".is-marquee-clone").forEach((c) => c.remove());

      // Clone at least one set to measure true distance
      initialSlides.forEach((slide) => {
        const clone = slide.cloneNode(true) as HTMLElement;
        clone.classList.add("is-marquee-clone");
        track.appendChild(clone);
      });

      const measureSetWidth = () => {
        const firstClone = track.querySelector(".is-marquee-clone") as HTMLElement | null;
        if (firstClone && initialSlides[0]) {
          const origLeft = initialSlides[0].getBoundingClientRect().left;
          const cloneLeft = firstClone.getBoundingClientRect().left;
          const exactDist = Math.abs(cloneLeft - origLeft);
          if (exactDist > 0) return exactDist;
        }

        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap || style.columnGap || "0") || 0;
        let sum = 0;
        initialSlides.forEach((s) => {
          sum += (s.offsetWidth || s.getBoundingClientRect().width) + gap;
        });
        return sum || 1200;
      };

      let setWidth = measureSetWidth();

      // Duplicate sets until track >= 3.5x viewport width
      const minTrackWidth = window.innerWidth * 3.5 + (setWidth || 1000);
      let currentTrackWidth = setWidth * 2;

      while (currentTrackWidth < minTrackWidth && setWidth > 0) {
        initialSlides.forEach((slide) => {
          const clone = slide.cloneNode(true) as HTMLElement;
          clone.classList.add("is-marquee-clone");
          track.appendChild(clone);
        });
        currentTrackWidth += setWidth;
      }

      const sliderState: SliderState = {
        wrapper,
        track,
        initialSlides,
        baseDirection,
        setWidth,
        x: 0,
        hoverFactor: 1,
        measureSetWidth,
      };

      // Desktop hover slow-down
      const isTouch = matchMedia("(pointer: coarse)").matches || window.innerWidth < 992;
      if (!isTouch) {
        wrapper.addEventListener("mouseenter", () => {
          gsap.to(sliderState, {
            hoverFactor: 0,
            duration: 0.65,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        wrapper.addEventListener("mouseleave", () => {
          gsap.to(sliderState, {
            hoverFactor: 1,
            duration: 0.65,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }

      slidersData.push(sliderState);
    });

    // Continuous tick loop
    const tick = () => {
      currentScrollMultiplier +=
        (targetScrollMultiplier - currentScrollMultiplier) * 0.06;
      velocityBoost *= 0.92;

      slidersData.forEach((item) => {
        if (item.setWidth <= 0) return;

        const effectiveDir = item.baseDirection * currentScrollMultiplier;
        const currentSpeed =
          (BASE_SPEED + velocityBoost) * effectiveDir * item.hoverFactor;

        item.x += currentSpeed;

        while (item.x <= -item.setWidth) {
          item.x += item.setWidth;
        }
        while (item.x >= 0) {
          item.x -= item.setWidth;
        }

        gsap.set(item.track, {
          x: item.x,
          force3D: true,
        });
      });
    };

    gsap.ticker.add(tick);

    const handleResize = () => {
      slidersData.forEach((item) => {
        const newWidth = item.measureSetWidth();
        if (newWidth > 0) item.setWidth = newWidth;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
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
          {/* Row 1 Slider */}
          <div className="moodboard-slider-wrapper">
            <div className="moodboard-slider">
              {row1Images.map((src, i) => (
                <div key={i} className="moodboard-slide">
                  <Image
                    src={src}
                    alt={`Culture & Craft ${i + 1}`}
                    width={480}
                    height={360}
                    className="moodboard-img"
                    sizes="(max-width: 768px) 80vw, 480px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 Slider */}
          <div className="moodboard-slider-wrapper">
            <div className="moodboard-slider">
              {row2Images.map((src, i) => (
                <div key={i} className="moodboard-slide">
                  <Image
                    src={src}
                    alt={`Culture & Craft ${i + 6}`}
                    width={480}
                    height={360}
                    className="moodboard-img"
                    sizes="(max-width: 768px) 80vw, 480px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
