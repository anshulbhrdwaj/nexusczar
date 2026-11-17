"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CtaArrowSvg } from "./svgs";

const projectsData = [
  {
    id: 1,
    name: "MAZUMA INDIA",
    category: "FinTech & Corporate Tax Engine",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/mazumaindia.png",
    mainImg: "/nexusczar/projects/project1_main.jpg",
    hoverImg: "/nexusczar/projects/project1_hover.jpg",
    svgColor: "#172957",
  },
  {
    id: 2,
    name: "OREA HOMES",
    category: "Verified Real Estate Marketplace",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/oreahomes.png",
    mainImg: "/nexusczar/projects/project2_main.jpg",
    hoverImg: "/nexusczar/projects/project2_hover.jpg",
    svgColor: "#2f849c",
  },
  {
    id: 3,
    name: "MAZUMA REALTY",
    category: "Luxury Property & Space Tours",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/mazumarealty.png",
    mainImg: "/nexusczar/projects/project3_main.jpg",
    hoverImg: "/nexusczar/projects/project3_hover.jpg",
    svgColor: "#36a4bf",
  },
  {
    id: 4,
    name: "ADVIKA CREATIONS",
    category: "Turnkey Commercial Architecture",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/advikacreations.png",
    mainImg: "/nexusczar/projects/project4_main.jpg",
    hoverImg: "/nexusczar/projects/project4_hover.jpg",
    svgColor: "#36a4bf",
  },
  {
    id: 5,
    name: "HH BUILDTECH",
    category: "Civil Engineering Infrastructure ERP",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/hhbpl.png",
    mainImg: "/nexusczar/projects/project5_main.jpg",
    hoverImg: "/nexusczar/projects/project5_hover.jpg",
    svgColor: "#172957",
  },
  {
    id: 6,
    name: "DR. HARISH PAL",
    category: "Specialist Surgical Care (Dubai & UAE)",
    link: "https://www.nexusczar.com/projects",
    logo: "/nexusczar/harishpal.png",
    mainImg: "/nexusczar/projects/project6_main.jpg",
    hoverImg: "/nexusczar/projects/project6_hover.jpg",
    svgColor: "#2f849c",
  },
];

const MASK_PATH_D =
  "M25.007 729.507C25.007 729.507 136.507 1065.7 290.007 969.007C506.711 832.495 -164.765 175.16 89.5069 44.5066C315.057 -71.3883 462.507 559.507 615.507 515.007C768.507 470.507 615.507 25.0068 615.507 25.0068";
const TARGET_STROKE_WIDTH = 1200;

export default function Projects({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);

  // 1. Magnetic Selected Works heading
  useEffect(() => {
    const hw = headingWrapperRef.current;
    if (!hw) return;

    const tealHeading = hw.querySelector(".section-heading.teal, .section-heading.orange") as HTMLElement | null;
    if (!tealHeading) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hw.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(tealHeading, {
        x: relX * 24,
        y: relY * 20,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(tealHeading, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });
    };

    hw.addEventListener("mousemove", handleMouseMove);
    hw.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hw.removeEventListener("mousemove", handleMouseMove);
      hw.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 2. Project Card Clip-Mask Scroll Reveal + Paintbrush Hover Masks
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll(".project-card")) as HTMLElement[];

    cards.forEach((card, index) => {
      // Wrap card in clip-mask container for 3D scroll reveal
      let maskWrapper = card.parentElement;
      if (!maskWrapper?.classList.contains("project-card-clip-mask")) {
        const wrapper = document.createElement("div");
        wrapper.className = "project-card-clip-mask";
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.overflow = "hidden";
        wrapper.style.perspective = "1200px";
        wrapper.style.borderRadius = "36px";
        wrapper.style.clipPath = "inset(42.5% 42.5% 42.5% 42.5%)";
        wrapper.style.willChange = "clip-path, border-radius";

        card.parentNode?.insertBefore(wrapper, card);
        wrapper.appendChild(card);
        maskWrapper = wrapper;
      }

      // Initial 3D tilt
      const horizontalTilt = index % 2 === 0 ? -16 : 16;
      const zTilt = index % 2 === 0 ? -4 : 4;
      gsap.set(card, {
        scale: 1.45,
        rotationX: 25,
        rotationY: horizontalTilt,
        rotation: zTilt,
        transformPerspective: 800,
        transformOrigin: "center center",
        willChange: "transform",
      });

      // ScrollTrigger Reveal
      ScrollTrigger.create({
        trigger: maskWrapper,
        start: "top 90%",
        end: "top 25%",
        once: true,
        onEnter: () => {
          gsap.to(maskWrapper!, {
            clipPath: "inset(0% 0% 0% 0%)",
            borderRadius: "0px",
            duration: 1.25,
            ease: "power3.out",
          });
          gsap.to(card, {
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            duration: 1.25,
            ease: "power3.out",
          });
        },
      });

      // Setup Paintbrush SVG Mask & Hover Timeline
      const imgWrapper = card.querySelector(".project-card-img-wrapper") as HTMLElement | null;
      if (!imgWrapper) return;

      const hoverImg = imgWrapper.querySelector(".project-img-hover") as HTMLImageElement | null;
      const svgContainer = imgWrapper.querySelector(".project-img-svg") as HTMLElement | null;
      const arrowTarget = card.querySelector(".projects-arrow svg") as SVGElement | null;

      let foregroundPath: SVGPathElement | null = null;
      if (svgContainer) {
        foregroundPath = svgContainer.querySelector("path");
        if (foregroundPath) {
          const len = foregroundPath.getTotalLength ? foregroundPath.getTotalLength() : 2500;
          foregroundPath.style.strokeDasharray = `${len}`;
          foregroundPath.style.strokeDashoffset = `${len}`;
          foregroundPath.style.strokeWidth = "0px";
          foregroundPath.style.strokeLinecap = "round";
          foregroundPath.style.strokeLinejoin = "round";
        }
      }

      let maskBrushPath: SVGPathElement | null = null;
      if (hoverImg) {
        const imgSrc = hoverImg.src || hoverImg.getAttribute("src") || "";
        hoverImg.style.display = "none";

        const maskId = `project-brush-mask-${index}`;
        const maskSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        maskSvg.setAttribute("class", "project-card-mask-overlay");
        maskSvg.setAttribute("viewBox", "0 0 709 1012");
        maskSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        maskSvg.style.position = "absolute";
        maskSvg.style.inset = "0";
        maskSvg.style.width = "100%";
        maskSvg.style.height = "100%";
        maskSvg.style.pointerEvents = "none";
        maskSvg.style.zIndex = "3";
        maskSvg.style.overflow = "visible";

        maskSvg.innerHTML = `
          <defs>
            <mask id="${maskId}" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1109" height="1412">
              <path class="mask-brush-path" d="${MASK_PATH_D}" stroke="#FFFFFF" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </mask>
          </defs>
          <image href="${imgSrc}" xlink:href="${imgSrc}" x="0" y="0" width="709" height="1012" preserveAspectRatio="xMidYMid slice" mask="url(#${maskId})" />
        `;

        imgWrapper.appendChild(maskSvg);

        maskBrushPath = maskSvg.querySelector(".mask-brush-path");
        if (maskBrushPath) {
          const mLen = maskBrushPath.getTotalLength ? maskBrushPath.getTotalLength() : 2500;
          maskBrushPath.style.strokeDasharray = `${mLen}`;
          maskBrushPath.style.strokeDashoffset = `${mLen}`;
          maskBrushPath.style.strokeWidth = "0px";
        }
      }

      if (arrowTarget) {
        gsap.set(arrowTarget, { transformOrigin: "center center", rotation: 0 });
      }

      // Hover Timeline
      const hoverTl = gsap.timeline({ paused: true, defaults: { ease: "power1.inOut" } });

      if (foregroundPath) {
        hoverTl.to(foregroundPath, { strokeDashoffset: 0, strokeWidth: TARGET_STROKE_WIDTH, duration: 0.95 }, 0);
      }
      if (maskBrushPath) {
        hoverTl.to(maskBrushPath, { strokeDashoffset: 0, strokeWidth: TARGET_STROKE_WIDTH, duration: 1.05 }, 0.35);
      }
      if (arrowTarget) {
        hoverTl
          .to(arrowTarget, { rotation: -45, duration: 0.28, ease: "power2.out" }, 0)
          .to(arrowTarget, { rotation: 0, duration: 0.65, ease: "elastic.out(1.15, 0.35)" }, 0.28);
      }

      card.addEventListener("mouseenter", () => hoverTl.timeScale(1).play());
      card.addEventListener("mouseleave", () => hoverTl.timeScale(1.3).reverse());
    });

    // 3. CTA Button Magnetic & Arrow Loop on Projects End
    const ctaBtn = section.querySelector(".project-btn") as HTMLElement | null;
    if (ctaBtn) {
      const text = ctaBtn.querySelector(".cta-text");
      const arrow = ctaBtn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
      const fillHover = ctaBtn.querySelector(".cta-btn-fill-hover");
      let arrowLoop: gsap.core.Timeline | null = null;

      ctaBtn.addEventListener("mouseenter", () => {
        if (fillHover) gsap.to(fillHover, { scale: 10, duration: 0.55, ease: "power2.out" });
        if (arrow) {
          gsap.set(arrow, { transformOrigin: "center center" });
          if (arrowLoop) arrowLoop.kill();
          arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
          arrowLoop
            .to(arrow, { rotation: -25, duration: 0.22, ease: "power2.out" })
            .to(arrow, { rotation: 0, duration: 0.4, ease: "back.out(2.5)" });
        }
      });

      ctaBtn.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = ctaBtn.getBoundingClientRect();
        const currentX = (gsap.getProperty(ctaBtn, "x") as number) || 0;
        const currentY = (gsap.getProperty(ctaBtn, "y") as number) || 0;

        const originCenterX = rect.left - currentX + rect.width / 2;
        const originCenterY = rect.top - currentY + rect.height / 2;

        const deltaX = e.clientX - originCenterX;
        const deltaY = e.clientY - originCenterY;

        gsap.to(ctaBtn, { x: deltaX * 0.35, y: deltaY * 0.35, duration: 0.3, ease: "power2.out", overwrite: "auto" });

        const inners = [text, arrow].filter(Boolean);
        if (inners.length) {
          gsap.to(inners, { x: deltaX * 0.15, y: deltaY * 0.15, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
      });

      ctaBtn.addEventListener("mouseleave", () => {
        if (arrowLoop) {
          arrowLoop.kill();
          arrowLoop = null;
        }
        if (arrow) gsap.to(arrow, { rotation: 0, duration: 0.35, ease: "power2.out" });
        gsap.to(ctaBtn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.4)" });

        const inners = [text, arrow].filter(Boolean);
        if (inners.length) {
          gsap.to(inners, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.4)" });
        }
        if (fillHover) gsap.to(fillHover, { scale: 1, duration: 0.45, ease: "power2.out" });
      });
    }

    // 4. Projects End Pills entrance
    const endPara = section.querySelector(".projects-end-para");
    const endPills = Array.from(section.querySelectorAll(".projects-pill-first, .projects-pill-second, .projects-pill-fourth"));
    if (endPara && endPills.length) {
      ScrollTrigger.create({
        trigger: endPara,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(endPara, { opacity: 1, duration: 0.8, ease: "power2.out" });
          gsap.fromTo(
            endPills,
            { scale: 0.4, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "back.out(2.2)" }
          );
        },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="section-projects">
      <div className={`section-projects-wrapper ${hideHeader ? "padding" : ""}`}>
        {/* Section Header with Magnetic Title */}
        <div className={`section-projects-header ${hideHeader ? "none" : ""}`}>
          <div className="section-about-text">Featured Projects</div>
          <div
            ref={headingWrapperRef}
            className="section-heading-wrapper"
            style={{ position: "relative", cursor: "default" }}
          >
            <h2 className="section-heading less-max-w" style={{ position: "relative", zIndex: 2 }}>
              Selected Works
            </h2>
            <h2
              className="section-heading less-max-w teal"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                color: "#2f849c",
                pointerEvents: "none",
              }}
            >
              Selected Works
            </h2>
          </div>
        </div>

        {/* 6 Vertical Project Cards */}
        <div className="projects-vertical-wrapper">
          <div className="projects-list-wrapper w-dyn-list">
            <div role="list" className="projects-list w-dyn-items">
              {projectsData.map((project) => (
                <div key={project.id} role="listitem" className="project-item w-dyn-item">
                  <Link href={project.link} className="project-card w-inline-block">
                    <div className="project-card-img-wrapper">
                      {/* Hover image (wrapped into SVG brush mask on client mount) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.hoverImg}
                        alt=""
                        className="project-img-hover"
                        loading="lazy"
                      />

                      {/* Foreground Brush SVG */}
                      <div style={{ color: project.svgColor }} className="project-img-svg w-embed">
                        <svg width="100%" height="100%" viewBox="0 0 728 1020" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M25.002 153.857C25.002 153.857 151.002 -28.0122 236.002 40.3572C351.002 132.857 -86.2292 534.598 62.5019 617.857C173.257 679.857 466.502 -70.1428 646.002 40.3572C889.446 190.221 -74.3269 862.107 151.002 983.857C337.002 1084.36 526.502 453.148 665.002 551.357C803.502 649.566 415.502 926.187 501.002 983.857C586.502 1041.53 703.002 794.357 703.002 794.357"
                            stroke="currentColor"
                            strokeWidth="50"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Base Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.mainImg}
                        alt=""
                        className="project-img"
                        loading="lazy"
                      />
                    </div>

                    <div className="project-detail">
                      <div className="project-logo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.logo}
                          alt=""
                          className="project-logo-img"
                          loading="lazy"
                        />
                      </div>
                      <div className="project-detail-header">
                        <div className="project-detail-btm">
                          <div className="project-name-text">{project.name}</div>
                        </div>
                        <div className="project-detail-text">{project.category}</div>
                      </div>
                      <div className="projects-arrow">
                        <div className="code-embed-7 w-embed">
                          <svg width="100%" height="auto" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1.17273 17.9405L18.6533 2.29983M5.84177 1.17288L18.6533 2.29983L18.3543 15.1573"
                              stroke="currentColor"
                              strokeWidth="2.34564"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Projects End Callout */}
          <div className="projects-end">
            <div className="projects-end-inner-wrapper">
              <p className="projects-end-para">
                WE COULD KEEP GOING, BUT THERE’S A WHOLE PORTFOLIO FOR THAT.
              </p>
              <div className="projects-pill-first">
                <div className="hero-pill-text">Built for scale</div>
              </div>
              <div className="projects-pill-second">
                <div className="hero-pill-text">Enterprise grade</div>
              </div>
              <div className="projects-pill-fourth">
                <div className="hero-pill-text">Zero tech debt</div>
              </div>

              <Link href="https://www.nexusczar.com/projects" target="_blank" rel="noopener noreferrer" className="project-btn w-inline-block">
                <div className="cta-text">Explore All Projects</div>
                <div className="cta-btn-arrow">
                  <div className="svg-arrow-cta w-embed">
                    <CtaArrowSvg />
                  </div>
                </div>
                <div className="cta-btn-fill-hover" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
