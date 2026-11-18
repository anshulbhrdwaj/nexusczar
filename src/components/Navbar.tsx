"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { NexusCzarLogo, NavLinkStrokeSvg, CtaArrowSvg } from "./svgs";

interface NavbarProps {
  onOpenContact: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const pathname = usePathname();
  const navbarRef = useRef<HTMLElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const hamCtaBtnRef = useRef<HTMLAnchorElement>(null);
  const toggleBtnRef = useRef<HTMLDivElement>(null);
  const toggleBtnModalRef = useRef<HTMLDivElement>(null);
  const hamNavbarRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const iconTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const navTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup morphing toggle icon timeline
  useEffect(() => {
    const svgs = Array.from(document.querySelectorAll<SVGSVGElement>(".nexus-toggle-svg"));
    if (!svgs.length) return;

    const primarySvg = svgs[0];
    const orangePath = (primarySvg.querySelector(".stem-path") || primarySvg.querySelectorAll("path")[0]) as SVGPathElement | null;
    const crossPath = (primarySvg.querySelector(".cross-path") || primarySvg.querySelectorAll("path")[1]) as SVGPathElement | null;

    if (!orangePath || !crossPath) return;

    const orangeTotalLen = orangePath.getTotalLength ? orangePath.getTotalLength() : 80;
    const crossTotalLen = crossPath.getTotalLength ? crossPath.getTotalLength() : 20;

    let horseshoeLen = orangeTotalLen * 0.44;
    for (let len = 0; len < orangeTotalLen; len += 0.2) {
      const pt = orangePath.getPointAtLength(len);
      if (len > 30 && pt.x <= 9.05 && Math.abs(pt.y - 16.02) < 0.3) {
        horseshoeLen = len;
        break;
      }
    }

    const stemLen = 20.0;
    const finalOffset = -(orangeTotalLen - stemLen);

    // Initial state
    svgs.forEach((svg) => {
      const op = (svg.querySelector(".stem-path") || svg.querySelectorAll("path")[0]) as SVGPathElement | null;
      const cp = (svg.querySelector(".cross-path") || svg.querySelectorAll("path")[1]) as SVGPathElement | null;
      if (op) {
        op.style.strokeDasharray = `${horseshoeLen} ${orangeTotalLen}`;
        op.style.strokeDashoffset = "0";
      }
      if (cp) {
        cp.style.strokeDasharray = `${crossTotalLen} ${crossTotalLen}`;
        cp.style.strokeDashoffset = `${crossTotalLen}`;
        gsap.set(cp, { strokeWidth: 0 });
      }
      gsap.set(svg, { rotation: 0, transformOrigin: "center center" });
    });

    const iconTl = gsap.timeline({ paused: true });
    const dashObj = { len: horseshoeLen, offset: 0 };

    iconTl
      .to(
        dashObj,
        {
          len: stemLen,
          offset: finalOffset,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: () => {
            svgs.forEach((svg) => {
              const op = (svg.querySelector(".stem-path") || svg.querySelectorAll("path")[0]) as SVGPathElement | null;
              if (op) {
                op.style.strokeDasharray = `${dashObj.len} ${orangeTotalLen}`;
                op.style.strokeDashoffset = `${dashObj.offset}`;
              }
            });
          },
        },
        0
      )
      .to(
        svgs.map((svg) => svg.querySelector(".cross-path") || svg.querySelectorAll("path")[1]).filter(Boolean),
        {
          strokeWidth: 4,
          duration: 0.12,
          ease: "back.out(2)",
        },
        0.1
      )
      .to(
        svgs.map((svg) => svg.querySelector(".cross-path") || svg.querySelectorAll("path")[1]).filter(Boolean),
        {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.2
      )
      .to(
        svgs,
        {
          rotation: 45,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0
      );

    iconTimelineRef.current = iconTl;

    return () => {
      iconTl.kill();
    };
  }, []);

  // Open & Close Menu functions with signature Two26 kinetic spring physics
  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    if (iconTimelineRef.current) iconTimelineRef.current.play();

    const hamNavbar = hamNavbarRef.current;
    if (hamNavbar) {
      document.body.style.overflow = "hidden";
      hamNavbar.style.display = "flex";
      hamNavbar.style.pointerEvents = "auto";

      if (navTimelineRef.current) navTimelineRef.current.kill();
      const navTl = gsap.timeline();
      navTimelineRef.current = navTl;

      navTl.fromTo(hamNavbar, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);

      const linksContainer = hamNavbar.querySelector(".hamburger-links");
      const linkItems = linksContainer ? Array.from(linksContainer.children) : [];

      if (linkItems.length) {
        linkItems.forEach((item, index) => {
          const randomTilt = gsap.utils.random(-10, 10);
          navTl.fromTo(
            item,
            {
              opacity: 0,
              x: -35,
              y: 50,
              scale: 0.4,
              rotation: randomTilt,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.75,
              ease: "back.out(2.2)", // Signature TWO 26 spring bounce
            },
            0.15 + index * 0.09
          );
        });
      }
    }
  }, []);

  const closeMenu = useCallback(() => {
    if (iconTimelineRef.current) iconTimelineRef.current.reverse();

    const hamNavbar = hamNavbarRef.current;
    if (hamNavbar) {
      if (navTimelineRef.current) navTimelineRef.current.kill();
      const linksContainer = hamNavbar.querySelector(".hamburger-links");
      const linkItems = linksContainer ? Array.from(linksContainer.children) : [];

      const navTl = gsap.timeline({
        onComplete: () => {
          hamNavbar.style.display = "none";
          hamNavbar.style.pointerEvents = "none";
          document.body.style.overflow = "";
          setIsMenuOpen(false);
        },
      });
      navTimelineRef.current = navTl;

      if (linkItems.length) {
        navTl.to(
          linkItems,
          {
            opacity: 0,
            y: 20,
            scale: 0.8,
            duration: 0.25,
            stagger: 0.04,
            ease: "power2.in",
          },
          0
        );
      }

      navTl.to(hamNavbar, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 0.1);
    } else {
      setIsMenuOpen(false);
    }
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Scribble stroke draw animation on navbar links (Desktop + Mobile)
  useEffect(() => {
    const nav = navbarRef.current;
    const hamNav = hamNavbarRef.current;
    const containers = [nav, hamNav].filter(Boolean) as HTMLElement[];
    const cleanups: (() => void)[] = [];

    containers.forEach((container) => {
      const navBtns = Array.from(container.querySelectorAll(".navbar-link-btn")) as HTMLElement[];

      navBtns.forEach((btn) => {
        const path = btn.querySelector(".stroke-fill path") as SVGPathElement | null;
        if (!path) return;

        const len = path.getTotalLength ? path.getTotalLength() : 250;
        const targetStrokeWidth = parseFloat(path.getAttribute("stroke-width") || "24") || 24;

        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          strokeWidth: 0,
          opacity: 0,
        });

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power1.inOut" },
        });

        tl.to(path, {
          strokeDashoffset: 0,
          strokeWidth: targetStrokeWidth,
          opacity: 1,
          duration: 0.45,
        });

        const onEnter = () => tl.timeScale(1).play();
        const onLeave = () => tl.timeScale(1.4).reverse();

        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mouseleave", onLeave);
        btn.addEventListener("touchstart", onEnter, { passive: true });
        btn.addEventListener("touchend", onLeave, { passive: true });

        cleanups.push(() => {
          btn.removeEventListener("mouseenter", onEnter);
          btn.removeEventListener("mouseleave", onLeave);
          btn.removeEventListener("touchstart", onEnter);
          btn.removeEventListener("touchend", onLeave);
          tl.kill();
        });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // CTA Button Animation (Magnetic physics + hover fill)
  const setupCtaButton = (btn: HTMLElement | null) => {
    if (!btn) return () => {};

    const text = btn.querySelector(".cta-text");
    const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
    const fillHover = btn.querySelector(".cta-btn-fill-hover");
    let arrowLoop: gsap.core.Timeline | null = null;

    const handleMouseEnter = () => {
      if (fillHover) {
        gsap.to(fillHover, { scale: 10, duration: 0.55, ease: "power2.out", overwrite: "auto" });
      }
      if (arrow) {
        gsap.set(arrow, { transformOrigin: "center center" });
        if (arrowLoop) arrowLoop.kill();
        arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
        arrowLoop
          .to(arrow, { rotation: -25, duration: 0.22, ease: "power2.out" })
          .to(arrow, { rotation: 0, duration: 0.4, ease: "back.out(2.5)" });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const currentX = (gsap.getProperty(btn, "x") as number) || 0;
      const currentY = (gsap.getProperty(btn, "y") as number) || 0;

      const originCenterX = rect.left - currentX + rect.width / 2;
      const originCenterY = rect.top - currentY + rect.height / 2;

      const deltaX = e.clientX - originCenterX;
      const deltaY = e.clientY - originCenterY;

      gsap.to(btn, {
        x: deltaX * 0.35,
        y: deltaY * 0.35,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      const innerElements = [text, arrow].filter(Boolean);
      if (innerElements.length) {
        gsap.to(innerElements, {
          x: deltaX * 0.15,
          y: deltaY * 0.15,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      if (arrowLoop) {
        arrowLoop.kill();
        arrowLoop = null;
      }
      if (arrow) {
        gsap.to(arrow, { rotation: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
      }
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.4)", overwrite: "auto" });
      const innerElements = [text, arrow].filter(Boolean);
      if (innerElements.length) {
        gsap.to(innerElements, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.4)", overwrite: "auto" });
      }
      if (fillHover) {
        gsap.to(fillHover, { scale: 1, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      }
    };

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
      if (arrowLoop) arrowLoop.kill();
    };
  };

  useEffect(() => {
    const c1 = setupCtaButton(ctaBtnRef.current);
    const c2 = setupCtaButton(hamCtaBtnRef.current);
    return () => {
      c1();
      c2();
    };
  }, []);

  return (
    <>
      <header ref={navbarRef} className="header">
        <nav className="navbar-wrap">
          {/* Left Links */}
          <div className="navbar-links">
            <Link
              href="/work"
              aria-current={pathname === "/work" ? "page" : undefined}
              className={`navbar-link-btn w-inline-block ${pathname === "/work" ? "w--current" : ""}`}
            >
              <div className="navlink-text">Work</div>
              <div className="stroke-fill">
                <div className="stroke-fill-code w-embed">
                  <NavLinkStrokeSvg />
                </div>
              </div>
            </Link>

            <Link
              href="/about"
              aria-current={pathname === "/about" ? "page" : undefined}
              className={`navbar-link-btn w-inline-block ${pathname === "/about" ? "w--current" : ""}`}
            >
              <div className="navlink-text">About us</div>
              <div className="stroke-fill">
                <div className="stroke-fill-code w-embed">
                  <NavLinkStrokeSvg />
                </div>
              </div>
            </Link>
          </div>

          {/* Center Brand Logo */}
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`navbar-logo w-inline-block ${pathname === "/" ? "w--current" : ""}`}
            aria-label="NexusCzar Home"
          >
            <div className="logo-svg w-embed">
              <NexusCzarLogo />
            </div>
          </Link>

          {/* Right Info & CTA & Mobile Toggle */}
          <div className="navbar-right">
            <div className="navbar-timing">Monday–Friday 09:30 – 18:30 IST</div>

            <div className="cta-wrap">
              <a
                ref={ctaBtnRef}
                data-wf--cta-btn--variant="base"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenContact();
                }}
                className="cta-btn w-inline-block"
                role="button"
              >
                <div className="cta-text">Let&apos;s Talk</div>
                <div className="cta-btn-arrow">
                  <div className="svg-arrow-cta w-embed">
                    <CtaArrowSvg />
                  </div>
                </div>
                <div className="cta-btn-fill-hover" />
              </a>
            </div>

            {/* Mobile Menu Toggle Button (morphs between horseshoe & X) */}
            <div className="ham-btn">
              <div
                ref={toggleBtnRef}
                className="two26-nav-toggle-btn nexus-nav-toggle-btn"
                role="button"
                aria-label="Toggle Menu"
                tabIndex={0}
                onClick={toggleMenu}
              >
                <svg
                  className="two26-toggle-svg nexus-toggle-svg"
                  viewBox="-2 6.52 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Stem / Looping Horseshoe */}
                  <path
                    className="orange-path stem-path"
                    d="M7.01247 34.0204C7.01247 34.0204 10.1314 34.0204 20.8246 34.0204C31.5179 34.0204 31.2364 16.0204 20.8246 16.0205C10.4128 16.0205 9.00975 16.0196 9.00975 16.0196C5.0415 16.0196 2 12.8812 2 9.00979C2 5.13839 5.13839 2 9.00979 2C12.8679 2.01076 15.9893 5.1363 16 8.98937V34.5196"
                    stroke="#2f849c"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Cross Bar */}
                  <path
                    className="cross-path"
                    d="M6 24.52H26"
                    stroke="#2f849c"
                    strokeWidth="0"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Navigation Overlay (<= 768px) */}
      <div
        ref={hamNavbarRef}
        className={`ham-navbar ${isMenuOpen ? "is-open" : ""}`}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100svh",
          backgroundColor: "rgba(240, 247, 249, 0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 99990,
          opacity: 0,
          pointerEvents: "none",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.5em 1.25em 2.5em 1.25em",
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Top bar inside mobile menu */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            zIndex: 2,
          }}
        >
          <Link href="/" onClick={closeMenu} className="navbar-logo" aria-label="NexusCzar Home">
            <NexusCzarLogo />
          </Link>

          <div
            ref={toggleBtnModalRef}
            className="two26-nav-toggle-btn nexus-nav-toggle-btn"
            role="button"
            aria-label="Close Menu"
            tabIndex={0}
            onClick={closeMenu}
          >
            <svg
              className="two26-toggle-svg nexus-toggle-svg"
              viewBox="-2 6.52 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="orange-path stem-path"
                d="M7.01247 34.0204C7.01247 34.0204 10.1314 34.0204 20.8246 34.0204C31.5179 34.0204 31.2364 16.0204 20.8246 16.0205C10.4128 16.0205 9.00975 16.0196 9.00975 16.0196C5.0415 16.0196 2 12.8812 2 9.00979C2 5.13839 5.13839 2 9.00979 2C12.8679 2.01076 15.9893 5.1363 16 8.98937V34.5196"
                stroke="#2f849c"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                className="cross-path"
                d="M6 24.52H26"
                stroke="#2f849c"
                strokeWidth="0"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Center Staggered Links */}
        <div
          className="hamburger-links"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "0.5em",
            margin: "auto 0",
            width: "100%",
            fontSize: "1.9em",
            zIndex: 1,
          }}
        >
          <Link
            href="/work"
            onClick={closeMenu}
            className={`navbar-link-btn w-inline-block ${pathname === "/work" ? "w--current" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <div className="navlink-text">Work</div>
            <div className="stroke-fill">
              <div className="stroke-fill-code w-embed">
                <NavLinkStrokeSvg />
              </div>
            </div>
          </Link>

          <Link
            href="/about"
            onClick={closeMenu}
            className={`navbar-link-btn w-inline-block ${pathname === "/about" ? "w--current" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <div className="navlink-text">About us</div>
            <div className="stroke-fill">
              <div className="stroke-fill-code w-embed">
                <NavLinkStrokeSvg />
              </div>
            </div>
          </Link>

          <Link
            href="/#services"
            onClick={closeMenu}
            className="navbar-link-btn w-inline-block"
            style={{ textDecoration: "none" }}
          >
            <div className="navlink-text">Services</div>
            <div className="stroke-fill">
              <div className="stroke-fill-code w-embed">
                <NavLinkStrokeSvg />
              </div>
            </div>
          </Link>

          <Link
            href="/#faq"
            onClick={closeMenu}
            className="navbar-link-btn w-inline-block"
            style={{ textDecoration: "none" }}
          >
            <div className="navlink-text">FAQ</div>
            <div className="stroke-fill">
              <div className="stroke-fill-code w-embed">
                <NavLinkStrokeSvg />
              </div>
            </div>
          </Link>

          {/* Mobile CTA */}
          <div className="ham-cta" style={{ marginTop: "0.5em", fontSize: "0.75em" }}>
            <a
              ref={hamCtaBtnRef}
              data-wf--cta-btn--variant="base"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                onOpenContact();
              }}
              className="cta-btn w-inline-block"
              role="button"
            >
              <div className="cta-text">Let&apos;s Talk</div>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta w-embed">
                  <CtaArrowSvg />
                </div>
              </div>
              <div className="cta-btn-fill-hover" />
            </a>
          </div>
        </div>

        {/* Bottom Operating Hours */}
        <div
          style={{
            fontSize: "0.85em",
            color: "rgba(11, 19, 38, 0.6)",
            textAlign: "center",
            width: "100%",
            letterSpacing: "0.02em",
            fontWeight: 500,
          }}
        >
          Monday–Friday 09:30 – 18:30 IST
        </div>
      </div>
    </>
  );
}
