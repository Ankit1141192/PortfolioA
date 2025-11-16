import { useState } from 'react';
import { backendApi } from '../config/api';

export default function ScheduleModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    timezone: 'Asia/Kolkata',
    purpose: '',
    message: ''
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const timeSlots = [
    '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
    '01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM',
    '04:00 PM','04:30 PM','05:00 PM'
  ];

  const purposes = [
    'New Project Discussion','Web Development','Mobile App Development',
    'UI/UX Design','Consultation','Other'
  ];

  const timezones = [
    'Asia/Kolkata','America/New_York','America/Los_Angeles',
    'Europe/London','Europe/Berlin','Asia/Tokyo','Australia/Sydney',
    'Asia/Dubai','Asia/Singapore'
  ];

  // -------------------------------
  // Handle input
  // -------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'date') {
      setFormData(prev => ({ ...prev, time: '' }));
      fetchBookedSlots(value);
    }
  };

  // -------------------------------
  // Minimum date (today)
  // -------------------------------
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // -------------------------------
  // Fetch booked slots
  // -------------------------------
  const fetchBookedSlots = async (date) => {
    if (!date) return;
    try {
      const res = await fetch(`${backendApi}/booked-slots?date=${date}`);
      const data = await res.json();
      setBookedSlots(data.booked || []);
    } catch (err) {
      console.error("Failed to fetch booked slots", err);
    }
  };

  // -------------------------------
  // TIME SLOT FILTERING FOR TODAY
  // -------------------------------
  const getFilteredSlots = () => {
    if (!formData.date) return timeSlots;

    const selectedDate = new Date(formData.date);
    const today = new Date();

    // Not today → return all slots
    if (selectedDate.toDateString() !== today.toDateString()) {
      return timeSlots;
    }

    // If today → remove past slots + 30 min buffer
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 30);

    return timeSlots.filter(slot => {
      const slotTime = new Date(formData.date + " " + slot);
      return slotTime >= currentTime;
    });
  };

  // -------------------------------
  // Submit
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const res = await fetch(`${backendApi}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      alert('Meeting scheduled successfully!');

      setFormData({
        name: '',
        email: '',
        date: '',
        time: '',
        timezone: 'Asia/Kolkata',
        purpose: '',
        message: ''
      });

      setBookedSlots(prev => [...prev, formData.time]);

      setSubmitStatus('success');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Schedule a Call</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <i className="ri-close-line text-xl text-gray-600 dark:text-gray-400"></i>
          </button>
        </div>

        {/* Success */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
            <i className="ri-check-circle-line text-xl mr-2"></i>
            Meeting scheduled successfully! Check your email for confirmation.
          </div>
        )}

        {/* Error */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            <i className="ri-error-warning-line text-xl mr-2"></i>
            Error scheduling meeting. Please try again.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Preferred Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                min={getMinDate()}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Preferred Time *</label>
              <select
                name="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 cursor-pointer text-sm"
              >
                <option value="">Select Time</option>

                {getFilteredSlots().map(slot => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone + Purpose */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Timezone *</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 cursor-pointer text-sm"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Meeting Purpose *</label>
              <select
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 cursor-pointer text-sm"
              >
                <option value="">Select Purpose</option>
                {purposes.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 text-sm font-medium">Additional Message</label>
            <textarea
              name="message"
              rows={4}
              maxLength={500}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me more about your project..."
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <i className="ri-calendar-check-line"></i>
                  <span>Schedule Meeting</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
