import { useState, useEffect } from 'react';

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Fetch booked slots when date changes
    if (e.target.name === 'date') fetchBookedSlots(e.target.value);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow.toISOString().split('T')[0];
  };

  const fetchBookedSlots = async (date) => {
    if (!date) return;
    try {
      const res = await fetch(`https://portfolioa-1.onrender.com/booked-slots?date=${date}`);
      const data = await res.json();
      setBookedSlots(data.booked || []);
    } catch (err) {
      console.error("Failed to fetch booked slots", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const res = await fetch('https://portfolioa-1.onrender.com/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      alert('Meeting scheduled successfully!');
      setFormData({ name:'', email:'', date:'', time:'', timezone:'Asia/Kolkata', purpose:'', message:'' });
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
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <i className="ri-close-line text-xl text-gray-600 dark:text-gray-400"></i>
          </button>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="ri-check-circle-line text-xl"></i>
              <span>Meeting scheduled successfully! Check your email for confirmation.</span>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="ri-error-warning-line text-xl"></i>
              <span>Error scheduling meeting. Please try again.</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name & Email */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your Full Name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Time *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm cursor-pointer"
              >
                <option value="">Select Time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone & Purpose */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone *</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm cursor-pointer"
              >
                {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Purpose *</label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm cursor-pointer"
              >
                <option value="">Select Purpose</option>
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
              placeholder="Tell me more about your project or topics you'd like to discuss..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.message.length}/500 characters</p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.message.length > 500}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
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
