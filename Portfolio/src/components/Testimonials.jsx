import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiX, FiPlus, FiGitCommit } from "react-icons/fi";
import { fetchTestimonials, postTestimonial } from "../lib/api";
import { SectionTag } from "./About";

const relationships = [
  { value: "client", label: "Client" },
  { value: "collaborator", label: "Collaborator" },
  { value: "recruiter", label: "Recruiter" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
];

const emptyForm = { name: "", role: "", company: "", relationship: "client", rating: 5, message: "" };

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTestimonials()
      .then((data) => {
        setTestimonials(data);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!form.name.trim() || !form.message.trim()) {
      setSubmitError("Name and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await postTestimonial(form);
      setTestimonials((t) => [created, ...t]);
      setSubmitted(true);
      setForm(emptyForm);
      setTimeout(() => {
        setModalOpen(false);
        setSubmitted(false);
      }, 1400);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error || "Couldn't submit right now — the API may be offline."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="relative py-28 bg-ink border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="05" label="feedback" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-8 mb-12">
          <div className="max-w-lg">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-3">
              What clients &amp; collaborators say.
            </h2>
            <p className="text-muted leading-relaxed">
              Worked with me on a project, hackathon team, or hiring process? Add your feedback
              below — it'll show up here for other visitors to see.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold px-5 py-3 rounded-md hover:bg-amber-dim transition-colors shrink-0"
          >
            <FiPlus /> Leave feedback
          </button>
        </div>

        {status === "loading" && (
          <div className="font-mono text-sm text-muted">Loading feedback.log …</div>
        )}

        {status === "error" && (
          <div className="border border-line rounded-lg p-6 font-mono text-sm text-muted bg-panel">
            Couldn't reach the API. Start the backend (see README) and this section will populate
            live — or seed sample data with <code className="text-cyan">npm run seed</code>.
          </div>
        )}

        {status === "ok" && testimonials.length === 0 && (
          <div className="border border-line rounded-lg p-8 text-center font-mono text-sm text-muted bg-panel">
            No feedback yet — be the first to add a commit to this log.
          </div>
        )}

        {status === "ok" && testimonials.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id || i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="rounded-xl border border-line bg-panel p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-panel2 border border-line flex items-center justify-center font-display text-xs text-cyan">
                      {initials(t.name)}
                    </div>
                    <div>
                      <div className="text-sm text-paper font-medium">{t.name}</div>
                      <div className="text-xs text-muted">
                        {[t.role, t.company].filter(Boolean).join(" · ") || relationships.find(r => r.value === t.relationship)?.label}
                      </div>
                    </div>
                  </div>
                  <FiGitCommit className="text-muted/60" />
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FiStar
                      key={idx}
                      className={idx < t.rating ? "text-amber fill-amber" : "text-line"}
                      size={14}
                    />
                  ))}
                </div>
                <p className="text-sm text-paper/90 leading-relaxed mb-4">{t.message}</p>
                <div className="font-mono text-[11px] text-muted">
                  commit · {t.createdAt ? timeAgo(t.createdAt) : "just now"}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-line bg-panel shadow-panel overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-panel2">
                <span className="font-mono text-xs text-muted">new-commit.js</span>
                <button onClick={() => setModalOpen(false)} className="text-muted hover:text-paper">
                  <FiX />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <div className="text-cyan font-display text-lg mb-2">Feedback posted ✓</div>
                  <p className="text-muted text-sm">Thanks — it's now live on the feedback wall.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <p className="text-xs text-muted font-mono">
                    This will be posted publicly on the feedback wall above.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name *">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input"
                        maxLength={60}
                        required
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="input"
                        maxLength={80}
                      />
                    </Field>
                  </div>
                  <Field label="Company">
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="input"
                      maxLength={80}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="You are a">
                      <select
                        value={form.relationship}
                        onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                        className="input"
                      >
                        {relationships.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Rating">
                      <div className="flex gap-1 pt-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setForm({ ...form, rating: idx + 1 })}
                          >
                            <FiStar
                              size={20}
                              className={idx < form.rating ? "text-amber fill-amber" : "text-line"}
                            />
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <Field label="Message *">
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input min-h-[90px] resize-none"
                      maxLength={600}
                      required
                    />
                  </Field>

                  {submitError && <p className="text-xs text-red-400">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber text-ink font-display font-semibold py-3 rounded-md hover:bg-amber-dim transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Posting…" : "Post feedback"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
