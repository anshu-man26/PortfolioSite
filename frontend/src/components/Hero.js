import React from 'react';

const Hero = ({ personalInfo }) => {
  const resumeLink = personalInfo?.resumeLink;
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Static background elements for Hero section */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8">
          {/* Greeting */}
          <div className="animate-fade-in-up">
            <h2 className="text-xl md:text-2xl font-light text-white/80 mb-4">
              Hello, I'm
            </h2>
          </div>

          {/* Name */}
          <div className="animate-fade-in-up animation-delay-200">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-6">
              {personalInfo?.name || 'My Portfolio'}
            </h1>
          </div>

          {/* Title */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="text-2xl md:text-3xl font-light text-white/70 mb-8">
              {personalInfo?.title || 'Full Stack Developer'}
            </h3>
          </div>

          {/* Description */}
          <div className="animate-fade-in-up animation-delay-600">
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
              {personalInfo?.about || 'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies.'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-800 pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
              >
                View My Work
              </button>
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300"
              >
                Get In Touch
              </button>
              {resumeLink && (
                <button 
                  onClick={() => window.open(resumeLink, '_blank')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Resume
                </button>
              )}
            </div>
          </div>

          {/* Scroll indicator removed */}
        </div>
      </div>
    </section>
  );
};

export default Hero; 