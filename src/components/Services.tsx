"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie, { type AnimationItem } from "lottie-web";

import brandStrategyJson from "../../public/assets/lottie/brand_strategy.json";
import brandIdentityJson from "../../public/assets/lottie/brand_identity.json";
import webDesignJson from "../../public/assets/lottie/web_design.json";
import illustrationJson from "../../public/assets/lottie/illustration.json";
import motionDesignJson from "../../public/assets/lottie/motion_design.json";
import packagingJson from "../../public/assets/lottie/packaging.json";
import artDirectionJson from "../../public/assets/lottie/art_direction.json";

interface ServiceItem {
  id: string;
  blockClass: string;
  text1: string;
  text2: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lottieData: any;
  para: string;
}

const servicesData: ServiceItem[] = [
  {
    id: "1",
    blockClass: "one",
    text1: "Website",
    text2: "Design & Dev",
    lottieData: webDesignJson,
    para: "Custom, responsive Next.js web applications engineered for speed, clean aesthetics, and sub-second Core Web Vitals.",
  },
  {
    id: "2",
    blockClass: "two",
    text1: "Enterprise",
    text2: "Software",
    lottieData: brandStrategyJson,
    para: "Scalable cloud software, internal workflow ERPs, and departmental automation built with React, Node, and Python.",
  },
  {
    id: "3",
    blockClass: "three",
    text1: "Mobile App",
    text2: "Development",
    lottieData: motionDesignJson,
    para: "Native and cross-platform iOS & Android mobile applications with fluid gestures, offline sync, and real-time APIs.",
  },
  {
    id: "4",
    blockClass: "four",
    text1: "UI/UX",
    text2: "Architecture",
    lottieData: illustrationJson,
    para: "User-centered design systems, clickable prototypes, and conversion flows designed to eliminate friction.",
  },
  {
    id: "5",
    blockClass: "five",
    text1: "SEO & Growth",
    text2: "Engines",
    lottieData: artDirectionJson,
    para: "Programmatic SEO architectures, semantic JSON-LD schema, and technical indexing pipelines that compound organic revenue.",
  },
  {
    id: "6",
    blockClass: "six",
    text1: "Performance",
    text2: "Marketing",
    lottieData: brandIdentityJson,
    para: "High-intent paid acquisition across Google Ads, Meta, and LinkedIn with end-to-end ROAS and conversion attribution.",
  },
  {
    id: "7",
    blockClass: "seven",
    text1: "Cyber Security",
    text2: "& DSPM",
    lottieData: packagingJson,
    para: "Data Security Posture Management, automated PII discovery, cloud compliance, and enterprise data risk audits.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // 1. Initialize Lottie animations
    const anims: AnimationItem[] = [];
    lottieRefs.current.forEach((container, i) => {
      if (!container) return;
      container.innerHTML = "";
      try {
        const anim = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: servicesData[i].lottieData,
        });
        anims.push(anim);
      } catch {
        // Fallback safely if container is not ready
      }
    });

    // 2. Setup Desktop & Mobile Dark SVG Paths
    const desktopDarkPath = section.querySelector(
      ".services-path-svg-dark svg path"
    ) as SVGPathElement | null;
    const mobileDarkPath = section.querySelector(
      ".service-path-mobile-dark svg path"
    ) as SVGPathElement | null;

    const allDarkPaths = [desktopDarkPath, mobileDarkPath].filter(Boolean) as SVGPathElement[];

    allDarkPaths.forEach((path) => {
      path.style.strokeLinecap = "round";
      path.style.strokeLinejoin = "round";
      const len = path.getTotalLength ? path.getTotalLength() : 6532;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    // 3. Setup Service Blocks initial state & measure natural em sizing
    const layers = Array.from(
      section.querySelectorAll(".services-layers .service-layer")
    ) as HTMLElement[];

    layers.forEach((layer) => {
      const block = layer.querySelector(".service-block") || layer;
      const centerSvg = block.querySelector(".service-svg") as HTMLElement | null;
      const paraWrapper = block.querySelector(
        ".service-block-para-wrapper"
      ) as HTMLElement | null;

      if (centerSvg) {
        // Read natural computed width (derived from 7.25em in Webflow styling)
        const computedW = parseFloat(getComputedStyle(centerSvg).width);
        const naturalWidth =
          computedW > 10 && computedW < 500
            ? computedW
            : parseFloat(getComputedStyle(block).fontSize) * 7.25 || 99;

        centerSvg.dataset.targetWidth = `${naturalWidth}`;
        centerSvg.style.transformOrigin = "center center";
        centerSvg.style.willChange = "transform, width, opacity";
        centerSvg.style.flexShrink = "0";

        // Strictly constrain inner img/svg to stay inside container bounds
        const innerMedia = centerSvg.querySelectorAll(
          "img, svg, .service-img, .lottie-animation"
        ) as NodeListOf<HTMLElement>;
        innerMedia.forEach((media) => {
          media.style.width = "100%";
          media.style.height = "100%";
          media.style.maxWidth = "100%";
          media.style.maxHeight = "100%";
          media.style.objectFit = "contain";
          media.style.display = "block";
        });

        gsap.set(centerSvg, {
          width: 0,
          scale: 0,
          opacity: 0,
          overflow: "hidden",
          margin: "0px",
        });
      }

      if (paraWrapper) {
        paraWrapper.style.transformOrigin = "center center";
        paraWrapper.style.willChange = "transform, opacity";
        gsap.set(paraWrapper, {
          scale: 0,
          rotation: 0,
          opacity: 0,
        });
      }
    });

    // 4. Create Master Scrubbed Timeline matching reference Script
    const bodyEl = section.querySelector(".section-services-body") || section;
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: bodyEl,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // Dark Path draws 0% to 100% across the full scrub duration
    allDarkPaths.forEach((path) => {
      masterTl.to(
        path,
        {
          strokeDashoffset: 0,
          ease: "none",
          duration: 1,
        },
        0
      );
    });

    // Proximity Expansions for each of the 7 Service Layers (Slower & High Bounce)
    const totalLayers = layers.length;
    layers.forEach((layer, index) => {
      const block = layer.querySelector(".service-block") || layer;
      const centerSvg = block.querySelector(".service-svg") as HTMLElement | null;
      const paraWrapper = block.querySelector(
        ".service-block-para-wrapper"
      ) as HTMLElement | null;

      // Map layer index evenly along the 0 -> 1 timeline progress
      const point = totalLayers > 1 ? index / (totalLayers - 1) : 0;
      const stepDuration = 0.14;
      const startTime = Math.max(0, point - 0.04);

      if (centerSvg) {
        masterTl.to(
          centerSvg,
          {
            width: () => parseFloat(centerSvg.dataset.targetWidth || "99"),
            scale: 1,
            opacity: 1,
            duration: stepDuration,
            ease: "back.out(3.5)",
          },
          startTime
        );
      }

      if (paraWrapper) {
        masterTl.to(
          paraWrapper,
          {
            scale: 1,
            rotation: -5,
            opacity: 1,
            duration: stepDuration,
            ease: "back.out(3.5)",
          },
          startTime + 0.02
        );
      }
    });

    // Refresh on image/font load & after initial layout
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    const handleLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", handleLoad);
      masterTl.kill();
      anims.forEach((anim) => {
        try {
          anim.destroy();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="services" className="section-services">
      {/* Authentic CSS embed for SVG overflow and Lottie rendering */}
      <div className="service-html w-embed w-script">
        <style>{`
          .services-path-svg-dark svg,
          .service-path-mobile-dark svg,
          .service-path-mobile svg,
          .services-path-mobile-dark svg,
          .services-path-svg svg {
            overflow: visible !important;
          }
          .service-svg .lottie-animation svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          .services-path {
            z-index: 1 !important;
            pointer-events: none !important;
          }
          .services-path-svg-dark {
            z-index: 2 !important;
          }
          .services-layers {
            z-index: 10 !important;
            pointer-events: none !important;
          }
          .service-block {
            position: relative !important;
            z-index: 10 !important;
            pointer-events: auto !important;
          }
          .service-text {
            color: var(--brand-black) !important;
            position: relative !important;
            z-index: 12 !important;
            white-space: nowrap !important;
          }
          .service-svg {
            position: relative !important;
            z-index: 15 !important;
            background: transparent !important;
            border-radius: 0 !important;
          }
          .service-block-para-wrapper {
            position: absolute !important;
            top: 100% !important;
            margin-top: 2.2em !important;
            bottom: auto !important;
            right: 0 !important;
            z-index: 20 !important;
          }
        `}</style>
      </div>

      <div className="section-services-wrapper">
        {/* Section Header */}
        <div className="section-projects-header">
          <div className="section-about-text">Our Services</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">THIS IS OUR THING</h2>
          </div>
        </div>

        {/* Services Body with 7 authentic layers and animated SVG spine */}
        <div className="section-services-body">
          {/* SVG Spine Container with Desktop & Mobile paths and Blackhole Portals */}
          <div className="services-path">
            {/* Desktop Dark Scrubbing Path */}
            <div className="services-path-svg-dark w-embed">
              <svg width="100%" height="auto" viewBox="0 0 1616 2187" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1601 15C1241.24 56.6913 1025.14 308.977 1139.71 377.393C1191.45 408.29 1240.74 339.444 1181.39 282.059C1075.45 179.627 937.582 215.243 741.458 298.287C701.638 315.147 622.383 350.59 552.298 410.201C487.298 465.486 487.725 549.018 534.765 563.77C581.804 578.523 632.714 579.634 681.058 587.392C729.731 595.202 767.011 617.17 797.836 657.756C833.766 705.065 838.864 772.034 862.127 825.767C890.491 891.283 966.341 911.2 1033.5 915.638C1130.56 922.052 1195.74 891.215 1286.16 899.069C1347.7 904.414 1457.75 932.208 1466.92 1059.42C1477.81 1210.68 1340.4 1252.99 1221.76 1286.05C1118.2 1314.91 997.775 1397.54 862.127 1334.5C757.468 1285.86 666.411 1293.34 650.401 1384.21C634.391 1475.07 710.968 1532.13 837.283 1542.81C963.598 1553.5 1146.44 1534.93 1181.39 1676C1226.53 1858.21 954.075 1839.5 797.836 1839.5C661.891 1839.5 422.283 1807.72 385.5 1700C340.427 1568 635.939 1584.37 465.5 1917C414.516 2016.5 310 2165.31 15 2165.31"
                  stroke="#2f849c"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Mobile Dark Scrubbing Path */}
            <div className="service-path-mobile-dark w-embed">
              <svg width="100%" height="auto" viewBox="0 0 407 1556" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_services_mob_dark)">
                  <path
                    d="M542.705 10C465.727 48.981 92.8237 79.5116 92.8237 185.592C92.8237 291.673 352.712 336 346.322 440.868C339.933 545.736 104.278 543.251 92.8237 652.131C79.6013 777.82 353.287 765.564 346.322 898.5C339.358 1031.44 63.9084 911.5 68 1046C72.0916 1180.5 335.245 1170.41 328.309 1279.59C320.5 1402.5 -37.4522 1513.46 -135.704 1545.09"
                    stroke="#2f849c"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_services_mob_dark">
                    <rect width="407" height="1555.09" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Mobile Light Track */}
            <div className="service-path-mobile w-embed">
              <svg width="100%" height="auto" viewBox="0 0 407 1556" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_services_mob_light)">
                  <path
                    d="M542.705 10C465.727 48.981 92.8237 79.5116 92.8237 185.592C92.8237 291.673 352.712 336 346.322 440.868C339.933 545.736 104.278 543.251 92.8237 652.131C79.6013 777.82 353.287 765.564 346.322 898.5C339.358 1031.44 63.9084 911.5 68 1046C72.0916 1180.5 335.245 1170.41 328.309 1279.59C320.5 1402.5 -37.4522 1513.46 -135.704 1545.09"
                    stroke="#2f849c"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_services_mob_light">
                    <rect width="407" height="1555.09" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Desktop Light Track */}
            <div className="services-path-svg w-embed">
              <svg width="100%" height="auto" viewBox="0 0 1616 2187" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1601 15C1241.24 56.6913 1025.14 308.977 1139.71 377.393C1191.45 408.29 1240.74 339.444 1181.39 282.059C1075.45 179.627 937.582 215.243 741.458 298.287C701.638 315.147 622.383 350.59 552.298 410.201C487.298 465.486 487.725 549.018 534.765 563.77C581.804 578.523 632.714 579.634 681.058 587.392C729.731 595.202 767.011 617.17 797.836 657.756C833.766 705.065 838.864 772.034 862.127 825.767C890.491 891.283 966.341 911.2 1033.5 915.638C1130.56 922.052 1195.74 891.215 1286.16 899.069C1347.7 904.414 1457.75 932.208 1466.92 1059.42C1477.81 1210.68 1340.4 1252.99 1221.76 1286.05C1118.2 1314.91 997.775 1397.54 862.127 1334.5C757.468 1285.86 666.411 1293.34 650.401 1384.21C634.391 1475.07 710.968 1532.13 837.283 1542.81C963.598 1553.5 1146.44 1534.93 1181.39 1676C1226.53 1858.21 954.075 1839.5 797.836 1839.5C661.891 1839.5 422.283 1807.72 385.5 1700C340.427 1568 635.939 1584.37 465.5 1917C414.516 2016.5 310 2165.31 15 2165.31"
                  stroke="#2f849c"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Portal Hole Start */}
            <div className="blockhole-start w-embed">
              <svg width="100%" height="auto" viewBox="0 0 33 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="20.5" cy="34.5" rx="12.5" ry="3.5" fill="black" />
                <g filter="url(#filter0_dd_portal_start)">
                  <ellipse cx="12.4585" cy="18.0159" rx="12.4357" ry="18" transform="rotate(0.0733968 12.4585 18.0159)" fill="#2f849c" />
                  <path
                    d="M12.4808 0.51593C15.7039 0.520059 18.673 2.41469 20.8561 5.5833C23.0378 8.74988 24.4002 13.1493 24.3939 18.0312C24.3877 22.9131 23.014 27.309 20.8243 30.47C18.633 33.633 15.659 35.52 12.436 35.5159C9.21293 35.5117 6.24369 33.6171 4.06061 30.4485C1.87899 27.282 0.516586 22.8824 0.52284 18.0006C0.529093 13.1188 1.90276 8.72279 4.09249 5.56183C6.28368 2.39886 9.25776 0.511855 12.4808 0.51593Z"
                    stroke="black"
                  />
                </g>
                <defs>
                  <filter id="filter0_dd_portal_start" x="0.0229492" y="0.0161133" width="28.8711" height="37" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_portal_start" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.933333 0 0 0 0 0.909804 0 0 0 1 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_portal_start" result="effect2_dropShadow_portal_start" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_portal_start" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Portal Hole End */}
            <div className="blackhole-end w-embed">
              <svg width="100%" height="auto" viewBox="0 0 33 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12.5" cy="3.5" rx="12.5" ry="3.5" transform="matrix(-1 0 0 1 25 31)" fill="black" />
                <g filter="url(#filter0_dd_portal_end)">
                  <ellipse cx="12.4357" cy="18" rx="12.4357" ry="18" transform="matrix(-0.999999 0.00128102 0.00128102 0.999999 32.9541 0)" fill="#2f849c" />
                  <path
                    d="M20.5192 0.51593C17.2961 0.520059 14.327 2.41469 12.1439 5.5833C9.96218 8.74988 8.59983 13.1493 8.60609 18.0312C8.61234 22.9131 9.98596 27.309 12.1757 30.47C14.367 33.633 17.341 35.52 20.564 35.5159C23.7871 35.5117 26.7563 33.6171 28.9394 30.4485C31.121 27.282 32.4834 22.8824 32.4772 18.0006C32.4709 13.1188 31.0972 8.72279 28.9075 5.56183C26.7163 2.39886 23.7422 0.511855 20.5192 0.51593Z"
                    stroke="black"
                  />
                </g>
                <defs>
                  <filter id="filter0_dd_portal_end" x="4.10596" y="0.0161133" width="28.8711" height="37" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-4" dy="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_portal_end" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.933333 0 0 0 0 0.909804 0 0 0 1 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_portal_end" result="effect2_dropShadow_portal_end" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_portal_end" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>

          <div className="services-layers">
            {servicesData.map((service, index) => (
              <div key={service.id} className="service-layer">
                <div className={`service-block ${service.blockClass}`}>
                  <div className="service-text">{service.text1}</div>
                  <div className="service-svg">
                    <div
                      ref={(el) => {
                        lottieRefs.current[index] = el;
                      }}
                      className="lottie-animation"
                      data-animation-type="lottie"
                      data-loop="1"
                      data-direction="1"
                      data-autoplay="1"
                      data-renderer="svg"
                    />
                  </div>
                  {service.text2 && <div className="service-text">{service.text2}</div>}
                  <div className="service-block-para-wrapper">
                    <p className="service-block-para">{service.para}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
