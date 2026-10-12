import { useEffect, type RefObject } from "react";

/**
 * Drifts an element a few pixels as the page scrolls. The one motion on the site;
 * disabled when the visitor prefers reduced motion.
 */
export function useDrift(ref: RefObject<HTMLElement | null>, factor = 0.06, max = 28) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = Math.min(window.scrollY * factor, max);
      element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.transform = "";
    };
  }, [ref, factor, max]);
}
