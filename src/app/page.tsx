"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ContactModal from "@/components/ContactModal";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ShowcaseMarquee from "@/components/ShowcaseMarquee";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <SmoothScroll>
      <Loader />
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
          <Hero />
          <About />
          <ShowcaseMarquee />
          <Projects />
          <Services />
          <Testimonials />
          <Faq />
        </main>

        <Footer onOpenContact={() => setContactModalOpen(true)} />
      </div>
    </SmoothScroll>
  );
}
