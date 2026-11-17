"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { NexusCzarLogo, NavLinkStrokeSvg, CtaArrowSvg, ToggleSvg } from "./svgs";

interface NavbarProps {
  onOpenContact: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  // Scribble stroke draw animation on navbar links hover
  useEffect(() => {
    const nav = navbarRef.current;
    if (!nav) return;

    const navBtns = Array.from(nav.querySelectorAll(".navbar-link-btn")) as HTMLElement[];
    const cleanups: (() => void)[] = [];

    navBtns.forEach((btn) => {
      const path = btn.querySelector(".stroke-fill path") as SVGPathElement | null;
      if (!path) return;

      const len = path.getTotalLength ? path.getTotalLength() : 250;
      const targetStrokeWidth = parseFloat(path.getAttribute("stroke-width") || "24") || 24;

      // Start completely invisible so zero cap or residue shows
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

      cleanups.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
        tl.kill();
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // CTA Button Animation (Scale 10x fill + looping arrow bounce + magnetic physics)
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;

    const text = btn.querySelector(".cta-text");
    const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
    const fillHover = btn.querySelector(".cta-btn-fill-hover");
    let arrowLoop: gsap.core.Timeline | null = null;

    const handleMouseEnter = () => {
      if (fillHover) {
        gsap.to(fillHover, {
          scale: 10,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto",
        });
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
        gsap.to(arrow, {
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });
      const innerElements = [text, arrow].filter(Boolean);
      if (innerElements.length) {
        gsap.to(innerElements, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      }
      if (fillHover) {
        gsap.to(fillHover, {
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
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
  }, []);

  return (
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

        {/* Right Info & CTA */}
        <div className="navbar-right">
          <div className="navbar-timing">
            Monday–Friday 09:30 – 18:30 IST
          </div>

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

          {/* Mobile Menu Toggle Button */}
          <div
            className="nexus-nav-toggle-btn"
            role="button"
            aria-label="Toggle Menu"
            tabIndex={0}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="toggle-svg w-embed">
              <ToggleSvg />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="ham-navbar is-open"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#d8eef3",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2.5rem 1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="navbar-logo">
              <NexusCzarLogo />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.75rem",
                cursor: "pointer",
                padding: "0.5rem",
                color: "#2f849c",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", margin: "auto 0" }}>
            <Link
              href="/work"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-primary, sans-serif)",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#000",
                textDecoration: "none",
              }}
            >
              Work
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-primary, sans-serif)",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#000",
                textDecoration: "none",
              }}
            >
              About us
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-primary, sans-serif)",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#000",
                textDecoration: "none",
              }}
            >
              Services
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-primary, sans-serif)",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: "#000",
                textDecoration: "none",
              }}
            >
              FAQ
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              style={{
                backgroundColor: "#2f849c",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Let&apos;s Talk
            </button>
            <div style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.6)", textAlign: "center" }}>
              Monday–Friday 09:30 – 18:30 IST
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
