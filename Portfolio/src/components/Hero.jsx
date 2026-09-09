import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiArrowDown, FiDownload } from "react-icons/fi";
import { useTypewriter } from "../lib/useTypewriter";

const roles = ["Mobile App Developer", "Full-Stack MERN Developer", "Freelance Web Developer"];

const codeLines = [
  { n: 1, content: <>const <span className="text-cyan">developer</span> = {"{"}</> },
  { n: 2, content: <>&nbsp;&nbsp;name: <span className="text-amber">'Ankit Kumar'</span>,</> },
  { n: 3, content: <>&nbsp;&nbsp;stack: <span className="text-amber">'MERN'</span>,</> },
  { n: 4, content: <>&nbsp;&nbsp;ships: <span className="text-cyan">true</span>,</> },
  { n: 5, content: <>&nbsp;&nbsp;available: <span className="text-cyan">true</span>,</> },
  { n: 6, content: <>{"}"};</> },
];

const socials = [
  { icon: FiGithub, href: "https://github.com/Ankit1141192", label: "GitHub" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/ankit1141/", label: "LinkedIn" },
  { icon: FiTwitter, href: "https://x.com/ankitk09773", label: "Twitter" },
  { icon: FiInstagram, href: "https://www.instagram.com/mr_ankitkumar4954/", label: "Instagram" },
];

export default function Hero() {
  const typed = useTypewriter(roles);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 blueprint-grid [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />

      {/* Drifting blueprint dots — the page's single ambient motion cue */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-[8%] w-2 h-2 rounded-full bg-cyan/60 hidden md:block"
      />
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-32 left-[6%] w-2 h-2 rounded-full bg-amber/60 hidden md:block"
      />

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan border border-line rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            Open to freelance &amp; full-time work
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-paper leading-[1.05] mb-4">
            I build products
            <br />
            that ship.
          </h1>

          <div className="font-mono text-lg sm:text-xl text-muted mb-6 h-8">
            <span className="text-amber">$</span> role --current{" "}
            <span className="text-paper">{typed}</span>
            <span className="inline-block w-[2px] h-5 bg-cyan align-middle ml-1 animate-pulse" />
          </div>

          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8 max-w-md">
            Full-stack &amp; mobile developer crafting fast, reliable products end to end —
            from database schema to the pixel you tap. 10+ projects shipped, MERN at the core.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-amber text-ink font-display font-semibold px-5 py-3 rounded-md hover:bg-amber-dim transition-colors"
            >
              View my work
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-line text-paper font-display font-semibold px-5 py-3 rounded-md hover:border-cyan hover:text-cyan transition-colors"
            >
              Hire me
            </a>
            <a
              href="/Ankit_Kumar_Resume.pdf"
              download
              className="inline-flex items-center gap-2 text-muted hover:text-paper font-mono text-sm px-2 py-3 transition-colors"
            >
              <FiDownload /> Resume
            </a>
          </div>

          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-line text-muted hover:text-cyan hover:border-cyan transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="hidden md:block"
        >
          <div className="rounded-xl border border-line bg-panel shadow-panel overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-panel2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-cyan/70" />
              <span className="ml-3 font-mono text-xs text-muted">welcome</span>
            </div>
            <div className="p-6 font-mono text-sm leading-7">
              {codeLines.map((line, i) => (
                <motion.div
                  key={line.n}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.18, duration: 0.4 }}
                  className="flex gap-4 text-paper/90"
                >
                  <span className="text-muted/50 select-none w-4 text-right">{line.n}</span>
                  <span>{line.content}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {["10+", "1+", "3+", "5+"].map((stat, i) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.1, duration: 0.4 }}
                className="rounded-lg border border-line bg-panel text-center py-3"
              >
                <div className="font-display text-xl font-semibold text-amber">{stat}</div>
                <div className="text-[10px] text-muted mt-0.5">
                  {["Projects", "Yr exp.", "Hackathons", "Stacks"][i]}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-cyan"
        aria-label="Scroll to About"
      >
        <FiArrowDown size={20} />
      </motion.a>
    </section>
  );
}
