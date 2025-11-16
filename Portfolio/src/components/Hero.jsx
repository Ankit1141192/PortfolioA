import { useState, useEffect } from "react";

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Mobile App Developer",
    "Tech Enthusiast",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 pt-20"
    >
      <div className="text-center max-w-3xl mx-auto">

        {/* Greeting */}
        <h1 className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
          Hello,
        </h1>

        {/* Name */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-3">
          I'm{" "}
          <span className="text-purple-600 dark:text-purple-400">
            Ankit Kumar
          </span>
        </h2>

        {/* Role Animation */}
        <div className="h-8 mb-6">
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium transition-all duration-500">
            {roles[currentRole]}
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          I craft digital experiences that blend creativity with functionality.
          From responsive web applications to intuitive mobile designs, I bring
          ideas to life through clean code and thoughtful UI/UX decisions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">

          {/* Download CV */}
          <a
            href="https://drive.google.com/uc?export=download&id=1u12VQo7UlR_64m9-lU0Zc4DbgASlWDQS"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.03] flex items-center gap-2"
          >
            <span>Download CV</span>
            <i className="ri-download-line text-xl"></i>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6">
          {[
            {
              icon: "linkedin",
              href: "https://www.linkedin.com/in/ankit1141/",
            },
            {
              icon: "github",
              href: "https://github.com/Ankit1141192",
            },
            {
              icon: "twitter",
              href: "https://x.com/ankitk09773",
            },
            {
              icon: "instagram",
              href: "https://www.instagram.com/mr_ankitkumar4954/",
            },
          ].map((social) => (
            <a
              key={social.icon}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-md shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
            >
              <i
                className={`ri-${social.icon}-${
                  social.icon === "github" ? "fill" : "line"
                } text-2xl text-gray-800 dark:text-white`}
              ></i>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
