import React from 'react';
import Reveal from './Reveal';

const About = ({ personalInfo, aboutMe }) => {
  const about =
    aboutMe ||
    personalInfo?.about ||
    'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies. I build scalable and user-friendly applications with a focus on clean code and best practices.';

  return (
    <section id="about" className="py-20 px-4 max-w-5xl mx-auto">
      <Reveal>
        <h2
          className="title-underline text-3xl md:text-4xl font-semibold mb-12 text-white tracking-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          About Me
        </h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-700/30 backdrop-blur-xl border border-white/15 rounded-3xl p-8 md:p-10 shadow-2xl hover-lift overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {personalInfo?.pfp ? (
              <img
                src={personalInfo.pfp}
                alt={personalInfo?.name ? `${personalInfo.name}'s profile` : 'Profile'}
                loading="lazy"
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-white/25 flex-shrink-0 shadow-xl shadow-purple-500/10 ring-1 ring-white/10"
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-white/25 flex items-center justify-center flex-shrink-0 shadow-xl">
                <svg className="w-10 h-10 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <p className="text-white/85 text-base md:text-lg leading-relaxed font-light">
                {about}
              </p>
              {(personalInfo?.location || personalInfo?.email) && (
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
                  {personalInfo.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {personalInfo.location}
                    </span>
                  )}
                  {personalInfo.email && (
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {personalInfo.email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default About;
