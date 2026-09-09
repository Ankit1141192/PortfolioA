import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiExternalLink, FiX, FiEye } from "react-icons/fi";
import { achievements } from "../data/achievements";

export default function Achievements() {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <section className="relative py-20 bg-panel2 border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-10 text-center">
          Achievements &amp; certificates
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-xl border border-line bg-panel p-6 text-center flex flex-col justify-between"
            >
              <div>
                <FiAward className="mx-auto text-amber mb-3" size={22} />
                <h3 className="font-display text-base font-semibold text-paper mb-1">{a.title}</h3>
                <p className="text-muted text-sm mb-0.5">{a.org}</p>
                <p className="text-muted/70 text-xs font-mono mb-4">{a.date}</p>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                {a.link && a.link !== "#" && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan text-sm hover:text-paper transition-colors font-mono"
                  >
                    Verify <FiExternalLink size={14} />
                  </a>
                )}
                {a.image && (
                  <button
                    type="button"
                    onClick={() => setSelectedImg(a.image)}
                    className="inline-flex items-center gap-1.5 text-amber text-sm hover:text-paper transition-colors font-mono"
                  >
                    Preview <FiEye size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-panel border border-line rounded-xl overflow-hidden shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-paper hover:text-cyan flex items-center justify-center transition-colors"
              >
                <FiX size={18} />
              </button>
              <img
                src={selectedImg}
                alt="Certificate preview"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
