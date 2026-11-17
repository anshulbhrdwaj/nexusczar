"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ContactModal from "@/components/ContactModal";
import WorkHero from "@/components/WorkHero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function WorkPage() {
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
          <WorkHero />
          <Projects hideHeader={true} />
        </main>

        <Footer onOpenContact={() => setContactModalOpen(true)} />
      </div>
    </SmoothScroll>
  );
}
