import { useState } from "react";
import { CheckCheck } from "lucide-react";  // <-- LUCIDE ICON
import cert1 from "../assets/cert1.jpg";
import cert2 from "../assets/cert2.jpg";
import cert3 from "../assets/cert3.jpg";

export default function Achievements() {
  const [selectedImage, setSelectedImage] = useState(null);

  const certificates = [
  {
    id: 2,
    title: "Construct Week Project",
    issuer: "Masai School",
    date: "March 2025",
    image: cert3,
    verifiedLink: "https://certs.masaischool.com/certificate/cww-b43-ft38_694",
  },
  {
    id: 3,
    title: "Generative AI",
    issuer: "Techgyan",
    date: "August 2025",
    image: cert2,
    // verifiedLink: "https://your-generative-ai-link.com",
  },
  {
    id: 1,
    title: "HackArena - Hackathon by Masai",
    issuer: "NOBROKER",
    date: "Oct 2025",
    image: cert1,
    // verifiedLink: "https://your-hackarena-link.com",
  },
];


  return (
    <section
      id="achievements"
      className="py-16 bg-gray-100 dark:bg-gray-800 relative"
    >
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
              className="relative bg-white dark:bg-gray-700 shadow-md rounded-2xl p-6 hover:shadow-lg transition duration-200"
            >
              {/* Verified Icon */}
              {cert.verifiedLink && (
                <a
                  href={cert.verifiedLink}
                  target="_blank"
                  className="absolute top-3 right-3 bg-pink-600 text-white p-1.5 rounded-full shadow-md hover:bg-pink-700 transition"
                >
                  <CheckCheck size={18} />
                </a>
              )}

              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {cert.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {cert.issuer}
              </p>
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
