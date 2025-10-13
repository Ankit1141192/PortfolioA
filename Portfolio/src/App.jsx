import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';




// Create separate page components for routing
function HomePage() {
  return (
    <>
      <Hero />

      <About />
     
      <Skills />
      <Services />
      <Projects />
      <Contact />
    </>
  );
}

function AboutPage() {
  return <About />;
}

function SkillsPage() {
  return <Skills />;
}

function ServicesPage() {
  return <Services />;
}

function ProjectsPage() {
  return <Projects />;
}

function ContactPage() {
  return <Contact />;
}

function App() {
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;