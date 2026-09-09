import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { projects } from "../data/projects";
import { SectionTag } from "./About";

const filters = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
];

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter((p) => filter === "all" || p.type === filter);

  return (
    <section id="projects" className="relative py-28 bg-panel2 border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="04" label="projects" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-8 mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper max-w-lg">
            A working sample of what I've shipped.
          </h2>
          <div className="flex gap-2 font-mono text-sm">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  filter === f.key
                    ? "border-amber text-amber bg-amber/5"
                    : "border-line text-muted hover:text-paper"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl border border-line bg-panel overflow-hidden hover:border-cyan/60 hover:shadow-[0_0_0_1px_rgba(94,234,212,0.15),0_20px_40px_-20px_rgba(94,234,212,0.25)] transition-all flex flex-col justify-between"
              >
                {p.featured && (
                  <span className="absolute top-3 right-3 z-10 font-mono text-[10px] uppercase tracking-wide bg-amber text-ink px-2 py-1 rounded-full shadow">
                    Featured
                  </span>
                )}
                <div className="px-5 py-3 border-b border-line bg-panel2 font-mono text-xs text-muted flex items-center justify-between">
                  <span className="truncate">{p.name.toLowerCase().replace(/\s+/g, "-")}</span>
                  <span className="uppercase text-[10px] text-cyan">{p.type}</span>
                </div>

                {p.image && (
                  <div className="relative h-44 overflow-hidden border-b border-line bg-panel2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel/80 via-transparent to-transparent opacity-60" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper mb-2">{p.name}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-4">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-line text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm pt-2 border-t border-line/50">
                    {p.demo && p.demo !== "#" && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan hover:text-paper transition-colors font-medium"
                      >
                        <FiExternalLink /> Live demo
                      </a>
                    )}
                    {p.code && p.code !== "#" && (
                      <a
                        href={p.code}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted hover:text-paper transition-colors font-medium"
                      >
                        <FiGithub /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/Ankit1141192"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-line text-paper font-display font-semibold px-6 py-3 rounded-md hover:border-cyan hover:text-cyan transition-colors"
          >
            <FiGithub /> View all projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
