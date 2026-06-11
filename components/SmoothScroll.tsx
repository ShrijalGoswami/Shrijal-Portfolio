'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from './lenis-bridge';

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling. Lenis drives the scroll position; GSAP's ticker
 * advances it and ScrollTrigger stays in sync via lenis' scroll event.
 * Disabled under prefers-reduced-motion so the OS setting wins.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    // Shared so the opening NameIntro can pause/resume smooth scroll while it plays.
    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
