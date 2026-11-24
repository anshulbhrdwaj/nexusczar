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

    // Expose the scroll controls for the contact modal and browser diagnostics.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis = lenis;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ScrollTrigger = ScrollTrigger;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = gsap;
    // ScrollTrigger already observes the native scroll events produced by Lenis.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
