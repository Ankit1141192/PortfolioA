import photo from '../assets/Ankitpic1.png';
import photo1 from "../assets/ankitk2.jpg";

export default function About() {
  const stats = [
    { number: '10+', label: 'Projects Built' },
    { number: '1+', label: 'Years of Learning' },
    { number: '3+', label: 'Hackathons Participated' },
    { number: '5+', label: 'Technologies Used' },
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Aspiring Full Stack Developer
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              I'm a passionate and curious software developer specializing in the MERN stack, with hands-on experience in building real-world web and mobile applications. Though I'm a fresher, I’ve worked on 10+ projects that showcase my ability to design, develop, and deploy scalable and responsive applications.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              My strengths lie in JavaScript, React.js, React Native, and Firebase. I’ve also participated in multiple hackathons and take pride in continuously improving my skills, collaborating with teams, and embracing new challenges.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📍 Kanpur, India</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">💼 Open to Opportunities</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🌐 Remote Friendly</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-xl 
              w-74 h-94 sm:w-72 sm:h-72 md:w-134 md:h-154 lg:w-110 lg:h-120">
              <img 
                src={photo1}
                alt="About me"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
