import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiBriefcase } from "react-icons/fi";
import { useNavigate, useLocation } from "../lib/router";

const tabs = [
  { id: "about", label: "about", path: "/about" },
  { id: "skills", label: "skills", path: "/skills" },
  { id: "services", label: "services", path: "/services" },
  { id: "projects", label: "projects", path: "/projects" },
  { id: "feedback", label: "feedback", path: "/feedback" },
  { id: "contact", label: "contact", path: "/contact" },
 
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
    const isPortal =
      pathname.toLowerCase().includes("appliedjob") ||
      pathname.toLowerCase().includes("applyportal");

    if (isPortal) {
      setActive("appliedJob");
      return;
    }

    const pathNormalized = pathname.replace(/^\//, "").toLowerCase();
    if (pathNormalized && tabs.some((t) => t.id.toLowerCase() === pathNormalized)) {
      setActive(pathNormalized);
      return;
    }

    const sections = tabs
      .filter((t) => !t.isPortal)
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    if (sections.length === 0) return;

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
  }, [pathname]);

  const go = (id, path = `/${id}`) => {
    setOpen(false);
    const isPortalTarget = id === "appliedJob" || path === "/appliedJob";
    const isCurrentlyOnPortal =
      pathname.toLowerCase().includes("appliedjob") ||
      pathname.toLowerCase().includes("applyportal");

    if (isPortalTarget) {
      setActive("appliedJob");
      navigate("/appliedJob");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isCurrentlyOnPortal) {
      // Navigate back to home first, then scroll to section
      navigate(id === "hero" ? "/" : path);
      setTimeout(() => {
        if (id === "hero") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
      return;
    }

    // Already on home page
    navigate(id === "hero" ? "/" : path);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => go("hero", "/")}
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
              onClick={() => go(t.id, t.path)}
              className={`relative px-3 py-1.5 rounded-t-md tab-notch transition-colors flex items-center gap-1.5 ${
                active === t.id ? "text-paper bg-panel" : "text-muted hover:text-paper"
              } ${t.isPortal ? "text-cyan/90 hover:text-cyan" : ""}`}
            >
              {t.isPortal && <FiBriefcase size={12} className="text-cyan" />}
              {t.label}
              {t.isPortal && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-cyan/15 text-cyan border border-cyan/30">
                  Portal
                </span>
              )}
              {active === t.id && (
                <motion.span
                  layoutId="navUnderline"
                  className="absolute left-2 right-2 -bottom-px h-[2px] bg-amber"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => go("contact", "/contact")}
            className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold text-sm px-4 py-2 rounded-md hover:bg-amber-dim transition-colors"
          >
            Hire me
          </button>
        </div>

        <button
          className="md:hidden text-paper text-2xl"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
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
                  onClick={() => go(t.id, t.path)}
                  className={`text-left py-2 flex items-center justify-between ${
                    active === t.id ? "text-amber font-semibold" : "text-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {t.isPortal && <FiBriefcase size={13} className="text-cyan" />}
                    {t.label}
                  </span>
                  {t.isPortal && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan/15 text-cyan border border-cyan/30">
                      Portal
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => go("contact", "/contact")}
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
