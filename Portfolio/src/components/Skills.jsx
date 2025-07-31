import { useState } from 'react';
import HTML from "../assets/html.svg";
import CSS from "../assets/css.svg";
import JavaScript from "../assets/javascript.svg";
import Reactjs from '../assets/reactjs.svg';
import Tailwind from '../assets/tailwind.svg';
import TypeScript from '../assets/typescript.svg';
import Nodejs from '../assets/nodejs.svg';
import Express from '../assets/express.svg';
import MongoDB from '../assets/mongodb.svg';
import GitHub from '../assets/github.svg';
import Firebase from '../assets/firebase.svg';
import VSCode from '../assets/vscode.svg';
import Postman from '../assets/postman.svg';
import ReactNative from '../assets/reactjs.svg';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('technical');

  const skillCategories = {
    technical: [
      { name: 'HTML', level: 95, icon: HTML, color: 'bg-orange-500' },
      { name: 'CSS', level: 90, icon: CSS, color: 'bg-blue-500' },
      { name: 'JavaScript', level: 90, icon: JavaScript, color: 'bg-yellow-500' },
      { name: 'Tailwind CSS', level: 92, icon: Tailwind, color: 'bg-cyan-600' },
      { name: 'React', level: 85, icon: Reactjs, color: 'bg-cyan-500' },
      {name: 'React Native', level: 85, icon: ReactNative, color: 'bg-blue-500' },
      { name: 'TypeScript', level: 85, icon: TypeScript, color: 'bg-blue-600' },
      { name: 'Firebase', level: 80, icon: Firebase, color: 'bg-yellow-500' },
      { name: 'Node.js', level: 88, icon: Nodejs, color: 'bg-green-500' },
      { name: 'Express.js', level: 85, icon: Express, color: 'bg-gray-800' },
      { name: 'MongoDB', level: 83, icon: MongoDB, color: 'bg-green-600' },
    ],
    tools: [
      { name: 'GitHub', level: 92, icon: GitHub, color: 'bg-gray-700' },
      { name: 'VS Code', level: 95, icon: VSCode, color: 'bg-blue-600' },
      { name: 'Postman', level: 88, icon: Postman, color: 'bg-orange-500' },
    ],
  };

  const categories = [
    { id: 'technical', label: 'Technical Skills' },
    { id: 'tools', label: 'Tools' },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Skills
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A list of technologies and tools I use to build seamless and modern web/mobile applications.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories[activeCategory].map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform duration-200`}
                >
                  <img
                    src={skill.icon}
                    alt={`${skill.name} icon`}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.level}% Proficiency
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="text-gray-800 dark:text-white font-medium">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${skill.color}`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
