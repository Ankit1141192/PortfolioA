import { useState } from "react";
import { motion } from "framer-motion";
import { skillGroups } from "../data/skills";
import { SectionTag } from "./About";

export default function Skills() {
  const [active, setActive] = useState(skillGroups[0].label);
  const group = skillGroups.find((g) => g.label === active);

  return (
    <section id="skills" className="relative py-28 bg-panel2 border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="02" label="skills" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-8 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper max-w-lg">
            The stack I reach for by default.
          </h2>
          <div className="flex gap-2 font-mono text-sm">
            {skillGroups.map((g) => (
              <button
                key={g.label}
                onClick={() => setActive(g.label)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  active === g.label
                    ? "border-cyan text-cyan bg-cyan/5"
                    : "border-line text-muted hover:text-paper"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          {group.items.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <div className="flex justify-between font-mono text-sm mb-2">
                <span className="text-paper">{skill.name}</span>
                <span className="text-muted">{skill.level}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.05 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-amber"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
