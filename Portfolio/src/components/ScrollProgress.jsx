import { motion, useScroll, useSpring } from "framer-motion";

// A thin "build progress" bar across the top of the viewport — the one
// orchestrated, non-user-triggered motion cue that runs the whole page.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-cyan via-amber to-cyan z-[60]"
    />
  );
}
