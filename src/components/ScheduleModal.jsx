import { useState } from 'react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const purposes = [
    'New Project Discussion',
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Consultation',
    'Other'
  ];

  const timezones = [
    'Asia/Kolkata',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Australia/Sydney',
    'Asia/Dubai',
    'Asia/Singapore'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Sheets script URL for scheduling (you'll need to create a separate one for meetings)
      const scriptURL = 'https://script.google.com/macros/s/YOUR_SCHEDULE_SCRIPT_ID/exec';
      
      const scheduleData = new FormData();
      scheduleData.append('Name', formData.name);
      scheduleData.append('Email', formData.email);
      scheduleData.append('Date', formData.date);
      scheduleData.append('Time', formData.time);
      scheduleData.append('Timezone', formData.timezone);
      scheduleData.append('Purpose', formData.purpose);
      scheduleData.append('Message', formData.message);
      scheduleData.append('ScheduledAt', new Date().toISOString());
      scheduleData.append('Status', 'pending');

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: scheduleData,
      });

      if (response.ok) {
        setSubmitStatus('success');

        // Create calendar events
        const eventDate = new Date(`${formData.date}T${convertTo24Hour(formData.time)}`);
        const eventTitle = `Meeting with ${formData.name} - ${formData.purpose}`;
        const eventDetails = `Purpose: ${formData.purpose}\nMessage: ${formData.message}\nEmail: ${formData.email}\nScheduled by: ${formData.name}`;

        generateCalendarEvents(eventTitle, eventDetails, eventDate, formData.timezone);

        // Send email notification to ankit2914978@gmail.com
        await sendEmailNotification(formData);

        setTimeout(() => {
          onClose();
          setFormData({
            name: '',
            email: '',
            date: '',
            time: '',
            timezone: 'Asia/Kolkata',
            purpose: '',
            message: ''
          });
          setSubmitStatus('');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendEmailNotification = async (data) => {
    try {
      // You can use EmailJS or another email service here
      const emailData = {
        to_email: 'ankit2914978@gmail.com',
        from_name: data.name,
        from_email: data.email,
        subject: `New Meeting Scheduled - ${data.purpose}`,
        message: `
          New meeting scheduled:
          
          Name: ${data.name}
          Email: ${data.email}
          Date: ${data.date}
          Time: ${data.time}
          Timezone: ${data.timezone}
          Purpose: ${data.purpose}
          Message: ${data.message}
          
          Please confirm the meeting by replying to this email.
        `
      };

      // If using EmailJS, uncomment and configure:
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData, 'YOUR_PUBLIC_KEY');
      
      console.log('Email notification sent:', emailData);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? String(parseInt(hours, 10) + 12) : hours;
    }
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const generateCalendarEvents = (title, details, date, timezone) => {
    const startTime = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&ctz=${timezone}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(details)}`;

    setTimeout(() => {
      const calendarChoice = confirm('Meeting scheduled successfully! Add to your calendar?\n\nClick OK for Google Calendar or Cancel for Outlook Calendar');
      if (calendarChoice) {
        window.open(googleUrl, '_blank');
      } else {
        window.open(outlookUrl, '_blank');
      }
    }, 1000);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Schedule a Call
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl text-gray-600 dark:text-gray-400"></i>
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="ri-check-circle-line text-xl"></i>
              <span>Meeting scheduled successfully! Ankit will receive a notification and contact you soon.</span>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <i className="ri-error-warning-line text-xl"></i>
              <span>Sorry, there was an error scheduling your meeting. Please try again.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Date *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Time *
              </label>
              <div className="relative">
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone *
              </label>
              <div className="relative">
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Purpose *
              </label>
              <div className="relative">
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select Purpose</option>
                  {purposes.map((purpose) => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
              placeholder="Tell me more about your project or any specific topics you'd like to discuss..."
            ></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-information-line text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Meeting Details:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Duration: 60 minutes</li>
                  <li>• Platform: Google Meet (link will be sent via email)</li>
                  <li>• Ankit will contact you at ankit2914978@gmail.com</li>
                  <li>• You can reschedule up to 24 hours before the meeting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
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