"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NexusCzarGiantLogo, CtaArrowSvg } from "./svgs";

interface FooterProps {
  onOpenContact: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  // 1. CTA Button Magnetism and Looping Arrow Rotation Bounce
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;

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

      const inners = [text, arrow].filter(Boolean);
      if (inners.length) {
        gsap.to(inners, {
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

      const inners = [text, arrow].filter(Boolean);
      if (inners.length) {
        gsap.to(inners, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.4)", overwrite: "auto" });
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
  }, []);

  // 2. Heading Reveal, Elastic Bottom Stretch & Kinetic Links
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const footer = footerRef.current;
    if (!footer) return;

    // A. Footer Heading Masked Line Reveal
    const heading = footer.querySelector(".footer-heading") as HTMLElement | null;
    let headingAnim: gsap.core.Tween | null = null;

    if (heading) {
      const rawText = heading.innerHTML.trim();
      heading.innerHTML = `<span class="footer-heading-line-mask"><span class="footer-heading-line">${rawText}</span></span>`;
      const lines = Array.from(heading.querySelectorAll(".footer-heading-line")) as HTMLElement[];

      gsap.set(lines, {
        y: "115%",
        opacity: 0,
      });

      headingAnim = gsap.to(lines, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: footer,
          start: "top 80%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });
    }

    // B. Signature Elastic Footer Stretch & Settle on .footer-btm
    const footerBtm = footer.querySelector(".footer-btm") as HTMLElement | null;
    let footerScrollTrigger: ScrollTrigger | null = null;

    if (footerBtm) {
      gsap.set(footerBtm, {
        scaleY: 0.15,
        transformOrigin: "bottom center",
        display: "block",
        willChange: "transform",
      });

      let hasBounced = false;

      footerScrollTrigger = ScrollTrigger.create({
        trigger: footer,
        start: "top bottom",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const vel = Math.abs(self.getVelocity() || 0);
          const velStretch = Math.min(vel / 1500, 0.25);

          if (self.progress >= 0.9) {
            if (!hasBounced) {
              hasBounced = true;
              gsap.killTweensOf(footerBtm);
              gsap.to(footerBtm, {
                scaleY: 1,
                duration: 1.4,
                ease: "elastic.out(1.2, 0.35)",
                overwrite: "auto",
              });
            }
          } else {
            hasBounced = false;
            const baseTarget =
              self.direction === 1
                ? 0.15 + self.progress * 1.15 + velStretch
                : 0.15 + self.progress * 0.95;

            const targetScaleY = Math.max(0.15, Math.min(baseTarget, 1.4));
            gsap.to(footerBtm, {
              scaleY: targetScaleY,
              duration: 0.1,
              ease: "power1.out",
              overwrite: "auto",
            });
          }
        },
        onLeave: () => {
          if (!hasBounced) {
            hasBounced = true;
            gsap.killTweensOf(footerBtm);
            gsap.to(footerBtm, {
              scaleY: 1,
              duration: 1.4,
              ease: "elastic.out(1.2, 0.35)",
              overwrite: "auto",
            });
          }
        },
        onLeaveBack: () => {
          hasBounced = false;
          gsap.killTweensOf(footerBtm);
          gsap.to(footerBtm, {
            scaleY: 0.15,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });
    }

    // C. Kinetic Character Hover Animation on Footer Links & Email
    const footerLinks = Array.from(
      footer.querySelectorAll<HTMLElement>(
        ".footer-link:not(.footer-link-header), a.footer-link, a[href^='mailto:'], .social-link"
      )
    );

    footerLinks.forEach((link) => {
      if (link.querySelector(".footer-link-char")) return;

      Array.from(link.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) {
          const span = document.createElement("span");
          span.className = "footer-link-text-wrap";
          span.style.display = "inline-block";

          const raw = node.textContent;
          span.innerHTML = raw
            .split("")
            .map((c) =>
              c === " " ? "&nbsp;" : `<span class="footer-link-char">${c}</span>`
            )
            .join("");

          node.parentNode?.replaceChild(span, node);
        }
      });

      const chars = Array.from(link.querySelectorAll<HTMLElement>(".footer-link-char"));
      if (!chars.length) return;

      gsap.set(chars, {
        display: "inline-block",
        transformOrigin: "center center",
        scale: 1,
        rotation: 0,
        textShadow: "0px 0px 0px rgba(0,0,0,0)",
      });

      link.addEventListener("mouseenter", () => {
        chars.forEach((char, idx) => {
          const randomTilt = gsap.utils.random(-7, 7);
          const charDelay = idx * 0.035;

          gsap.to(char, {
            scale: 1.14,
            rotation: randomTilt,
            textShadow:
              "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
            duration: 0.38,
            delay: charDelay,
            ease: "back.out(1.8)",
            overwrite: "auto",
            onComplete: () => {
              gsap.to(char, {
                scale: 1,
                rotation: 0,
                textShadow: "0px 0px 0px rgba(0,0,0,0)",
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
            },
          });
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(chars, {
          scale: 1,
          rotation: 0,
          textShadow: "0px 0px 0px rgba(0,0,0,0)",
          duration: 0.35,
          stagger: 0.018,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    return () => {
      if (headingAnim) headingAnim.kill();
      if (footerScrollTrigger) footerScrollTrigger.kill();
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-html w-embed w-script">
        <style>{`
          .footer-btm {
            will-change: transform;
            display: block !important;
            transform-origin: bottom center !important;
          }

          .footer-heading-line-mask {
            overflow: hidden !important;
            display: block !important;
          }

          .footer-heading-line {
            display: block !important;
            will-change: transform, opacity;
          }

          .footer-link-char {
            display: inline-block;
            transform-origin: center center;
            will-change: transform, text-shadow;
          }
        `}</style>
      </div>

      <div className="footer-wrapper">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-top-left">
            <h2 className="footer-heading">Okay, that&#x27;s enough website</h2>

            <a
              ref={ctaBtnRef}
              data-wf--cta-btn--variant="base"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onOpenContact();
              }}
              className="cta-btn w-inline-block"
            >
              <div className="cta-text">Let&#x27;s Talk</div>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta w-embed">
                  <CtaArrowSvg />
                </div>
              </div>
              <div className="cta-btn-fill-hover" />
            </a>

            <div className="footer-links-block email">
              <div className="footer-link-header">Email &amp; Direct Line</div>
              <a href="mailto:info@nexusczar.com?subject=Project%20Inquiry%20-%20NexusCzar" className="footer-link">
                info@nexusczar.com
              </a>
              <a href="tel:+917086729168" className="footer-link" style={{ marginTop: "0.25rem", opacity: 0.85 }}>
                +91 7086729168
              </a>
            </div>
          </div>

          <div className="footer-top-right">
            <div className="footer-top-right-top">
              <div className="footer-links-block">
                <div className="footer-link-header">Navigation</div>
                <Link href="#projects" className="footer-link">
                  Work
                </Link>
                <Link href="#about" className="footer-link">
                  About us
                </Link>
                <Link href="#services" className="footer-link">
                  Services
                </Link>
                <Link href="#faq" className="footer-link">
                  FAQ
                </Link>
              </div>

              <div className="footer-links-block socials">
                <a
                  href="https://www.linkedin.com/company/nexusczar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-inline-block"
                >
                  <div className="footer-link">LinkedIn</div>
                  <div className="footer-arrow-svg w-embed">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.48418 7.50615L7.33428 0.656055M2.02545 0.484802L7.33428 0.656055L7.50553 5.96488"
                        stroke="white"
                        strokeWidth="0.96875"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/nexusczar_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-inline-block"
                >
                  <div className="footer-link">Instagram</div>
                  <div className="footer-arrow-svg w-embed">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.48418 7.50615L7.33428 0.656055M2.02545 0.484802L7.33428 0.656055L7.50553 5.96488"
                        stroke="white"
                        strokeWidth="0.96875"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61589515696463"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-inline-block"
                >
                  <div className="footer-link">Facebook</div>
                  <div className="footer-arrow-svg w-embed">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.48418 7.50615L7.33428 0.656055M2.02545 0.484802L7.33428 0.656055L7.50553 5.96488"
                        stroke="white"
                        strokeWidth="0.96875"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            <div className="footer-top-right-btm">
              <div className="footer-links-block">
                <a href="https://www.nexusczar.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                  High-Performance Digital Systems
                  <br />
                  Engineered in Greater Noida West
                </a>
              </div>
              <div className="footer-address">
                Grandthum, Techzone 4,
                <br />
                Greater Noida West, UP, India
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom with Giant Logo and Copyright */}
        <div className="footer-btm">
          <div className="footer-rights-text">© Copyright 2026 - NexusCzar Pvt. Ltd.</div>
          <div className="footer-logo-wrap">
            <div className="footer-svg-logo w-embed">
              <NexusCzarGiantLogo />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Overlay and Texture */}
      <div className="footer-overlay-bg">
        <div className="footer-overlay" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src="/assets/6aaad679fdb9d914f7f52067_footer-texture.svg"
          alt=""
          className="footer-texture"
        />
      </div>
    </footer>
  );
}
