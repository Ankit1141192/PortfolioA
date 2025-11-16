import { useState } from "react";
import cert1 from "../assets/cert1.jpg";
import cert2 from "../assets/cert2.jpg";

export default function Achievements() {
  const [selectedImage, setSelectedImage] = useState(null);

  const certificates = [
    {
      id: 1,
      title: "xto10x Hackathon by Masai",
      issuer: "Masai",
      date: "January 2025",
      image: cert1,
    },
    {
      id: 2,
      title: "Generative AI",
      issuer: "Techgyan",
      date: "August 2025",
      image: cert2,
    },
  ];

  return (
    <section id="achievements" className="py-16 bg-gray-100 dark:bg-gray-800 relative">
      <div
        className={`max-w-6xl mx-auto px-6 text-center transition-all duration-300 ${
          selectedImage ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
          Achievements & Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-700 shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{cert.issuer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {cert.date}
              </p>

              <button
                onClick={() => setSelectedImage(cert.image)}
                className="inline-block px-6 py-3 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md"
              >
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={selectedImage}
              alt="Certificate"
              className="w-full rounded-xl shadow-xl border-2 border-white"
            />

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 bg-white text-black rounded-full px-3 py-1 text-sm font-bold shadow-md"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
