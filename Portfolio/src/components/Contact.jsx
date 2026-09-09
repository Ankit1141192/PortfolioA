import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { SectionTag } from "./About";
import ScheduleModal from "./ScheduleModal";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxMsp13pDnKrWa6ZPzZ16IL2iz1ybKEyD_6luiMlaIFgS5wkuqIbb-vT07Dqc6KssSd/exec";

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setResult(null);

    try {
      const googleFormData = new FormData();

      googleFormData.append("Name", form.name);
      googleFormData.append("Email", form.email);
      googleFormData.append("Number", form.phone);
      googleFormData.append("Subject", form.subject);
      googleFormData.append("Message", form.message);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: googleFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      setResult("ok");
      setForm(emptyForm);
    } catch (error) {
      console.error("Contact form error:", error);
      setResult("error");
    } finally {
      setSubmitting(false);

      setTimeout(() => {
        setResult(null);
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 bg-ink border-t border-line"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag n="06" label="contact" />

        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mt-8 mb-3 max-w-lg">
          Let's talk about your project.
        </h2>

        <p className="text-muted leading-relaxed max-w-lg mb-14">
          Freelance work, full-time roles, or just a technical question — my
          inbox is open. I usually reply within a day.
        </p>

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <ContactRow
              icon={FiMail}
              label="Email"
              value="ankit2914978@gmail.com"
              href="mailto:ankit2914978@gmail.com"
            />

            <ContactRow
              icon={FiPhone}
              label="Phone"
              value="+91 8707538123"
              href="tel:+918707538123"
            />

            <ContactRow
              icon={FiMapPin}
              label="Location"
              value="Kanpur, India"
            />

            {/* SCHEDULE CALL */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-gradient-to-br from-cyan/10 to-amber/10 border border-line p-6 mt-6"
            >
              <h3 className="font-display text-lg font-semibold text-paper mb-2">
                Ready to start a project?
              </h3>

              <p className="text-muted text-sm mb-4">
                Available for freelance work and full-time opportunities.
                Select a time on my calendar for a 1-on-1 call.
              </p>

              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center gap-2 bg-paper text-ink font-display font-semibold px-4 py-2.5 rounded-md hover:bg-cyan transition-colors text-sm cursor-pointer"
              >
                Schedule a call
              </button>
            </motion.div>
          </div>

          {/* CONTACT FORM */}
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="rounded-xl border border-line bg-panel p-6"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Name *">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Your name"
                  required
                />
              </Field>

              <Field label="Email *">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Phone">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Optional"
                />
              </Field>

              <Field label="Subject *">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Project description"
                  required
                />
              </Field>
            </div>

            <Field label="Message *">
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                className="input min-h-[120px] resize-none mb-4"
                placeholder="Tell me about your project…"
                required
                maxLength={500}
              />
            </Field>

            <p className="text-xs text-muted mb-4">
              {form.message.length}/500 characters
            </p>

            {/* SUCCESS MESSAGE */}
            {result === "ok" && (
              <p className="text-cyan text-sm mb-3">
                Message sent — I'll be in touch soon.
              </p>
            )}

            {/* ERROR MESSAGE */}
            {result === "error" && (
              <p className="text-red-400 text-sm mb-3">
                Couldn't send that. Please try again or email me directly.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber text-ink font-display font-semibold py-3 rounded-md hover:bg-amber-dim transition-colors disabled:opacity-60"
            >
              <FiSend />

              {submitting ? "Sending…" : "Send message"}
            </button>
          </motion.form>
        </div>
      </div>

      {/* SCHEDULE MODAL ONLY */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </section>
  );
}

/* CONTACT ROW */

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-4 rounded-lg border border-line bg-panel px-4 py-3.5 hover:border-cyan/50 transition-colors">
      <div className="w-9 h-9 rounded-md bg-panel2 flex items-center justify-center text-cyan shrink-0">
        <Icon />
      </div>

      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="text-sm text-paper">{value}</div>
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}

/* FORM FIELD */

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono text-muted mb-1.5">
        {label}
      </span>

      {children}
    </label>
  );
}