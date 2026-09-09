import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// A crosshair cursor that reads like a CAD/blueprint pointer. Desktop only —
// it disables itself on touch devices and respects reduced-motion.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const overCheck = (e) => {
      setHoveringLink(!!e.target.closest("a, button, [data-cursor-hover]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", overCheck);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", overCheck);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[70] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{ scale: hoveringLink ? 1.8 : 1, opacity: hoveringLink ? 0.9 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-6 h-6"
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-2 bg-cyan" />
        <span className="absolute left-1/2 bottom-0 -translate-x-1/2 w-px h-2 bg-cyan" />
        <span className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-2 bg-cyan" />
        <span className="absolute top-1/2 right-0 -translate-y-1/2 h-px w-2 bg-cyan" />
        <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-amber" />
      </motion.div>
    </motion.div>
  );
}
