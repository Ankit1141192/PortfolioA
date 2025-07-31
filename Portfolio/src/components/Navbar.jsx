import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'skills', label: 'Skills', path: '/skills' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const handleNavigation = (path, sectionId) => {
    if (location.pathname === '/' && path === '/') {
      // We're on homepage, scroll to section
      scrollToSection(sectionId);
    } else if (path === '/') {
      // Navigate to homepage
      navigate('/');
      setActiveSection('home');
    } else {
      // Navigate to individual page
      navigate(path);
      setActiveSection(sectionId);
    }
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track scroll position on homepage
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Set active section based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveSection(currentItem.id);
    }
  }, [location.pathname]);

  const isActive = (sectionId) => {
    return activeSection === sectionId;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-6xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
        <div className="flex items-center justify-between">

          {/* Left: Logo */}
          <button 
            onClick={() => handleNavigation('/', 'home')}
            className="text-2xl font-bold text-gray-800 font-[cursive] hover:scale-105 transition-transform"
          >
            <span className="text-purple-500">&lt;Ankit Kumar/&gt;</span>
          </button>

          {/* Center: Desktop Nav */}
          <div className="hidden sm:flex flex-1 items-center justify-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive(item.id)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: Desktop Toggle + Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <i
                className={`ri-${darkMode ? 'sun' : 'moon'}-line text-lg text-gray-600 dark:text-gray-300`}
              ></i>
            </button> */}

            <a
              href="https://drive.google.com/file/d/1k9nnMbEITRUGn8xNQxyFbaYHfZ2IlUw_/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <span>View Resume</span>
              <i className="ri-external-link-line text-sm"></i>
            </a>
          </div>

          {/* Right: Mobile Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl text-gray-700 dark:text-white"
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-[70%] max-w-xs h-full bg-white dark:bg-gray-900 shadow-lg p-6 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => handleNavigation('/', 'home')}
                className="text-xl font-bold text-purple-500"
              >
                &lt;Ankit/&gt;
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-700 dark:text-white"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`block w-full text-left px-2 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition ${
                    isActive(item.id)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Divider */}
              <hr className="my-4 border-gray-300 dark:border-gray-600" />

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-2 py-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <i
                  className={`ri-${darkMode ? 'sun' : 'moon'}-line text-lg text-gray-600 dark:text-gray-300`}
                ></i>
                <span className="text-gray-700 dark:text-gray-200">Toggle Theme</span>
              </button>

              {/* Hire Me Button */}
              <a
                href="https://drive.google.com/uc?export=download&id=1k9nnMbEITRUGn8xNQxyFbaYHfZ2IlUw_"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Hire Me</span>
                <i className="ri-download-line text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}