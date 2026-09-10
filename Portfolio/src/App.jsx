import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "./lib/router";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ApplyPortal from "./components/ApplyPortal";

function MainPortfolio() {
  const { pathname } = useLocation();

  useEffect(() => {
    const rawPath = pathname.replace(/^\//, "").toLowerCase();
    const targetMap = {
      testimonials: "feedback",
      feedback: "feedback",
      work: "projects",
    };
    const targetId = targetMap[rawPath] || rawPath;

    if (targetId && targetId !== "hero") {
      const el = document.getElementById(targetId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else if (rawPath === "" || rawPath === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Services />
      <Projects />
      <Testimonials />
      <Achievements />
      <Contact />
    </main>
  );
}

function AppContent() {
  return (
    <div className="bg-ink min-h-screen font-body text-paper">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <Routes>
        <Route path="/appliedjob" element={<ApplyPortal />} />
        <Route path="/appliedJob" element={<ApplyPortal />} />
        <Route path="/applyportal" element={<ApplyPortal />} />
        <Route path="/applied-jobs" element={<ApplyPortal />} />
        <Route path="*" element={<MainPortfolio />} />
      </Routes>

      <Footer />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
