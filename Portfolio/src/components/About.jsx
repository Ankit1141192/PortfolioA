import { motion } from "framer-motion";
import { FiMapPin, FiCheckCircle, FiWifi } from "react-icons/fi";

const badges = [
  { icon: FiMapPin, label: "Kanpur, India" },
  { icon: FiCheckCircle, label: "Open to opportunities" },
  { icon: FiWifi, label: "Remote friendly" },
];

const stats = [
  { value: "10+", label: "Projects built" },
  { value: "1+", label: "Years of learning" },
  { value: "3+", label: "Hackathons" },
  { value: "5+", label: "Technologies used" },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 bg-ink border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="01" label="about" />

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-start mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-6">
              Aspiring full-stack developer,
              <br /> one shipped project at a time.
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              I'm a MERN stack developer with hands-on experience building real-world web and
              mobile applications. I've completed 10+ projects, taken part in hackathons, and
              I keep sharpening my skills through deliberate practice — writing clean, scalable
              code that's built to be maintained, not just shipped once.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              Outside of scheduled work, I'm open to freelance builds, contract roles, and
              full-time opportunities where I can own a problem end to end.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {badges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 border border-line rounded-full px-3 py-1.5 text-sm text-muted font-mono"
                >
                  <Icon className="text-cyan" /> {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="border border-line rounded-lg py-4 px-3 text-center bg-panel"
                >
                  <div className="font-display text-2xl font-semibold text-paper">{s.value}</div>
                  <div className="text-xs text-muted mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-3 border border-line rounded-2xl -z-10" />
            <div className="rounded-xl overflow-hidden border border-line bg-panel aspect-[4/5]">
              <img
                src="/profile.png"
                alt="Portrait of Ankit Kumar"
                className="w-full h-full object-cover grayscale-[15%]"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-panel border border-line rounded-lg px-4 py-3 font-mono text-xs text-cyan shadow-panel">
              status: <span className="text-amber">available</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SectionTag({ n, label }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs text-muted">
      <span className="text-amber">{n}</span>
      <span className="h-px flex-1 max-w-[40px] bg-line" />
      <span>{label}</span>
    </div>
  );
}
