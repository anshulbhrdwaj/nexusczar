"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  heading: string;
  para: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Mazumdar",
    title: "Director, Mazuma India",
    heading: "NexusCzar transformed our entire FinTech platform and operational workflow",
    para: "NexusCzar engineered our corporate tax platform with unprecedented speed and precision. Their technical depth in Next.js, database architecture, and SEO scaled our organic acquisitions 4x within six months. Truly world-class engineering team.",
    avatar: "/nexusczar/mazumaindia.png",
  },
  {
    id: 2,
    name: "Karan Sethi",
    title: "Co-Founder & CTO, OREA Homes",
    heading: "The best technical partner we've had for real estate technology",
    para: "Building an interactive real estate portal with 8,000+ daily listings requires zero compromise on performance. NexusCzar delivered sub-second load times, flawless interactive maps, and a conversion engine our agents and customers love.",
    avatar: "/nexusczar/oreahomes.png",
  },
  {
    id: 3,
    name: "Pooja Sharma",
    title: "Principal Designer, Advika Creations",
    heading: "Incredible design taste matched with rock-solid engineering",
    para: "NexusCzar captured the architectural luxury of Advika Creations perfectly. Their attention to kinetic micro-interactions, responsive physics, and 3D space visualizers positioned us at the top of commercial interior designers in the NCR.",
    avatar: "/nexusczar/advikacreations.png",
  },
  {
    id: 4,
    name: "Harish Pal, MS, MCh",
    title: "Consultant Surgeon, Dubai & UAE",
    heading: "Flawless digital presence across UAE and international markets",
    para: "Our patient booking flows, multi-regional SEO, and brand positioning across Dubai and India were handled seamlessly by NexusCzar. Reliable, deeply skilled, and always proactive.",
    avatar: "/nexusczar/harishpal.png",
  },
  {
    id: 5,
    name: "Er. R. K. Singh",
    title: "Chief Project Officer, HH Buildtech",
    heading: "Enterprise reliability for large-scale infrastructure projects",
    para: "NexusCzar built our highway and civil infrastructure ERP with zero downtime and ironclad security. Their understanding of enterprise operations and cloud compliance is second to none.",
    avatar: "/nexusczar/hhbpl.png",
  },
];

export default function Testimonials() {
  const bodyBgRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navArrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyBg = bodyBgRef.current;
    if (!bodyBg) return;

    const cardElements = Array.from(
      bodyBg.querySelectorAll<HTMLElement>(".testimonial-item")
    );
    const totalCards = cardElements.length;
    if (totalCards === 0) return;

    // Clean up any inner card nested transforms so GSAP is single source of truth
    cardElements.forEach((card) => {
      const innerCard = card.querySelector<HTMLElement>(
        ".testimonial-card, [class*='testimonial-card']"
      );
      if (innerCard && innerCard !== card) {
        innerCard.style.transform = "none";
        innerCard.style.position = "relative";
        innerCard.style.top = "auto";
        innerCard.style.left = "auto";
        innerCard.style.margin = "0 auto";
      }
    });

    const sidebar = sidebarRef.current;
    const navArrow = navArrowRef.current;

    let currentIndex = 0;
    let isAnimating = false;

    // 1. Organic Aggressive Rotations for Natural Stacked Deck
    const anglePalette = [-7.5, 6.8, -5.5, 8.2, -8.5, 6.2, -7.0, 7.8];
    const cardRotations = cardElements.map(
      (_, i) => anglePalette[i % anglePalette.length]
    );

    // Initial card positions & z-index layer stack
    function applyCardStackPositions() {
      cardElements.forEach((card, i) => {
        const order = (i - currentIndex + totalCards) % totalCards;
        const zIndex = totalCards - order;

        card.style.zIndex = `${zIndex}`;
        card.style.willChange = "transform";
        card.style.backfaceVisibility = "hidden";

        gsap.set(card, {
          xPercent: 0,
          yPercent: 0,
          x: 0,
          y: 0,
          rotation: i === currentIndex ? 0 : cardRotations[i],
          opacity: 1,
          scale: 1,
          force3D: true,
          transformOrigin: "center center",
        });
      });
    }

    applyCardStackPositions();

    // 2. Dynamic Sidebar Horizontal Ticks (.side-bar)
    const sidebarTicks: HTMLDivElement[] = [];
    if (sidebar) {
      sidebar.innerHTML = "";
      sidebar.style.display = "flex";
      sidebar.style.alignItems = "center";
      sidebar.style.justifyContent = "center";
      sidebar.style.gap = "1em";
      sidebar.style.pointerEvents = "none";

      for (let i = 0; i < totalCards; i++) {
        const tick = document.createElement("div");
        tick.className = "sidebar-tick";
        tick.style.height = "2px";
        tick.style.borderRadius = "2px";
        tick.style.backgroundColor = "#FFFFFF";
        tick.style.transformOrigin = "right center";
        sidebar.appendChild(tick);
        sidebarTicks.push(tick);
      }

      updateSidebar(currentIndex, false);
    }

    function updateSidebar(activeIdx: number, animate = true) {
      if (!sidebarTicks.length) return;

      sidebarTicks.forEach((tick, idx) => {
        const isActive = idx === activeIdx;
        const targetWidth = isActive ? 34 : 14;
        const targetOpacity = isActive ? 1 : 0.35;

        if (animate) {
          gsap.to(tick, {
            width: targetWidth,
            opacity: targetOpacity,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.set(tick, {
            width: targetWidth,
            opacity: targetOpacity,
          });
        }
      });
    }

    const isTouch =
      matchMedia("(pointer: coarse)").matches || window.innerWidth < 992;

    // 3. Floating Custom Navigation Arrow (.nav-arrow)
    let removeArrowListeners = () => {};
    if (navArrow) {
      if (isTouch) {
        navArrow.style.display = "none";
      } else {
        navArrow.style.position = "absolute";
        navArrow.style.top = "0px";
        navArrow.style.left = "0px";
        navArrow.style.right = "auto";
        navArrow.style.bottom = "auto";
        navArrow.style.margin = "0px";
        navArrow.style.pointerEvents = "none";
        navArrow.style.zIndex = "999";

        gsap.set(navArrow, {
          scale: 0,
          opacity: 0,
          rotation: 0,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "center center",
          force3D: true,
        });

        const setArrowX = gsap.quickTo(navArrow, "x", {
          duration: 0.15,
          ease: "power2.out",
        });
        const setArrowY = gsap.quickTo(navArrow, "y", {
          duration: 0.15,
          ease: "power2.out",
        });

        let currentArrowDir = 0; // 0 = UP, 180 = DOWN

        const handleMouseEnter = (e: MouseEvent) => {
          const rect = bodyBg.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          gsap.set(navArrow, { x: mouseX, y: mouseY });

          const isTopHalf = mouseY < rect.height / 2;
          currentArrowDir = isTopHalf ? 0 : 180;
          gsap.set(navArrow, { rotation: currentArrowDir });

          gsap.to(navArrow, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = bodyBg.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          setArrowX(mouseX);
          setArrowY(mouseY);

          const isTopHalf = mouseY < rect.height / 2;
          const targetRotation = isTopHalf ? 0 : 180;

          if (currentArrowDir !== targetRotation) {
            currentArrowDir = targetRotation;
            gsap.to(navArrow, {
              rotation: targetRotation,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(navArrow, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        bodyBg.addEventListener("mouseenter", handleMouseEnter);
        bodyBg.addEventListener("mousemove", handleMouseMove);
        bodyBg.addEventListener("mouseleave", handleMouseLeave);

        removeArrowListeners = () => {
          bodyBg.removeEventListener("mouseenter", handleMouseEnter);
          bodyBg.removeEventListener("mousemove", handleMouseMove);
          bodyBg.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    }

    // 4. Physical Deck Shuffle: Next & Prev
    function reorderZIndices() {
      cardElements.forEach((card, i) => {
        const order = (i - currentIndex + totalCards) % totalCards;
        card.style.zIndex = `${totalCards - order}`;

        if (i !== currentIndex) {
          gsap.to(card, {
            rotation: cardRotations[i],
            xPercent: 0,
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    }

    function goToNextCard() {
      if (isAnimating || totalCards <= 1) return;
      isAnimating = true;

      const outgoingIndex = currentIndex;
      const outgoingCard = cardElements[outgoingIndex];
      const nextIndex = (currentIndex + 1) % totalCards;
      const incomingCard = cardElements[nextIndex];

      // 1. Straighten incoming card as it becomes active front card
      gsap.to(incomingCard, {
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // 2. Outgoing card flies UP out of the deck with dynamic tilt
      const tiltOffset = outgoingIndex % 2 === 0 ? 9 : -9;
      gsap.to(outgoingCard, {
        yPercent: -140,
        rotation: cardRotations[outgoingIndex] + tiltOffset,
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          currentIndex = nextIndex;
          reorderZIndices();
          outgoingCard.style.zIndex = "1";

          // Slide DOWN back into bottom of deck
          gsap.to(outgoingCard, {
            yPercent: 0,
            rotation: cardRotations[outgoingIndex],
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
              reorderZIndices();
              isAnimating = false;
            },
          });
        },
      });

      updateSidebar(nextIndex, true);
    }

    function goToPrevCard() {
      if (isAnimating || totalCards <= 1) return;
      isAnimating = true;

      const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
      const incomingCard = cardElements[prevIndex];
      const currentCard = cardElements[currentIndex];

      gsap.to(currentCard, {
        rotation: cardRotations[currentIndex],
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      const tiltOffset = prevIndex % 2 === 0 ? 8 : -8;
      gsap.to(incomingCard, {
        yPercent: 120,
        rotation: cardRotations[prevIndex] + tiltOffset,
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          currentIndex = prevIndex;
          reorderZIndices();
          incomingCard.style.zIndex = `${totalCards + 10}`;

          gsap.to(incomingCard, {
            yPercent: 0,
            rotation: 0,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
              reorderZIndices();
              isAnimating = false;
            },
          });
        },
      });

      updateSidebar(prevIndex, true);
    }

    // 5. Touch Swiping & Gesture Interaction
    let touchStartY = 0;
    let touchStartX = 0;
    let isSwipeAction = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isSwipeAction = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaY = touchEndY - touchStartY;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
          isSwipeAction = true;
          if (deltaY < 0) {
            goToNextCard();
          } else {
            goToPrevCard();
          }
        }
      }
    };

    bodyBg.addEventListener("touchstart", handleTouchStart, { passive: true });
    bodyBg.addEventListener("touchend", handleTouchEnd, { passive: true });

    // 6. Click Handler on .testimonials-body-bg
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button") || isSwipeAction) return;

      const rect = bodyBg.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const isTopHalf = clickY < rect.height / 2;

      if (isTopHalf) {
        goToNextCard();
      } else {
        goToPrevCard();
      }
    };

    bodyBg.addEventListener("click", handleClick);

    return () => {
      removeArrowListeners();
      bodyBg.removeEventListener("touchstart", handleTouchStart);
      bodyBg.removeEventListener("touchend", handleTouchEnd);
      bodyBg.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section id="testimonials" className="section-testimonials">
      <div className="section-testimonials-wrapper">
        {/* Section Header matching exact reference */}
        <div className="section-projects-header">
          <div className="section-about-text">TESTIMONIALS</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">APPARENTLY, THEY LIKE US</h2>
          </div>
        </div>

        {/* Testimonials Deck Container */}
        <div className="section-testimonials-body">
          <div ref={bodyBgRef} className="testimonials-body-bg">
            <div className="testimonial-list-wrapper w-dyn-list">
              <div role="list" className="testimonial-list w-dyn-items">
                {testimonialsData.map((t) => (
                  <div key={t.id} role="listitem" className="testimonial-item w-dyn-item">
                    <div className="testimonial-card">
                      <div className="testimonial-heading">{t.heading}</div>

                      <div className="testimonial-card-btm">
                        <div className="testimonial-card-pfp">
                          <div className="testimonial-img-wrap">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={t.avatar}
                              loading="lazy"
                              alt=""
                              sizes="100vw"
                              className="image"
                            />
                          </div>
                          <div className="pfp-info-wrapper">
                            <div className="testimonial-pfp-name">{t.name}</div>
                            <div className="testimonial-pfp-designation">{t.title}</div>
                          </div>
                        </div>
                        <p className="testimonial-card-para">{t.para}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Sidebar Horizontal Ticks */}
            <div ref={sidebarRef} className="side-bar" />

            {/* Floating Custom Navigation Arrow */}
            <div ref={navArrowRef} className="nav-arrow">
              <div className="nav-arrow-svg w-embed">
                <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.17285 16.1729L7.17285 1.17285M1.17285 6.79785L7.17285 1.17285L13.1729 6.79785"
                    stroke="currentColor"
                    strokeWidth="2.34564"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS matching authentic Webflow CSS */}
      <div className="testimonial-html w-embed w-script">
        <style>{`
          .testimonials-body-bg {
            position: relative !important;
            overflow: hidden !important;
          }

          .testimonials-body-bg .w-dyn-list,
          .testimonials-body-bg .testimonial-list-wrapper {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .testimonials-body-bg .w-dyn-items,
          .testimonials-body-bg .testimonial-list {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            display: grid !important;
            place-items: center !important;
            align-content: center !important;
            justify-content: center !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .testimonials-body-bg .testimonial-item {
            grid-area: 1 / 1 !important;
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            margin: auto !important;
            align-self: center !important;
            justify-self: center !important;
            transform-origin: center center !important;
            will-change: transform !important;
            backface-visibility: hidden !important;
          }

          .testimonials-body-bg .testimonial-item .testimonial-card,
          .testimonials-body-bg .testimonial-item [class*="testimonial-card"] {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            margin: 0 auto !important;
            transform: none !important;
          }
        `}</style>
      </div>
    </section>
  );
}
