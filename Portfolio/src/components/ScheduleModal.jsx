import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { fetchBookedSlots, postScheduleMeeting } from "../lib/api";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM"
];

const purposes = [
  "New Project Discussion",
  "Full-Stack Web Development",
  "React Native Mobile App",
  "Freelance Collaboration",
  "Consultation & Tech Advice",
  "Other"
];

const timezones = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney"
];

export default function ScheduleModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    timezone: "Asia/Kolkata",
    purpose: purposes[0],
    message: ""
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!formData.date) return;
    let isMounted = true;
    setLoadingSlots(true);

    fetchBookedSlots(formData.date)
      .then((data) => {
        if (isMounted) {
          setBookedSlots(data?.booked || []);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch booked slots:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {})
    }));
  };

  const getFilteredSlots = () => {
    if (!formData.date) return timeSlots;
    const isToday = formData.date === todayStr;
    if (!isToday) return timeSlots;

    const buffer = new Date();
    buffer.setMinutes(buffer.getMinutes() + 30);

    return timeSlots.filter((slot) => {
      const parsed = new Date(`${formData.date} ${slot}`);
      return parsed >= buffer;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await postScheduleMeeting(formData);
      setStatus({
        type: "success",
        message: "Meeting confirmed! A calendar invite & Zoom link have been sent to your email."
      });
      setBookedSlots((prev) => [...prev, formData.time]);
      setTimeout(() => {
        onClose();
        setStatus({ type: "", message: "" });
        setFormData({
          name: "",
          email: "",
          date: "",
          time: "",
          timezone: "Asia/Kolkata",
          purpose: purposes[0],
          message: ""
        });
      }, 3500);
    } catch (err) {
      const errMessage = err.response?.data?.error || "Failed to schedule meeting. Please try another slot or email directly.";
      setStatus({ type: "error", message: errMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-xl w-full bg-panel border border-line rounded-xl shadow-2xl p-6 md:p-8 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                scheduler.init()
              </div>
              <h3 className="font-display text-2xl font-semibold text-paper mt-1">
                Schedule a 1-on-1 Call
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md border border-line text-muted hover:text-paper hover:border-cyan flex items-center justify-center transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {status.type === "success" && (
            <div className="mb-6 p-4 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan text-sm flex items-start gap-3">
              <FiCheckCircle size={20} className="shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === "error" && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <FiAlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-body">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Preferred Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    min={todayStr}
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">
                  Preferred Time Slot * {loadingSlots && "(Checking...)"}
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Select a slot</option>
                  {getFilteredSlots().map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <option key={slot} value={slot} disabled={isBooked}>
                        {slot} {isBooked ? "— (Booked)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Your Timezone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="input"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">Meeting Purpose *</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {purposes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">Additional Project Notes</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                maxLength={400}
                rows={3}
                placeholder="Give a quick summary of what you'd like to talk about..."
                className="input resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="border border-line text-muted hover:text-paper px-4 py-2.5 rounded-md font-mono text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-amber text-ink font-display font-semibold px-5 py-2.5 rounded-md hover:bg-amber-dim transition-colors disabled:opacity-60 text-sm"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    Booking Slot...
                  </>
                ) : (
                  <>
                    <FiCalendar /> Confirm Schedule
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
