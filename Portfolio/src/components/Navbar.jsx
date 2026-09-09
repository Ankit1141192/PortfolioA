import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const tabs = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "services", label: "services" },
  { id: "projects", label: "projects" },
  { id: "feedback", label: "feedback" },
  { id: "contact", label: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = tabs.map((t) => document.getElementById(t.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => go("hero")}
          className="font-display font-semibold text-paper text-lg tracking-tight flex items-center gap-2"
        >
          <span className="text-cyan font-mono text-sm">&lt;</span>
          Ankit Kumar
          <span className="text-cyan font-mono text-sm">/&gt;</span>
        </button>

        <nav className="hidden md:flex items-center gap-1 font-mono text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className={`relative px-3 py-1.5 rounded-t-md tab-notch transition-colors ${
                active === t.id ? "text-paper bg-panel" : "text-muted hover:text-paper"
              }`}
            >
              {t.label}
              {active === t.id && (
                <motion.span
                  layoutId="navUnderline"
                  className="absolute left-2 right-2 -bottom-px h-[2px] bg-amber"
                />
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => go("contact")}
          className="hidden md:inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold text-sm px-4 py-2 rounded-md hover:bg-amber-dim transition-colors"
        >
          Hire me
        </button>

        <button className="md:hidden text-paper text-2xl" onClick={() => setOpen((o) => !o)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-ink border-b border-line font-mono text-sm"
          >
            <div className="flex flex-col px-6 py-3 gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`text-left py-2 ${active === t.id ? "text-amber" : "text-muted"}`}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={() => go("contact")}
                className="mt-2 bg-amber text-ink font-display font-semibold px-4 py-2 rounded-md text-center"
              >
                Hire me
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
