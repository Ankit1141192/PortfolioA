export default function Services() {
  const services = [
    {
      icon: 'ri-code-s-slash-line',
      title: 'Web Development',
      description: 'Full-stack web applications built with modern technologies like React, Node.js, and cloud platforms.',
      features: ['Responsive Design', 'Performance Optimization', 'SEO Friendly', 'Cross-browser Compatible'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-500'
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.',
      features: ['iOS & Android', 'Cross-platform', 'Native Performance', 'App Store Ready'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-500'
    },
    
    {
      icon: 'ri-search-eye-line',
      title: 'SEO Optimization',
      description: 'Comprehensive SEO strategies to improve your website visibility and search engine rankings.',
      features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Analytics Setup'],
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      iconBg: 'bg-pink-500'
    },
   
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Services
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I offer comprehensive digital solutions to help bring your ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`${service.bgColor} p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 hover:scale-105`}
            >
              <div className="mb-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${service.iconBg} group-hover:scale-110 transition-transform duration-200 mb-4`}>
                  <i className={`${service.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className={`bg-gradient-to-r ${service.color} text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap`}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}