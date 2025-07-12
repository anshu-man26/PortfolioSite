import React from 'react';

const About = ({ personalInfo, aboutMe }) => {
  const about = aboutMe || personalInfo?.about || 'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies. I build scalable and user-friendly applications with a focus on clean code and best practices.';
  
  return (
    <section id="about" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-white text-left tracking-tight" style={{letterSpacing: '-0.02em'}}>About Me</h2>
      <div className="bg-gradient-to-br from-slate-900/30 via-slate-800/30 to-slate-700/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl hover-lift transition-all duration-300 animate-fade-in-up">
      <div className="flex items-start gap-6">
        {personalInfo?.pfp ? (
            <img src={personalInfo.pfp} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white/30 flex-shrink-0 shadow-lg" />
        ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-400/40 to-slate-300/40 border-2 border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
          <div className="flex-1">
            <p className="text-white/90 text-lg leading-relaxed font-light">{about}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 