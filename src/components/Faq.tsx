"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaqCatSvg, FaqToggleSvg } from "./svgs";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: 1,
    question: "What kind of projects does NexusCzar take on?",
    answer:
      "We engineer high-performance web applications, custom enterprise software, mobile apps (iOS & Android), and programmatic SEO growth engines. We specialize in end-to-end digital transformations for businesses ready to scale.",
  },
  {
    id: 2,
    question: "How do you structure project pricing?",
    answer:
      "Every project is scoped transparently based on functional architecture, deliverables, and timeline milestones. We offer fixed-scope sprints for predictable delivery as well as dedicated engineering teams for continuous product iteration.",
  },
  {
    id: 3,
    question: "Can you modernize or rebuild existing software?",
    answer:
      "Yes. We specialize in legacy system migrations, performance optimization, and architectural refactoring into modern Next.js, Node.js, and cloud-native microservices with zero operational downtime.",
  },
  {
    id: 4,
    question: "Do you work with international clients outside India?",
    answer:
      "Absolutely. NexusCzar serves clients across India, United Arab Emirates (UAE), the United States, and the United Kingdom with seamless async communication, overlapping timezone coverage, and enterprise SLAs.",
  },
  {
    id: 5,
    question: "What tech stack do you build with?",
    answer:
      "We utilize modern, production-hardened technologies including Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Redis, Tailwind CSS, Docker, AWS, and GCP, optimized for sub-second Core Web Vitals.",
  },
  {
    id: 6,
    question: "How involved does our internal team need to be?",
    answer:
      "We run an agile sprint model with weekly syncs, live staging environments, and shared Jira/Slack channels. You get transparent visibility into code and design without unnecessary meeting fatigue.",
  },
  {
    id: 7,
    question: "How fast can NexusCzar kick off a project?",
    answer:
      "We typically conduct discovery and architectural planning within 48 to 72 hours of project alignment, followed immediately by Sprint 1 execution.",
  },
  {
    id: 8,
    question: "Do you provide post-launch maintenance and SEO management?",
    answer:
      "Yes. We provide continuous SLAs covering 24/7 server monitoring, security patching, Core Web Vitals maintenance, and ongoing programmatic SEO optimization.",
  },
  {
    id: 9,
    question: "How do your SEO and growth engines work?",
    answer:
      "We don't just write meta tags. We architect programmatic SEO pipelines, semantic JSON-LD structured data, clean schema graphs, and sub-second page performance that search engines prioritize.",
  },
  {
    id: 10,
    question: "Where is NexusCzar located?",
    answer:
      "Our headquarters is located at Office B-428, Grandthum, Techzone 4, Greater Noida West, Uttar Pradesh 201306, India. You can visit our studio or connect virtually anytime.",
  },
];

export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const faqItems = Array.from(
      section.querySelectorAll<HTMLElement>(".faq-item, .faq-block")
    ).filter((item) => item.classList.contains("faq-item") || !item.closest(".faq-item"));

    if (!faqItems.length) return;

    let activeItem: HTMLElement | null = null;
    const getOpenWidth = () => (window.innerWidth >= 992 ? "50%" : "75%");

    // 1. Initial State Setup
    faqItems.forEach((item, index) => {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(".faq-block-btm, .faq-answer-block");
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      if (qBlock) {
        qBlock.style.cursor = "pointer";
        qBlock.style.willChange = "width, border-width";
      }
      if (aBlock) {
        aBlock.style.transformOrigin = "right bottom";
        aBlock.style.willChange = "transform, height, opacity";
      }
      if (logo) {
        logo.style.transformOrigin = "center center";
        logo.style.willChange = "transform";
      }
      if (answerText) {
        answerText.style.willChange = "transform, opacity";
      }

      if (index === 0) {
        // First FAQ item opens by default (50% desktop, 75% on < 992px)
        activeItem = item;
        item.classList.add("is-open");
        if (qBlock) {
          gsap.set(qBlock, {
            borderWidth: "1.5px",
            width: getOpenWidth(),
          });
        }
        if (aBlock) {
          gsap.set(aBlock, {
            height: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            overflow: "visible",
            scale: 1,
            opacity: 1,
            transformOrigin: "right bottom",
          });
        }
        if (logo) gsap.set(logo, { scale: 1 });
        if (answerText) gsap.set(answerText, { opacity: 1, y: 0 });
      } else {
        // All other items closed (100% width on all displays, height 0, scale 0)
        item.classList.remove("is-open");
        if (qBlock) {
          gsap.set(qBlock, { borderWidth: "1px", width: "100%" });
        }
        if (aBlock) {
          gsap.set(aBlock, {
            height: 0,
            display: "none",
            overflow: "hidden",
            scale: 0,
            opacity: 0,
            transformOrigin: "right bottom",
          });
        }
        if (logo) gsap.set(logo, { scale: 0 });
        if (answerText) gsap.set(answerText, { opacity: 0, y: 20 });
      }
    });

    // 2. Open Item Timeline
    function openItem(item: HTMLElement) {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(".faq-block-btm, .faq-answer-block");
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      item.classList.add("is-open");

      const openTl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // Step A: Question block width to 50% (desktop) / 75% (<992px), border 1px to 1.5px
      if (qBlock) {
        openTl.to(
          qBlock,
          {
            width: getOpenWidth(),
            borderWidth: "1.5px",
            duration: 0.45,
          },
          0
        );
      }

      // Step B: Answer block expands height from 0 to auto and scales up 0 -> 1 with flex-end alignment
      if (aBlock) {
        gsap.set(aBlock, {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          overflow: "hidden",
          opacity: 1,
        });
        openTl.fromTo(
          aBlock,
          { height: 0, scale: 0 },
          {
            height: "auto",
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
            onComplete: () => {
              gsap.set(aBlock, { overflow: "visible" });
            },
          },
          0.05
        );
      }

      // Step C: Logo scales up
      if (logo) {
        openTl.to(
          logo,
          {
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
          },
          0.15
        );
      }

      // Step D: Answer text animates in from bottom with opacity
      if (answerText) {
        openTl.to(
          answerText,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          0.35
        );
      }
    }

    // 3. Close Item Timeline
    function closeItem(item: HTMLElement) {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(".faq-block-btm, .faq-answer-block");
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      item.classList.remove("is-open");

      const closeTl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
      });

      // Step A: Answer text disappears first
      if (answerText) {
        closeTl.to(
          answerText,
          {
            opacity: 0,
            y: 15,
            duration: 0.22,
            ease: "power2.in",
          },
          0
        );
      }

      // Step B: Logo & Answer block scale down to 0 into bottom-right & collapse height
      if (logo) {
        closeTl.to(
          logo,
          {
            scale: 0,
            duration: 0.25,
            ease: "power2.in",
          },
          0.12
        );
      }

      if (aBlock) {
        gsap.set(aBlock, { overflow: "hidden" });
        closeTl.to(
          aBlock,
          {
            scale: 0,
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(aBlock, { display: "none" });
            },
          },
          0.15
        );
      }

      // Step C: Question block expands back to 100% width on all displays, border back to 1px
      if (qBlock) {
        closeTl.to(
          qBlock,
          {
            width: "100%",
            borderWidth: "1px",
            duration: 0.45,
            ease: "power2.out",
          },
          0.18
        );
      }
    }

    // 4. Resize listener to update active open width across breakpoints
    const handleResize = () => {
      if (activeItem) {
        const qBlock = activeItem.querySelector<HTMLElement>(".question-block");
        if (qBlock) {
          gsap.set(qBlock, { width: getOpenWidth() });
        }
      }
    };
    window.addEventListener("resize", handleResize);

    // 5. Bind Click Triggers (One FAQ always remains open)
    faqItems.forEach((item) => {
      const trigger = item.querySelector<HTMLElement>(".question-block") || item;

      trigger.addEventListener("click", () => {
        // If already open, do nothing (one FAQ must always remain open)
        if (item === activeItem) return;

        // Close currently active item
        if (activeItem) {
          closeItem(activeItem);
        }

        // Open clicked item
        openItem(item);
        activeItem = item;
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="section-faq">
      <div className="section-faq-wrapper">
        {/* Left Sticky Header & Cat Illustration */}
        <div className="faq-left">
          <div className="section-faq-header">
            <div className="about-text">Frequently Asked Questions</div>
            <div className="section-heading-wrapper">
              <h2 className="section-heading left-align">THINGS YOU MIGHT ASK</h2>
            </div>
          </div>

          <div className="cat-svg">
            <div className="code-embed-11 w-embed">
              <FaqCatSvg />
            </div>
          </div>
        </div>

        {/* Right Scrolling Accordion List */}
        <div className="faq-right">
          <div className="faq-html w-embed w-script" />

          <div className="faq-list-wrapper w-dyn-list">
            <div role="list" className="faq-list w-dyn-items">
              {faqData.map((item) => (
                <div key={item.id} role="listitem" className="faq-item w-dyn-item">
                  <div className="faq-block">
                    <div className="question-block">
                      <div className="faq-ques">{item.question}</div>
                    </div>
                    <div className="faq-block-btm">
                      <div className="answer-block">
                        <p className="faq-answer">{item.answer}</p>
                      </div>
                      <div className="faq-logo">
                        <div className="faq-logo-svg w-embed">
                          <FaqToggleSvg />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
