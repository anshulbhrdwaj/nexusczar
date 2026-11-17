"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ContactModal from "@/components/ContactModal";
import AboutHero from "@/components/AboutHero";
import AboutStoryTeam from "@/components/AboutStoryTeam";
import AboutMoodboard from "@/components/AboutMoodboard";
import AboutValues from "@/components/AboutValues";
import AboutWhatWeDo from "@/components/AboutWhatWeDo";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <SmoothScroll>
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      <div
        className="page"
        style={{
          position: "relative",
          overflow: "visible",
          height: "auto",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Navbar onOpenContact={() => setContactModalOpen(true)} />

        <main className="main">
          <section className="section-about-hero">
            <AboutHero />
            <AboutStoryTeam />
          </section>
          <AboutMoodboard />
          <AboutValues />
          <AboutWhatWeDo />
        </main>

        <Footer onOpenContact={() => setContactModalOpen(true)} />
      </div>
    </SmoothScroll>
  );
}
