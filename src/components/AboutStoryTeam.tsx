"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TeamSocial {
  name: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  paragraphs: string[];
  socials: TeamSocial[];
}

const teamMembers: TeamMember[] = [
  {
    id: "aarav",
    name: "Aarav Sharma",
    role: "Founding Architect & Tech Lead",
    image: "/nexusczar/team/member2.avif",
    paragraphs: [
      "Full-stack cloud architect and founding tech lead at NexusCzar. Specializes in Next.js web applications, high-throughput backend microservices, and distributed cloud systems.",
      "Obsessed with sub-second page performance, zero-trust cloud architecture, and building production-grade software that scales seamlessly under heavy enterprise load.",
    ],
    socials: [
      { name: "LinkedIn", url: "https://www.linkedin.com" },
      { name: "GitHub", url: "https://github.com" },
    ],
  },
  {
    id: "rhea",
    name: "Rhea Mehta",
    role: "Design Principal & Creative Director",
    image: "/nexusczar/team/member1.avif",
    paragraphs: [
      "Design Principal leading UI/UX architecture, brand identity, and fluid design systems. Combines typography, vector illustration, and kinetic interaction design into friction-free product experiences.",
      "Believes that visual craft and engineering precision are inseparable. Questioning briefs, refining design systems, and pushing the boundaries of interactive web craft.",
    ],
    socials: [
      { name: "LinkedIn", url: "https://www.linkedin.com" },
      { name: "Twitter", url: "https://twitter.com" },
    ],
  },
  {
    id: "vikram",
    name: "Vikram Sen",
    role: "Growth Architect & Performance Lead",
    image: "/nexusczar/team/member3.avif",
    paragraphs: [
      "Specializes in programmatic SEO infrastructure, semantic structured schema (JSON-LD), Core Web Vitals optimization, and high-ROAS conversion funnels.",
      "Bridges the gap between technical web engineering and organic market capture, engineering scalable acquisition pipelines that turn traffic into compounding revenue.",
    ],
    socials: [
      { name: "LinkedIn", url: "https://www.linkedin.com" },
    ],
  },
];

export default function AboutStoryTeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SVG Icons for Social Links
  const renderSocialIcon = (name: string) => {
    const key = name.toLowerCase();
    if (key === "linkedin") {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
        </svg>
      );
    }
    if (key === "github") {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
        </svg>
      );
    }
    // Twitter / X / Default
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    const motion = gsap.matchMedia(container);
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const storyPath = container.querySelector(".about-story-line");

      if (storyPath) {
        gsap.fromTo(
          storyPath,
          { attr: { "stroke-dasharray": "1 1", "stroke-dashoffset": 1 } },
          {
            attr: { "stroke-dashoffset": 0 },
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              end: "bottom bottom",
              scrub: 0.8,
            },
          },
        );
      }

      // Story and team entrances
      const storySections = Array.from(
        container.querySelectorAll(".about-story-section")
      ) as HTMLElement[];

      storySections.forEach((section) => {
        const img = section.querySelector(".about-story-img");
        const text = section.querySelector(".about-story-right");

        if (img && text) {
          gsap.fromTo(
            [img, text],
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.15,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                once: true,
              },
            }
          );
        }
      });

      const teamCards = Array.from(
        container.querySelectorAll(".team-card")
      ) as HTMLElement[];

      if (teamCards.length) {
        gsap.fromTo(
          teamCards,
          { opacity: 0, y: 55, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.14,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: container.querySelector(".about-team-btm"),
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    });

    return () => motion.revert();
  }, []);

  // Open modal with physical elastic expansion from source card
  const handleOpenModal = (sourceCard: HTMLElement, member: TeamMember) => {
    setActiveMember(member);
    setIsModalOpen(true);

    requestAnimationFrame(() => {
      const overlay = modalOverlayRef.current;
      const card = modalCardRef.current;
      if (!overlay || !card) return;

      overlay.classList.add("is-active");

      const sourceRect = sourceCard.getBoundingClientRect();
      const popupRect = card.getBoundingClientRect();

      const dx =
        sourceRect.left +
        sourceRect.width / 2 -
        (popupRect.left + popupRect.width / 2);
      const dy =
        sourceRect.top +
        sourceRect.height / 2 -
        (popupRect.top + popupRect.height / 2);
      const scaleX = Math.max(sourceRect.width / popupRect.width, 0.25);
      const scaleY = Math.max(sourceRect.height / popupRect.height, 0.25);

      const expandTl = gsap.timeline();

      expandTl
        .fromTo(
          card,
          {
            x: dx,
            y: dy,
            scaleX: scaleX,
            scaleY: scaleY,
            opacity: 0.5,
            borderRadius: "16px",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            borderRadius: "1.5em",
            duration: 0.65,
            ease: "back.out(1.4)",
          },
          0
        )
        .fromTo(
          card.querySelectorAll(".team-popup-name, .team-popup-role, .team-popup-body p, .team-popup-pill"),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
          },
          0.16
        )
        .fromTo(
          card.querySelector(".team-popup-close-btn"),
          { scale: 0, opacity: 0, rotation: -90 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.45,
            ease: "back.out(2.5)",
          },
          0.28
        );
    });
  };

  // Close modal with shrink
  const handleCloseModal = () => {
    const overlay = modalOverlayRef.current;
    const card = modalCardRef.current;
    if (!overlay || !card) {
      setIsModalOpen(false);
      setActiveMember(null);
      return;
    }

    gsap.to(card, {
      scale: 0.88,
      opacity: 0,
      duration: 0.25,
      ease: "power2.inOut",
      onComplete: () => {
        overlay.classList.remove("is-active");
        setIsModalOpen(false);
        setActiveMember(null);
        gsap.set(card, { clearProps: "all" });
      },
    });
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div ref={containerRef} className="about-story-team">
      <div className="about-story-team-wrapper">
        {/* Story Section 1 & 2 */}
        <div className="about-story">
          <div className="about-story-section">
            <div className="about-story-svg-wrap">
              <Image
                src="/nexusczar/about-story.webp"
                alt="NexusCzar Origin"
                width={1536}
                height={1620}
                sizes="(max-width: 479px) 30vw, (max-width: 767px) 55vw, (max-width: 1920px) 47vw, 900px"
                className="about-story-img"
              />
            </div>
            <div className="about-story-right">
              <div className="about-story-text">HOW WE STARTED</div>
              <h2 className="about-story-heading">
                Engineered from code, driven by craft and radical ownership.
              </h2>
              <p className="about-story-para">
                NexusCzar started with a clear observation: high-growth businesses don’t need bloated agency layers, they need elite software architecture, precision design, and programmatic growth engines that actually deliver. What started as direct engineering partnerships with ambitious founders quickly compounded into an end-to-end digital studio.
              </p>
            </div>
          </div>

          <div className="about-story-section">
            <div className="about-story-right">
              <div className="about-story-text">NOW WE’RE HERE</div>
              <h2 className="about-story-heading">Less fluff, more velocity</h2>
              <p className="about-story-para">
                We operate as a high-density, senior technical core team, supported by specialist collaborators when a problem demands deep domain mastery. You work directly with the principal architects and creative directors building your system — no bloated agency tiers or account managers playing telephone. It means rapid execution, bespoke attention, and measurable ROI.
              </p>
            </div>
            <div className="about-story-svg-wrap">
              <Image
                src="/nexusczar/chair.svg"
                alt="NexusCzar Operations"
                width={380}
                height={380}
                className="about-story-img"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="about-team">
          <div className="section-projects-header">
            <div className="section-about-text">THE TEAM</div>
            <div className="section-heading-wrapper">
              <h2 className="section-heading">THIS IS PRETTY MUCH EVERYONE</h2>
            </div>
          </div>

          <div className="about-team-btm">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="team-card"
                onClick={(e) => handleOpenModal(e.currentTarget, member)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${member.name}`}
              >
                <div className="team-img-wrapper">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={450}
                    height={560}
                    sizes="(max-width: 479px) 80vw, (max-width: 1920px) 32vw, 615px"
                    className="team-img"
                  />
                </div>
                <div className="team-name">{member.name}</div>
                <div className="team-sub">{member.role}</div>
              </div>
            ))}
          </div>

          <div className="texture-bg"></div>
        </div>
      </div>

      <div className="about-story-scroll-path" aria-hidden="true">
        <div className="about-story-svg">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 1440 3457"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="about-story-line"
              pathLength={1}
              d="M723.846 50.0081C650.835 174.483 836.793 262.47 825.385 406.936C799.653 732.805 98.5142 598.392 111.169 948.003C123.495 1288.51 1122.55 1135.95 1155.5 1698.51C1177.93 2081.41 570.052 2505.13 400.796 2311.05C308.932 2205.72 378.305 2027.34 533.817 2045.1C673.838 2061.1 699.146 2203.11 688.426 2277.8C675.634 2366.928 651.903 2474.012 637.786 2590.066"
              stroke="#2f849c"
              strokeWidth="100"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Expanding Team Popup Modal */}
      {isModalOpen && activeMember && (
        <div
          ref={modalOverlayRef}
          className="team-popup-overlay"
          onClick={(e) => {
            if (e.target === modalOverlayRef.current) {
              handleCloseModal();
            }
          }}
        >
          <div
            ref={modalCardRef}
            className="team-popup-card"
            role="dialog"
            aria-modal="true"
          >
            <button
              className="team-popup-close-btn"
              onClick={handleCloseModal}
              aria-label="Close popup"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="team-popup-img-wrap">
              <Image
                src={activeMember.image}
                alt={activeMember.name}
                width={500}
                height={600}
                className="team-popup-img"
              />
            </div>

            <div className="team-popup-content">
              <div>
                <div className="team-popup-header">
                  <h3 className="team-popup-name">{activeMember.name}</h3>
                  <p className="team-popup-role">{activeMember.role}</p>
                </div>

                <div className="team-popup-body" style={{ marginTop: "1.25em" }}>
                  {activeMember.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {activeMember.socials.length > 0 && (
                <div className="team-popup-socials">
                  {activeMember.socials.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-popup-pill"
                    >
                      {renderSocialIcon(soc.name)}
                      <span>{soc.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
