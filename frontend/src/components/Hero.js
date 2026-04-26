import React from 'react';

const Hero = ({ personalInfo }) => {
  const resumeLink = personalInfo?.resumeLink;
  const title = personalInfo?.title || 'Full Stack Developer';

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-12"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-blue-500/20 rounded-full blur-3xl animate-slow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-purple-500/20 rounded-full blur-3xl animate-slow-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-6">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs md:text-sm tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Available for opportunities
            </span>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="text-lg md:text-xl font-light text-white/70">Hello, I'm</h2>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white leading-[1.05]">
              <span className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-transparent">
                {personalInfo?.name || 'My Portfolio'}
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up animation-delay-600">
            <h3 className="text-xl md:text-3xl font-light">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h3>
          </div>

          <div className="animate-fade-in-up animation-delay-800">
            <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
              {personalInfo?.about ||
                'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies.'}
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-1000 pt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 bg-white text-black rounded-full font-medium transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-white/10"
              >
                View My Work
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 border border-white/25 text-white rounded-full font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/40"
              >
                Get In Touch
              </button>
              {resumeLink && (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-purple-500/30 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
