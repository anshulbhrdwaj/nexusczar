"use client";

import { useId, useRef, useState, type TouchEvent } from "react";
import {
  ArrowRight,
  Boxes,
  CloudUpload,
  FileCheck,
  LayoutTemplate,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const capabilities = [
  { name: "Build", title: "Websites & custom apps" },
  { name: "Market", title: "SEO & paid media" },
  { name: "Scale", title: "Cloud & automation" },
] as const;

const releaseSteps = [
  { name: "Preview", Icon: Boxes },
  { name: "Checks", Icon: ShieldCheck },
  { name: "Deploy", Icon: CloudUpload },
];

const previews = [
  <div key="build" className="hero-preview-window">
    <div className="hero-preview-bar">
      <PanelsTopLeft />
      <span>Client portal</span>
    </div>
    <div className="hero-portal">
      <div className="hero-portal-nav">
        <LayoutTemplate className="hero-portal-selected" />
        <UsersRound />
        <FileCheck />
      </div>
      <div className="hero-portal-content">
        <strong>Project workspace</strong>
        <div className="hero-portal-row">
          <FileCheck />
          Documents
        </div>
        <div className="hero-portal-row">
          <UsersRound />
          Team access
        </div>
      </div>
    </div>
  </div>,
  <div key="market" className="hero-preview-window hero-search-preview">
    <div className="hero-preview-bar">
      <Search />
      <span>Search preview</span>
    </div>
    <div className="hero-search-result">
      <span className="hero-search-source">Your website <span aria-hidden="true">›</span> Services</span>
      <strong>Services &amp; solutions</strong>
      <span>Help customers find what you offer.</span>
    </div>
  </div>,
  <div key="scale" className="hero-preview-window">
    <div className="hero-preview-bar">
      <CloudUpload />
      <span>Release pipeline</span>
    </div>
    <div className="hero-release-steps">
      {releaseSteps.map(({ name, Icon }, index) => (
        <div className="hero-release-step" key={name}>
          <span className="hero-release-icon"><Icon /></span>
          <span>{name}</span>
          {index < releaseSteps.length - 1 && <ArrowRight className="hero-release-arrow" />}
        </div>
      ))}
    </div>
  </div>,
];

export default function HeroCapabilities() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const gestureStart = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    gestureStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = gestureStart.current;
    const touch = event.changedTouches[0];
    gestureStart.current = null;
    if (!start || !touch) return;

    const distanceX = touch.clientX - start.x;
    const distanceY = touch.clientY - start.y;
    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) <= Math.abs(distanceY)) return;

    const direction = distanceX < 0 ? 1 : -1;
    setActive((current) => (current + direction + capabilities.length) % capabilities.length);
  }

  return (
    <div className="hero-engine-container">
      <div className="hero-engine-pills" role="group" aria-label="Explore our capabilities">
        {capabilities.map(({ name }, index) => (
          <button
            key={name}
            type="button"
            className="hero-engine-pill-btn"
            aria-pressed={active === index}
            aria-controls={`${panelId}-${name}`}
            onClick={() => setActive(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        className="hero-engine-grid"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { gestureStart.current = null; }}
      >
        {capabilities.map(({ name, title }, index) => (
          <article
            id={`${panelId}-${name}`}
            key={name}
            className="hero-engine-card"
            data-stage={name.toLowerCase()}
            data-active={active === index}
          >
            <header className="hero-engine-card-header">
              <span className="hero-engine-tag">{name}</span>
              <h2 className="hero-engine-title">{title}</h2>
            </header>
            <div className="hero-engine-preview" aria-hidden="true">
              {previews[index]}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
