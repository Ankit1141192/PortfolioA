import { useState } from 'react';
import ScheduleModal from './ScheduleModal';
import call from '../assets/call.svg';
import gmail from '../assets/gmail.svg';
import location from '../assets/location.svg';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    number: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxMsp13pDnKrWa6ZPzZ16IL2iz1ybKEyD_6luiMlaIFgS5wkuqIbb-vT07Dqc6KssSd/exec';
      const googleFormData = new FormData();
      googleFormData.append('Name', formData.name);
      googleFormData.append('Email', formData.email);
      googleFormData.append('Subject', formData.subject);
      googleFormData.append('Message', formData.message);
      googleFormData.append('Number', formData.number);

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: googleFormData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', number: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error!', error.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  };

  const contactInfo = [
    {
      icon: gmail,
      title: 'Email',
      value: 'ankit2914978@gmail.com',
      link: 'mailto:ankit2914978@gmail.com',
      color: 'bg-blue-500'
    },
    {
      icon: call,
      title: 'Phone',
      value: '+91 8707538123',
      link: 'tel:+918707538123',
      color: 'bg-green-500'
    },
    {
      icon: location,
      title: 'Location',
      value: 'Kanpur, India',
      link: '#',
      color: 'bg-red-500'
    }
  ];

  return (
    <>
      <section id="contact" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Contact Me
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Let's discuss your project and bring your ideas to life. I'm always excited to work on new challenges.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Get In Touch
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  I'm currently available for freelance work and exciting project opportunities. 
                  Whether you have a project in mind or just want to chat about technology, 
                  feel free to reach out!
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full  group-hover:scale-110 transition-transform duration-200`}>
                        <img src={info.icon} alt={info.title} className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {info.title}
                        </h4>
                        <p className="text-gray-800 dark:text-white font-medium">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white">
                <h4 className="text-xl font-bold mb-3">Let's Start a Project Together</h4>
                <p className="mb-4">
                  Ready to transform your ideas into reality? I'd love to hear about your project.
                </p>
                <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Schedule a Call
                </button>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Send Message
              </h3>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number *
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Your Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="Project Discussion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || formData.message.length > 500}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Follow me on social media for updates and behind-the-scenes content
            </p>
            <div className="flex items-center justify-center space-x-6">
              {[
                { icon: 'linkedin', href: 'https://www.linkedin.com/in/ankit1141/', color: 'hover:text-blue-700' },
                { icon: 'github', href: 'https://github.com/Ankit1141192', color: 'hover:text-gray-800 dark:hover:text-gray-300' },
                { icon: 'twitter', href: 'https://x.com/ankitk09773', color: 'hover:text-blue-500' },
                { icon: 'instagram', href: 'https://www.instagram.com/mr_ankitkumar4954/', color: 'hover:text-pink-600' },
                
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 dark:text-gray-300 cursor-pointer ${social.color}`}
                >
                  <i className={`ri-${social.icon}-${social.icon === 'github' ? 'fill' : 'line'} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </>
  );
}
