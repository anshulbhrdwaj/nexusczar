"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

export default function HeroEngineSvg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardBuildRef = useRef<HTMLDivElement>(null);
  const cardMarketRef = useRef<HTMLDivElement>(null);
  const cardScaleRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const growthCurveRef = useRef<SVGPathElement>(null);
  const growthAreaRef = useRef<SVGPathElement>(null);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchDeltaXRef = useRef(0);

  // Return card refs array for indexed operations
  const getCardRefs = useCallback(() => {
    return [cardBuildRef, cardMarketRef, cardScaleRef];
  }, []);

  // Compute resting transform properties for a card given its deck offset (0 = active, 1 = next/right, 2 = prev/left)
  const getDeckProps = (offset: number) => {
    if (offset === 0) {
      // Active card: Front, straight
      return { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 5 };
    } else if (offset === 1) {
      // Next card: Peeking right, tilted +5 deg
      return { x: 10, y: 5, rotation: 5, scale: 0.95, opacity: 0.88, zIndex: 3 };
    } else {
      // Previous card: Peeking left, tilted -5 deg
      return { x: -10, y: 10, rotation: -5, scale: 0.91, opacity: 0.72, zIndex: 1 };
    }
  };

  // Apply Stacked & Overlapped Positions on Mobile (or standard 3-col on desktop)
  const applyStackPositions = useCallback((activeIdx: number, animate = false) => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 900;
    const refs = getCardRefs();

    if (!isMobile) {
      // Desktop: Reset to standard 3-column layout
      refs.forEach((ref) => {
        if (ref.current) {
          gsap.set(ref.current, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            zIndex: "auto",
            clearProps: "transform,opacity,zIndex",
          });
        }
      });
      return;
    }

    // Mobile (<900px): Natural Stacked Overlapping Deck
    refs.forEach((ref, i) => {
      const card = ref.current;
      if (!card) return;

      const offset = (i - activeIdx + 3) % 3;
      const props = getDeckProps(offset);

      card.style.zIndex = `${props.zIndex}`;

      if (animate) {
        gsap.to(card, {
          x: props.x,
          y: props.y,
          rotation: props.rotation,
          scale: props.scale,
          opacity: props.opacity,
          duration: 0.38,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.set(card, {
          x: props.x,
          y: props.y,
          rotation: props.rotation,
          scale: props.scale,
          opacity: props.opacity,
          transformOrigin: "center center",
        });
      }
    });
  }, [getCardRefs]);

  // Stop all autoplay timers (interval + debounce)
  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Card Transition (Fly Out + Step Forward + Smooth Third Card Step)
  const goToCard = useCallback((targetIdx: number, direction: 1 | -1 = 1) => {
    if (isAnimatingRef.current) return;
    const currentIdx = currentIndexRef.current;
    if (targetIdx === currentIdx) return;

    if (typeof window !== "undefined" && window.innerWidth >= 900) {
      currentIndexRef.current = targetIdx;
      setCurrentIndex(targetIdx);
      return;
    }

    const refs = getCardRefs();
    const currentCard = refs[currentIdx]?.current;
    const nextCardEl = refs[targetIdx]?.current;
    if (!currentCard || !nextCardEl) {
      currentIndexRef.current = targetIdx;
      setCurrentIndex(targetIdx);
      return;
    }

    isAnimatingRef.current = true;
    currentIndexRef.current = targetIdx;
    setCurrentIndex(targetIdx);

    const thirdIdx = [0, 1, 2].find((i) => i !== currentIdx && i !== targetIdx)!;
    const thirdCardEl = refs[thirdIdx]?.current;

    // 1. Active card tosses out smoothly with rotation and velocity
    gsap.to(currentCard, {
      x: direction * -260,
      y: -15,
      rotation: direction * -14,
      scale: 0.88,
      opacity: 0,
      duration: 0.38,
      ease: "power2.in",
      onComplete: () => {
        // Position outgoing card at its new resting stack position behind
        const outgoingOffset = (currentIdx - targetIdx + 3) % 3;
        const outProps = getDeckProps(outgoingOffset);
        currentCard.style.zIndex = `${outProps.zIndex}`;
        gsap.set(currentCard, {
          x: outProps.x,
          y: outProps.y,
          rotation: outProps.rotation,
          scale: outProps.scale,
          opacity: outProps.opacity,
        });
        isAnimatingRef.current = false;
      },
    });

    // 2. Next card straightens up and steps to front
    nextCardEl.style.zIndex = "6";
    gsap.to(nextCardEl, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 0.38,
      delay: 0.05,
      ease: "back.out(1.2)",
    });

    // 3. Third card slides smoothly into its new resting stack position
    if (thirdCardEl) {
      const thirdOffset = (thirdIdx - targetIdx + 3) % 3;
      const thirdProps = getDeckProps(thirdOffset);
      thirdCardEl.style.zIndex = `${thirdProps.zIndex}`;
      gsap.to(thirdCardEl, {
        x: thirdProps.x,
        y: thirdProps.y,
        rotation: thirdProps.rotation,
        scale: thirdProps.scale,
        opacity: thirdProps.opacity,
        duration: 0.38,
        ease: "power2.out",
      });
    }
  }, [getCardRefs]);

  const nextCard = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % 3;
    goToCard(nextIdx, 1);
  }, [goToCard]);

  const prevCard = useCallback(() => {
    const prevIdx = (currentIndexRef.current - 1 + 3) % 3;
    goToCard(prevIdx, -1);
  }, [goToCard]);

  // Continuous autoplay loop
  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      autoplayTimerRef.current = setInterval(() => {
        if (!isAnimatingRef.current) {
          const nextIdx = (currentIndexRef.current + 1) % 3;
          goToCard(nextIdx, 1);
        }
      }, 4000);
    }
  }, [goToCard]);

  // Debounce autoplay on user interaction: pause immediately, wait 5.5s of inactivity before resuming
  const debounceAutoplay = useCallback(() => {
    stopAutoplay();
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      debounceTimerRef.current = setTimeout(() => {
        startAutoplay();
      }, 5500);
    }
  }, [stopAutoplay, startAutoplay]);

  // Initial Entrance & Autoplay setup (runs once on mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    applyStackPositions(0, false);
    startAutoplay();

    const ctx = gsap.context(() => {
      // Animate Market Growth Curve
      const curve = growthCurveRef.current;
      const area = growthAreaRef.current;
      if (curve) {
        const len = curve.getTotalLength ? curve.getTotalLength() : 300;
        gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
        if (area) gsap.set(area, { opacity: 0 });

        gsap.to(curve, {
          strokeDashoffset: 0,
          duration: 1.4,
          delay: 0.5,
          ease: "power2.out",
        });

        if (area) {
          gsap.to(area, {
            opacity: 1,
            duration: 1.0,
            delay: 0.85,
            ease: "power2.out",
          });
        }
      }

      // Desktop gentle floating levitation
      if (window.innerWidth >= 900) {
        const cards = [cardBuildRef.current, cardMarketRef.current, cardScaleRef.current];
        cards.forEach((card, i) => {
          if (card) {
            gsap.to(card, {
              y: -5,
              duration: 3.2 + i * 0.35,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: 0.15 * i,
            });
          }
        });
      }
    }, containerRef);

    const handleResize = () => {
      applyStackPositions(currentIndexRef.current, false);
      debounceAutoplay();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      stopAutoplay();
      window.removeEventListener("resize", handleResize);
    };
  }, [applyStackPositions, startAutoplay, stopAutoplay, debounceAutoplay]);

  // Touch Swipe Handlers (Swipe left -> next, Swipe right -> prev) with debounced autoplay
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
    stopAutoplay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    const delta = touchDeltaXRef.current;
    if (Math.abs(delta) > 35) {
      if (delta < 0) {
        // Swiped Left -> Next Card
        nextCard();
      } else {
        // Swiped Right -> Prev Card
        prevCard();
      }
    }
    debounceAutoplay();
  };

  return (
    <div
      ref={containerRef}
      className="hero-engine-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-engine-grid">
        {/* =========================================================================
            CARD 1: [01 // BUILD] — Web & Custom Apps Architecture
        ========================================================================= */}
        <div
          ref={cardBuildRef}
          className="hero-engine-card card-build"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 900 && currentIndexRef.current !== 0) {
              goToCard(0, -1);
              debounceAutoplay();
            }
          }}
        >
          {/* Card Header */}
          <div className="hero-engine-card-header">
            <div className="hero-engine-dots-trio">
              <span className="dot-1" />
              <span className="dot-2" />
              <span className="dot-3" />
            </div>
            <span className="hero-engine-tag">01 // BUILD</span>
            <span className="hero-engine-title">Web &amp; Custom Apps</span>
          </div>

          <div className="hero-engine-divider" />

          {/* Minimalist Code Block */}
          <div className="hero-engine-code-panel">
            <div className="hero-engine-code-line comment">// High-Performance Architecture</div>
            <div className="hero-engine-code-line">
              <span className="code-kw">const</span> app = <span className="code-fn">nexus</span>.<span className="code-method">build</span>(&#123;
            </div>
            <div className="hero-engine-code-line indent">
              <span className="code-prop">speed:</span> <span className="code-str">&quot;Sub-second TTFB&quot;</span>,
            </div>
            <div className="hero-engine-code-line indent">
              <span className="code-prop">cwv:</span> <span className="code-val">&quot;100% Core Web Vitals&quot;</span>
            </div>
            <div className="hero-engine-code-line">
              &#125;);<span className="hero-engine-cursor" />
            </div>
          </div>

          {/* Inset Performance Meter */}
          <div className="hero-engine-subpanel performance-strip">
            <div className="hero-gauge-wrap">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#172957" strokeWidth="3.5" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="var(--brand-primary, #2f849c)"
                  strokeWidth="3.5"
                  strokeDasharray="125"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <text x="24" y="28" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="var(--font-primary), Mdnichrometest, monospace">
                  100
                </text>
              </svg>
            </div>
            <div className="hero-gauge-text">
              <div className="hero-gauge-title">LIGHTHOUSE SCORE</div>
              <div className="hero-gauge-tag">NEXT.JS 16 &bull; SUB-SECOND TTFB</div>
              <div className="hero-gauge-sub">Zero layout shift &bull; Edge cached</div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: [02 // MARKET] — SEO Growth Engine & Organic Search
        ========================================================================= */}
        <div
          ref={cardMarketRef}
          className="hero-engine-card card-market"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 900 && currentIndexRef.current !== 1) {
              goToCard(1, currentIndexRef.current < 1 ? 1 : -1);
              debounceAutoplay();
            }
          }}
        >
          {/* Card Header */}
          <div className="hero-engine-card-header">
            <span className="hero-engine-tag">02 // MARKET</span>
            <span className="hero-engine-title">SEO Growth Engine</span>
          </div>

          <div className="hero-engine-divider" />

          {/* Search Mockup */}
          <div className="hero-engine-search-bar">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="search-icon">
              <circle cx="7" cy="7" r="5" stroke="var(--brand-primary, #2f849c)" strokeWidth="1.8" />
              <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="var(--brand-primary, #2f849c)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="search-query">&quot;enterprise software studio&quot;</span>
            <span className="search-rank-pill">★ RANK #1</span>
          </div>

          {/* Kinetic Growth Curve Diagram */}
          <div className="hero-engine-chart-panel">
            <svg width="100%" height="80" viewBox="0 0 280 80" preserveAspectRatio="none" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="mkt-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary, #2f849c)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--brand-primary, #2f849c)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                ref={growthAreaRef}
                d="M 10 70 C 70 65, 120 54, 170 34 C 210 18, 240 12, 270 8 L 270 75 L 10 75 Z"
                fill="url(#mkt-fill)"
              />
              <path
                ref={growthCurveRef}
                d="M 10 70 C 70 65, 120 54, 170 34 C 210 18, 240 12, 270 8"
                fill="none"
                stroke="var(--brand-primary, #2f849c)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="270" cy="8" r="4" fill="var(--brand-primary, #2f849c)" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="270" cy="8" r="10" fill="none" stroke="var(--brand-primary, #2f849c)" strokeWidth="1" opacity="0.6" />
              <text x="12" y="62" fill="var(--brand-primary, #2f849c)" fontSize="9" fontFamily="monospace" fontWeight="600">Launch</text>
              <text x="155" y="28" fill="var(--brand-primary, #2f849c)" fontSize="9" fontFamily="monospace" fontWeight="600">Technical SEO</text>
            </svg>
          </div>

          {/* Inset KPIs Strip */}
          <div className="hero-engine-subpanel kpis-strip">
            <div className="kpi-col">
              <div className="kpi-num">+340%</div>
              <div className="kpi-label">ORGANIC REVENUE</div>
            </div>
            <div className="kpi-divider" />
            <div className="kpi-col">
              <div className="kpi-num">Top 1%</div>
              <div className="kpi-label">SERP VISIBILITY</div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: [03 // SCALE] — Cloud Infrastructure & Global Edge
        ========================================================================= */}
        <div
          ref={cardScaleRef}
          className="hero-engine-card card-scale"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 900 && currentIndexRef.current !== 2) {
              goToCard(2, 1);
              debounceAutoplay();
            }
          }}
        >
          {/* Card Header */}
          <div className="hero-engine-card-header">
            <div className="hero-engine-dots-trio">
              <span className="dot-1" />
              <span className="dot-2" />
              <span className="dot-3" />
            </div>
            <span className="hero-engine-tag">03 // SCALE</span>
            <span className="hero-engine-title">Cloud Infrastructure</span>
          </div>

          <div className="hero-engine-divider" />

          {/* Edge Topology Visual */}
          <div className="hero-engine-mesh-panel">
            <div className="edge-nodes-row">
              <div className="edge-node">
                <span className="node-name">US-East</span>
                <span className="node-ping">8ms</span>
              </div>
              <div className="node-line" />
              <div className="edge-node">
                <span className="node-name">EU-West</span>
                <span className="node-ping">12ms</span>
              </div>
              <div className="node-line" />
              <div className="edge-node">
                <span className="node-name">APAC</span>
                <span className="node-ping">16ms</span>
              </div>
            </div>
            <div className="mesh-status-label">MULTI-REGION GLOBAL EDGE MESH</div>
          </div>

          {/* Inset SLA Strip */}
          <div className="hero-engine-subpanel sla-strip">
            <div className="sla-metric-wrap">
              <div className="sla-num">99.99%</div>
              <div className="sla-label">GUARANTEED UPTIME SLA</div>
              <div className="sla-sub">Zero-downtime rolling deploys</div>
            </div>
            <div className="sla-badge-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shield-icon">
                <path d="M12 2L4 5V11C4 16.5 12 22 12 22C12 22 20 16.5 20 11V5L12 2Z" stroke="var(--brand-primary, #2f849c)" strokeWidth="1.8" />
                <path d="M9 11.5L11 13.5L15 9.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="shield-text">Enterprise Shield</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Pagination Switcher Pills */}
      <div className="hero-engine-pills">
        {["01 BUILD", "02 MARKET", "03 SCALE"].map((label, idx) => (
          <button
            key={label}
            onClick={() => {
              if (idx !== currentIndexRef.current) {
                goToCard(idx, idx > currentIndexRef.current ? 1 : -1);
                debounceAutoplay();
              }
            }}
            className={`hero-engine-pill-btn ${currentIndex === idx ? "is-active" : ""}`}
            aria-label={`Show ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
