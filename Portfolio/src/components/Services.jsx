import { motion } from "framer-motion";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";
import { services } from "../data/services";
import { SectionTag } from "./About";

export default function Services() {
  return (
    <section id="services" className="relative py-28 bg-ink border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="03" label="services" />

        <div className="mt-8 mb-12 max-w-lg">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-4">
            Ways we can work together.
          </h2>
          <p className="text-muted leading-relaxed">
            Whether it's a full product build or a focused fix, here's what's on offer —
            scoped clearly, delivered on a timeline you know upfront.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-xl border border-line bg-panel overflow-hidden hover:border-cyan/50 transition-colors"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-panel2 font-mono text-xs text-muted">
                <span>{s.name}</span>
                <FiArrowUpRight className="text-muted group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-paper mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-paper/90">
                      <FiCheck className="text-cyan mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold px-6 py-3 rounded-md hover:bg-amber-dim transition-colors"
          >
            Get a quote for your project
          </a>
        </div>
      </div>
    </section>
  );
}
