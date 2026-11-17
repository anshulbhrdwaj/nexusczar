"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      infinite: false,
      duration: isTouch ? 1.0 : 1.35,
      wheelMultiplier: 0.9,
      touchMultiplier: isTouch ? 1.4 : 2.0,
      syncTouch: false,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Connect Lenis with GSAP ScrollTrigger
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis = lenis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ScrollTrigger = ScrollTrigger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = gsap;
    lenis.on("scroll", ScrollTrigger.update);
    window.addEventListener("scroll", ScrollTrigger.update, { passive: true });

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
