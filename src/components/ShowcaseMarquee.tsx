"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Slide {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

const slides: Slide[] = [
  {
    type: "video",
    src: "/assets/6ab26381b5a759b6db4cec12_Shot_1_mp4.mp4",
    poster: "/assets/6ab26381b5a759b6db4cec12_Shot_1_poster.0000000.jpg",
    alt: "High-Performance Digital Architecture",
  },
  {
    type: "image",
    src: "/nexusczar/projects/project1_main.jpg",
    alt: "Mazuma India Platform",
  },
  {
    type: "image",
    src: "/assets/6ab263498b14a38a7a109afc_Shot_2.jpg",
    alt: "OREA Homes Cloud Infrastructure",
  },
  {
    type: "video",
    src: "/assets/6ab263f29cc7204d5832b66d_Shot_3_mp4.mp4",
    poster: "/assets/6ab263f29cc7204d5832b66d_Shot_3_poster.0000000.jpg",
    alt: "Advika Creations Architecture",
  },
  {
    type: "image",
    src: "/nexusczar/projects/project3_main.jpg",
    alt: "Mazuma Realty Space Tours",
  },
  {
    type: "image",
    src: "/assets/6ab2633da8fa39ec5216880b_Shot_4.jpg",
    alt: "HH Buildtech Civil ERP",
  },
  {
    type: "image",
    src: "/nexusczar/projects/project4_main.jpg",
    alt: "Advika Creations Commercial Design",
  },
  {
    type: "image",
    src: "/assets/6ab2633d3e5b6a35a15d74d7_Shot_5.jpg",
    alt: "Dr. Harish Pal Practice Engine",
  },
  {
    type: "image",
    src: "/nexusczar/projects/project6_main.jpg",
    alt: "Dr. Harish Pal Medical Platform",
  },
  {
    type: "image",
    src: "/assets/6ab2634dc8995221637e120c_Shot_6.png",
    alt: "NexusCzar Studio Production",
  },
  {
    type: "image",
    src: "/nexusczar/officeHero.jpeg",
    alt: "NexusCzar Studio Headquarters",
  },
];

export default function ShowcaseMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth / 2;

      gsap.to(track, {
        x: -totalWidth,
        duration: 35,
        ease: "none",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-marquee-speed="3" className="section-slider-showcase">
      <div ref={containerRef} className="section-slider-wrapper">
        <div ref={trackRef} className="showcase-slider">
          {[...slides, ...slides].map((slide, idx) => (
            <div key={idx} className="showcase-slide">
              {slide.type === "video" ? (
                <div className="showcase-slide-img w-background-video w-background-video-atom">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={slide.poster}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  >
                    <source src={slide.src} type="video/mp4" />
                  </video>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.src}
                  alt={slide.alt || "Showcase slide"}
                  loading="lazy"
                  className="showcase-slide-img"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
