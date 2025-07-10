import React, { useState, useEffect } from 'react';
import portfolioIcon from '../assets/portfolio.png';

const Header = ({ personalInfo }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <img 
                src={portfolioIcon} 
                alt="Portfolio Icon" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <span className="text-2xl font-light tracking-wide">
              {personalInfo?.name || 'My Portfolio'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('skills')}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light"
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-light"
            >
              Contact
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 