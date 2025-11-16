import { useState } from 'react';

import { projects } from '../config/project';
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');

  
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

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${activeFilter === filter.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
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
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <i className="ri-external-link-line text-gray-800 text-xl"></i>
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer whitespace-nowrap"
                    >
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer whitespace-nowrap"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Profile Link */}
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
