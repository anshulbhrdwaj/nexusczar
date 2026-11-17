"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { NexusCzarLogo } from "./svgs";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTlRef = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);
  const isOpenedRef = useRef(false);
  const handleCloseRef = useRef<((immediate?: boolean) => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Ensure scroll lock is always cleared on unmount
      if (isOpenedRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.start === "function") lenis.start();
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    };
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const transitionPath = modal.querySelector(
      ".contact-transition svg path, .svg-tcontact svg path"
    ) as SVGPathElement | null;
    const closeBtn = modal.querySelector(".close-btn") as HTMLElement | null;
    const closeBtnText = modal.querySelector(".back-btn-txt") as HTMLElement | null;
    const contactLogo = modal.querySelector(".navbar-logo-contact") as HTMLElement | null;
    const contactContent = modal.querySelector(".contact-content") as HTMLElement | null;
    const contactHeadings = Array.from(modal.querySelectorAll(".contact-heading")) as HTMLElement[];
    const contactParas = Array.from(modal.querySelectorAll(".contact-para")) as HTMLElement[];
    const emailHeadings = Array.from(modal.querySelectorAll(".email-heading")) as HTMLElement[];
    const emailLinks = Array.from(modal.querySelectorAll(".email-link")) as HTMLElement[];
    const contactSocials = Array.from(modal.querySelectorAll(".contact-social")) as HTMLElement[];
    const contactImg = modal.querySelector(".contact-img") as HTMLElement | null;

    // 1. Lock/Unlock Scroll
    const lockScroll = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
      }
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    };

    const unlockScroll = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };

    // 2. Prepare Split Elements & Masks
    let headingChars: HTMLElement[] = [];
    contactHeadings.forEach((heading) => {
      if (!heading.dataset.split) {
        heading.dataset.split = "true";
        const words = heading.textContent?.trim().split(" ") || [];
        heading.innerHTML = words
          .map(
            (w) =>
              `<span style="display:inline-block;white-space:nowrap;">` +
              w
                .split("")
                .map(
                  (c) =>
                    `<span class="contact-heading-char" style="display:inline-block;will-change:transform,opacity,text-shadow;">${c}</span>`
                )
                .join("") +
              `</span>`
          )
          .join(" ");
      }
      headingChars = headingChars.concat(
        Array.from(heading.querySelectorAll(".contact-heading-char"))
      );
    });

    let paraLines: HTMLElement[] = [];
    contactParas.forEach((para) => {
      if (!para.dataset.split) {
        para.dataset.split = "true";
        const raw = para.innerHTML.trim();
        para.innerHTML = `<span class="contact-para-line-mask" style="display:block;overflow:hidden;"><span class="contact-para-line" style="display:block;will-change:transform,opacity;">${raw}</span></span>`;
      }
      paraLines = paraLines.concat(
        Array.from(para.querySelectorAll(".contact-para-line"))
      );
    });

    let emailHeadingWords: HTMLElement[] = [];
    emailHeadings.forEach((eh) => {
      if (!eh.dataset.split) {
        eh.dataset.split = "true";
        const raw = eh.textContent?.trim().split(" ") || [];
        eh.innerHTML = raw
          .map(
            (w) =>
              `<span class="contact-word-mask" style="display:inline-block;overflow:hidden;margin-right:0.25em;"><span class="contact-word" style="display:inline-block;will-change:transform,opacity;">${w}</span></span>`
          )
          .join("");
      }
      emailHeadingWords = emailHeadingWords.concat(
        Array.from(eh.querySelectorAll(".contact-word"))
      );
    });

    // Email link letter kinetic hover setup
    emailLinks.forEach((el) => {
      if (!el.dataset.charsSplit) {
        el.dataset.charsSplit = "true";
        const text = el.textContent || "";
        el.innerHTML = text
          .split("")
          .map((c) => (c === " " ? "&nbsp;" : `<span class="contact-email-char" style="display:inline-block;will-change:transform;">${c}</span>`))
          .join("");

        const chars = Array.from(el.querySelectorAll(".contact-email-char")) as HTMLElement[];
        el.addEventListener("mouseenter", () => {
          chars.forEach((c) => {
            gsap.to(c, {
              scale: 1.15,
              rotation: gsap.utils.random(-8, 8),
              duration: 0.25,
              ease: "back.out(2)",
              overwrite: "auto",
            });
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(chars, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }
    });

    // 3. Reset Modal Elements to Hidden State
    const resetElements = () => {
      if (openTlRef.current) openTlRef.current.kill();

      if (contactContent) gsap.set(contactContent, { opacity: 1, y: 0 });
      if (contactLogo) gsap.set(contactLogo, { scale: 0, opacity: 0, transformOrigin: "center center" });
      if (closeBtn) {
        gsap.set(closeBtn, { opacity: 0, scale: 0.4, y: 20, transformOrigin: "center center" });
        if (closeBtnText) gsap.set(closeBtnText, { opacity: 0, y: 15, display: "inline-block" });
      }
      if (transitionPath) {
        const totalLen = transitionPath.getTotalLength ? transitionPath.getTotalLength() : 4000;
        gsap.set(transitionPath, {
          strokeDasharray: totalLen,
          strokeDashoffset: totalLen,
          strokeWidth: "0px",
        });
      }
      if (headingChars.length) {
        gsap.set(headingChars, { opacity: 0, scale: 0.5, rotation: 0, textShadow: "0px 0px 0px rgba(0,0,0,0)" });
      }
      if (paraLines.length) gsap.set(paraLines, { y: "115%", opacity: 0 });
      if (emailHeadingWords.length) gsap.set(emailHeadingWords, { y: "105%", opacity: 0 });
      if (emailLinks.length) gsap.set(emailLinks, { opacity: 0, y: 15 });
      if (contactSocials.length) {
        gsap.set(contactSocials, { opacity: 0, scale: 0.4, y: 20, transformOrigin: "center center" });
        contactSocials.forEach((pill) => {
          const pillText = pill.querySelector(".contact-social-link");
          if (pillText) gsap.set(pillText, { opacity: 0, y: 15, display: "inline-block" });
        });
      }
      if (contactImg) {
        gsap.set(contactImg, {
          opacity: 0,
          scale: 0.8,
          rotation: gsap.utils.random(-3, 3),
          transformOrigin: "bottom center",
        });
      }
    };

    // 4. Modal Close Animation Definition
    const handleClose = (immediate = false) => {
      if (isClosingRef.current) return;
      if (!isOpenedRef.current && !modal.classList.contains("is-active")) {
        onClose();
        return;
      }

      isClosingRef.current = true;
      if (openTlRef.current) {
        openTlRef.current.kill();
        openTlRef.current = null;
      }
      if (closeTlRef.current) {
        closeTlRef.current.kill();
        closeTlRef.current = null;
      }

      const finishClose = () => {
        modal.classList.remove("is-active");
        modal.style.display = "none";
        modal.style.visibility = "hidden";
        modal.style.pointerEvents = "none";
        modal.style.backgroundColor = "transparent";
        unlockScroll();
        resetElements();
        isClosingRef.current = false;
        isOpenedRef.current = false;
        onClose();
      };

      if (immediate) {
        finishClose();
        return;
      }

      modal.style.backgroundColor = "transparent";

      const closeTl = gsap.timeline({
        onComplete: finishClose,
      });
      closeTlRef.current = closeTl;

      closeTl.to(
        [closeBtn, contactContent, ...contactSocials].filter(Boolean),
        { opacity: 0, y: -15, duration: 0.28, ease: "power2.in" },
        0
      );

      if (contactLogo) {
        closeTl.to(contactLogo, { opacity: 0, scale: 0.85, duration: 0.28, ease: "power2.in" }, 0);
      }

      if (contactImg) {
        closeTl.to(contactImg, { opacity: 0, scale: 0.85, duration: 0.28, ease: "power2.in" }, 0);
      }

      if (transitionPath) {
        const totalLen = transitionPath.getTotalLength ? transitionPath.getTotalLength() : 4000;
        closeTl.to(
          transitionPath,
          {
            strokeDashoffset: totalLen,
            strokeWidth: "0px",
            duration: 0.35,
            ease: "power2.in",
          },
          0.05
        );
      }
    };

    handleCloseRef.current = handleClose;

    // 5. Modal Open/Close State Execution
    if (isOpen) {
      if (!isOpenedRef.current) {
        isClosingRef.current = false;
        isOpenedRef.current = true;
        modal.classList.add("is-active");
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.pointerEvents = "auto";
        lockScroll();
        resetElements();

        const openTl = gsap.timeline();
        openTlRef.current = openTl;

        // A. Liquid SVG transition wave
        if (transitionPath) {
          const totalLen = transitionPath.getTotalLength ? transitionPath.getTotalLength() : 4000;
          openTl.fromTo(
            transitionPath,
            { strokeDashoffset: totalLen, strokeWidth: "0px" },
            {
              strokeDashoffset: 0,
              strokeWidth: "1600px",
              duration: 0.9,
              ease: "power2.inOut",
            },
            0
          );

          // Seamlessly solidify teal background as stroke reaches full coverage
          openTl.to(
            modal,
            {
              backgroundColor: "#2f849c",
              duration: 0.35,
              ease: "power1.in",
            },
            0.55
          );
        }

        const contentStart = transitionPath ? 0.45 : 0;

        // B. Logo & Close Button
        if (contactLogo) {
          openTl.to(
            contactLogo,
            { scale: 1, opacity: 1, duration: 0.65, ease: "back.out(2.2)" },
            contentStart
          );
        }

        if (closeBtn) {
          openTl.to(
            closeBtn,
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(2.5)" },
            contentStart + 0.1
          );
          if (closeBtnText) {
            openTl.to(
              closeBtnText,
              { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
              contentStart + 0.22
            );
          }
        }

        // C. Headings Kinetic Pop
        if (headingChars.length) {
          headingChars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-6, 6);
            const charStart = contentStart + 0.15 + idx * 0.022;

            openTl.to(
              char,
              {
                opacity: 1,
                scale: 1.1,
                rotation: randomTilt,
                textShadow:
                  "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
                duration: 0.45,
                ease: "back.out(2)",
              },
              charStart
            );

            openTl.to(
              char,
              {
                scale: 1,
                rotation: 0,
                textShadow: "0px 0px 0px rgba(0,0,0,0)",
                duration: 0.6,
                ease: "power2.out",
              },
              charStart + 0.45
            );
          });
        }

        // D. Paragraph Lines
        if (paraLines.length) {
          openTl.to(
            paraLines,
            {
              y: "0%",
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "back.out(1.4)",
            },
            contentStart + 0.3
          );
        }

        // E. Email Headings & Links
        if (emailHeadingWords.length) {
          openTl.to(
            emailHeadingWords,
            {
              y: "0%",
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            contentStart + 0.25
          );
        }

        if (emailLinks.length) {
          openTl.to(
            emailLinks,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "back.out(1.5)",
            },
            contentStart + 0.35
          );
        }

        // F. Social Pills
        if (contactSocials.length) {
          contactSocials.forEach((pill, i) => {
            const pillStart = contentStart + 0.45 + i * 0.12;
            const pillText = pill.querySelector(".contact-social-link");

            openTl.to(
              pill,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: "back.out(2.5)",
              },
              pillStart
            );

            if (pillText) {
              openTl.to(
                pillText,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "back.out(1.6)",
                },
                pillStart + 0.15
              );
            }
          });
        }

        // G. Contact Pet Illustration Pop
        if (contactImg) {
          openTl.to(
            contactImg,
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.75,
              ease: "back.out(1.8)",
            },
            contentStart + 0.4
          );
        }
      }
    } else {
      if (isOpenedRef.current && !isClosingRef.current) {
        handleClose(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (isOpen || isOpenedRef.current)) {
        e.preventDefault();
        handleClose();
      }
    };

    const handleNativeCloseClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    if (closeBtn) {
      closeBtn.addEventListener("click", handleNativeCloseClick);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (closeBtn) {
        closeBtn.removeEventListener("click", handleNativeCloseClick);
      }
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div ref={modalRef} className={`contact-page ${isOpen ? "is-active" : ""}`} data-contact-page="true">
      {/* Authentic Two26 Functional CSS Embed */}
      <style>{`
        .contact-page {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          width: 100svw !important;
          height: 100vh !important;
          height: 100svh !important;
          max-height: 100svh !important;
          z-index: 9999999 !important;
          display: none;
          visibility: hidden;
          pointer-events: none;
          overflow: hidden !important;
          overflow-y: hidden !important;
          overflow-x: hidden !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .contact-page::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .contact-page.is-active {
          display: flex !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }

        .contact-transition,
        .svg-tcontact {
          pointer-events: none;
        }

        .contact-transition svg,
        .svg-tcontact svg {
          overflow: visible;
        }

        .contact-heading-char {
          display: inline-block;
          will-change: transform, opacity, text-shadow;
          transform-origin: center center;
        }

        .contact-para-line-mask {
          overflow: hidden !important;
          display: block !important;
        }

        .contact-para-line {
          display: block !important;
          will-change: transform, opacity;
        }

        .email-heading,
        .contact-right .email-heading {
          white-space: nowrap !important;
          word-break: keep-all !important;
        }

        .contact-word-mask {
          overflow: hidden !important;
          display: inline-block !important;
          white-space: nowrap !important;
          vertical-align: top !important;
        }

        .contact-word {
          display: inline-block !important;
          white-space: nowrap !important;
          will-change: transform, opacity;
        }

        .email-link,
        .contact-right .email-link {
          white-space: nowrap !important;
          word-break: keep-all !important;
          overflow: visible !important;
          display: inline-block !important;
          cursor: pointer;
        }

        .contact-email-char {
          display: inline-block;
          transform-origin: center center;
          will-change: transform, text-shadow;
        }

        .contact-social {
          will-change: transform, opacity;
        }

        .contact-img-wrap {
          overflow: visible !important;
          contain: none !important;
          display: flex !important;
          align-items: flex-end !important;
          justify-content: center !important;
          pointer-events: none !important;
        }

        .contact-img-wrap img,
        .contact-img {
          overflow: visible !important;
          max-height: 52vh !important;
          max-height: 52svh !important;
          width: auto !important;
          max-width: 85vw !important;
          object-fit: contain !important;
          display: block !important;
          transform-origin: bottom center !important;
          will-change: transform, opacity;
        }

        .close-btn {
          cursor: pointer !important;
          pointer-events: auto !important;
          position: relative !important;
          z-index: 100000 !important;
          user-select: none !important;
        }

        .close-btn * {
          pointer-events: none !important;
        }

        @media (max-width: 767px) {
          .contact-img-wrap img,
          .contact-img {
            max-height: 35svh !important;
            width: auto !important;
            object-fit: contain !important;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <div className="contact-navbar">
        <div className="navbar-logo-contact">
          <div className="logo-svg w-embed" style={{ filter: "brightness(0) invert(1)" }}>
            <NexusCzarLogo />
          </div>
        </div>
        <div className="close-btn-wrapper">
          <a
            href="#close"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (handleCloseRef.current) {
                handleCloseRef.current();
              } else {
                onClose();
              }
            }}
            className="close-btn w-inline-block"
            aria-label="Close Contact Modal"
          >
            <div className="back-arrow w-embed">
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.86328 0.5L0.499281 6.864M6.86328 6.864L0.499281 0.5" stroke="black" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="back-btn-txt">Close</div>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="contact-content">
        <div className="contact-left">
          <h2 className="contact-heading">want to</h2>
          <h2 className="contact-heading">start</h2>
          <h2 className="contact-heading right">a new</h2>
          <h2 className="contact-heading left">project?</h2>
          <p className="contact-para left">or just say hello!</p>
        </div>

        <div className="contact-right">
          <div className="contact-email-wrap">
            <div className="email-heading">Inquiries &amp; Commissions</div>
            <a href="mailto:info@nexusczar.com?subject=Inquiries%20%26%20commissions" className="email-link">
              info@nexusczar.com
            </a>
            <a href="tel:+917086729168" className="email-link" style={{ fontSize: "1.25em", opacity: 0.9, marginTop: "0.25em" }}>
              +91 7086729168
            </a>
          </div>
          <div className="contact-email-wrap">
            <div className="email-heading">Job Applications</div>
            <a href="mailto:careers@nexusczar.com?subject=Job%20Applications" className="email-link">
              careers@nexusczar.com
            </a>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <a
        href="https://www.linkedin.com/company/nexusczar"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-social right w-inline-block"
      >
        <div className="icon w-embed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.2725 0.150391C22.6809 0.150391 23.8496 1.31911 23.8496 2.72754V21.2725C23.8496 22.6809 22.6809 23.8496 21.2725 23.8496H2.72754C1.31911 23.8496 0.150391 22.6809 0.150391 21.2725V2.72852C0.155784 2.04633 0.428741 1.39352 0.911133 0.911133C1.33331 0.488956 1.88594 0.226532 2.47461 0.164062L2.72852 0.150391H21.2725ZM2.72754 2.03223C2.33379 2.03223 2.03223 2.33379 2.03223 2.72754V21.2695C2.03032 21.3617 2.04666 21.4535 2.08008 21.54C2.15858 21.6706 2.27471 21.7828 2.41406 21.8623C2.50853 21.9168 2.61331 21.9472 2.7207 21.9512L2.72754 21.9688H21.2725C21.6662 21.9688 21.9678 21.6672 21.9678 21.2734V2.72754C21.9678 2.33379 21.6662 2.03223 21.2725 2.03223H2.72754Z"
              fill="white"
            />
            <path d="M6.02734 7.6416H8.97234V18.3584H6.02734V7.6416Z" fill="white" />
            <path d="M7.5 3.6416C6.5335 3.6416 5.75 4.4251 5.75 5.3916C5.75 6.3581 6.5335 7.1416 7.5 7.1416C8.4665 7.1416 9.25 6.3581 9.25 5.3916C9.25 4.4251 8.4665 3.6416 7.5 3.6416Z" fill="white" />
            <path d="M10.8633 7.6416H13.6843V9.1066C14.0903 8.3376 15.0883 7.4246 16.7583 7.4246C19.7893 7.4246 20.3543 9.4186 20.3543 12.0086V18.3586H17.4093V13.1256C17.4093 11.8786 17.3843 10.2726 15.6723 10.2726C13.9353 10.2726 13.6693 11.6286 13.6693 13.0346V18.3586H10.8633V7.6416Z" fill="white" />
          </svg>
        </div>
        <div className="contact-social-link">Linkedin</div>
      </a>

      <a
        href="https://www.instagram.com/nexusczar_/"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-social left w-inline-block"
      >
        <div className="icon w-embed">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="white" strokeWidth="1.5" />
            <path d="M17.5 6.51L17.51 6.49889" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="contact-social-link">Instagram</div>
      </a>

      {/* Decorative Character Pet Graphic */}
      <div className="contact-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nexusczar/contact.svg"
          loading="lazy"
          alt="NexusCzar Contact"
          className="contact-img"
        />
      </div>

      {/* Liquid Transition Wipe SVG */}
      <div className="contact-transition">
        <div className="svg-tcontact w-embed">
          <svg width="100%" height="auto" viewBox="0 0 998 901" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M372.5 886C372.5 886 879.181 886 855 766.5C801.982 504.5 19.5 1042.52 19.5 646.5C19.5 316.5 952.535 583.56 978 318.5C1000 89.5 193.6 431.263 111 221C34.6544 26.6589 565 19 565 19"
              stroke="#2f849c"
              strokeWidth="1600"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
}
