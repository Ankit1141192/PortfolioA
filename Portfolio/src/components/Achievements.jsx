export default function Achievements() {
  const certificates = [
    {
      id: 1,
      title: "xto10x Hackathon by Masai",
      issuer: "Masai",
      date: "January 2025",
      link: "https://certs.masaischool.com/certificate/xto10jan_ft38_694",
    },
    {
      id: 2,
      title: "Generative AI",
      issuer: "Techgyan",
      date: "August 2025",
     link:"https://media.licdn.com/dms/image/v2/D562DAQHPBDievRUpuQ/profile-treasury-image-shrink_800_800/B56Zi34wClHcAY-/0/1755431769801?e=1760896800&v=beta&t=kdnHEZSieoTYmqVQB8Ku4YxYrbavlCYfp1Rdf8GWEAo"
    },
    
  ];

  return (
    <section id="achievements" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          Achievements & Certificates
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-lg font-semibold text-purple-600 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-700">{cert.issuer}</p>
              <p className="text-sm text-gray-500 mb-4">{cert.date}</p>
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md"
              >
                View Certificate
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
