import { useState } from 'react';
import Project_1 from "../assets/todoist.png";
import Project_2 from "../assets/trafficIssue.png";
import Project_3 from "../assets/Homorax.png";
import Project_4 from "../assets/LinkedinClone.png";
import Project_5 from "../assets/Shopnetic.jpeg";
import Project_6 from "../assets/portfolio-7.png";
import Project_7 from "../assets/StopWatch2.jpg";
import Project_8 from "../assets/ChargeGrid.jpg";
import Project_9 from "../assets/Skillup.png";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
  {
    id: 1,
    title: "Todoist Clone",
    description: "A productivity app to manage your tasks efficiently.",
    technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    image: Project_1,
    liveUrl: "https://bright-cendol-1e0307.netlify.app",
    githubUrl: "https://github.com/Ankit1141192/todoistConstructWeak",
    category: "web",
    featured: true,
  },
  {
    id: 2,
    title: "TraffIssue",
    description: "A platform for citizens to report traffic problems.",
    technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    image: Project_2,
    liveUrl: "https://4347-hackthon.netlify.app",
    githubUrl: "https://github.com/Sadafff19/Team_4347_hackathon",
    category: "web",
    featured: false,
  },
  {
    id: 3,
    title: "LinkedIn Clone",
    description: "A social networking app inspired by LinkedIn.",
    technologies: ["HTML", "JavaScript", "CSS", "LocalStorage"],
    image: Project_4,
    liveUrl: "#",
    githubUrl: "https://github.com/Ankit1141192/cunstructWeakProject",
    category: "web",
    featured: false,
  },
  {
    id: 4,
    title: "Stayver",
    description: "A hotel booking platform with a user-friendly interface.",
    technologies: ["React+Vite", "TailwindCSS", "ClerkAuth"],
    image: Project_6,
    liveUrl: "https://stayver.vercel.app/",
    githubUrl: "https://github.com/Ankit1141192/QuickStay",
    category: "web",
    featured: true,
  },
  {
    id: 5,
    title: "Homorax",
    description: "An ecommerce platform for modern shopping experiences.",
    technologies: ["React", "CSS", "ChakraUI", "Firebase Authentication"],
    image: Project_3,
    liveUrl: "#",
    githubUrl: "https://github.com/Ankit1141192/The-Coding-Crusaders",
    category: "web",
    featured: false,
  },
  {
    id: 6,
    title: "Shopnetic",
    description: "A mobile-friendly online store with advanced features.",
    technologies: ["React Native", "JavaScript", "Expo", "FirebaseAuth", "AsyncStorage"],
    image: Project_5,
    // liveUrl: "#",
    githubUrl: "https://github.com/Ankit1141192/ReactNativeProject",
    category: "mobile",
    featured: true,
  },
  {
    id: 7,
    title: "StopWatch",
    description: "A simple stopwatch app built with React Native.",
    technologies: ["React Native", "JavaScript", "Expo", "AsyncStorage"],
    image: Project_7,
    // liveUrl: "#",
    githubUrl: "https://github.com/Ankit1141192/StopWatch-Timer-App",
    category: "mobile",
    featured: false,
  },
  {
    id: 8,
    title: "ChargeGrid",
    description:
      "ChargeGrid is a React Native CLI mobile application built to help electric vehicle (EV) users find distance between two points.",
    technologies: ["React Native", "JavaScript", "AsyncStorage", "CLI", "Map"],
    image: Project_8,
    // liveUrl: "#",
    githubUrl: "https://github.com/Ankit1141192/ChargeGrid",
    category: "mobile",
    featured: false,
  },
  {
    id: 9,
    title:"SkillUp",
    description: "SkillUp is an engaging and user-friendly E-learning mobile application built using React Native.",
    technologies: ["React Native", "JavaScript", "Firebase","Firebase cloud messaging", "AsyncStorage","CLI"],
    image: Project_9,
    liveUrl:"https://drive.google.com/uc?export=download&id=1nDNxRXu9WLZ7nl2b1ug7uXDB_VOX-CnL",
    githubUrl: "https://github.com/Ankit1141192/SkillUp"

  }
];


  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile Apps' },

  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My Projects
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of projects I've worked on, ranging from web applications to mobile apps and design work
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover object-top group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-external-link-line text-gray-800 text-xl"></i>
                  </a>
                  <a
                    href={project.githubUrl}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <i className="ri-github-line text-gray-800 text-xl"></i>
                  </a>
                </div>
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full capitalize">
                    {project.category}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <a
                    href={project.liveUrl}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer whitespace-nowrap"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer whitespace-nowrap"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Want to see more of my work? Check out my GitHub profile.
          </p>
          <a
            href="https://github.com/Ankit1141192"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-900 dark:hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-medium transition-colors cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap"
          >
            <i className="ri-github-line text-xl"></i>
            <span>View All Projects</span>
          </a>
        </div>
      </div>
    </section>
  );
}