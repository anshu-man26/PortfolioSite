import React from 'react';
import Reveal from './Reveal';

const briefcaseIcon = (
  <svg className="w-6 h-6 text-white/95" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5V6.75A2.25 2.25 0 0 0 14.25 4.5h-4.5A2.25 2.25 0 0 0 7.5 6.75v.75m9 0v10.5A2.25 2.25 0 0 1 14.25 20.25h-4.5A2.25 2.25 0 0 1 7.5 18.75V7.5m9 0H7.5" />
  </svg>
);

const capIcon = (
  <svg className="w-6 h-6 text-white/95" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75l7.5-4.5 7.5 4.5-7.5 4.5-7.5-4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 11v4.5c0 .9 2.69 3 6 3s6-2.1 6-3V11" />
  </svg>
);

const Experience = ({ experience, education }) => {
  const expList = (experience && experience.length) ? experience : [
    {
      title: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description: 'Developing full-stack web applications using MERN stack, implementing real-time features, and ensuring optimal user experience.',
    },
  ];

  const eduList = (education && education.length) ? education : [
    {
      type: 'college',
      institution: 'IIT Delhi',
      program: 'B.Tech',
      branch: 'Computer Science',
      startYear: '2020',
      endYear: '2024',
      description: 'Focused on software engineering, web development, and database management.',
    },
  ];

  return (
    <section id="experience" className="py-20 px-4 max-w-5xl mx-auto">
      <Reveal>
        <h2 className="title-underline text-3xl md:text-4xl font-semibold mb-12 text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Experience
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
        {expList.map((exp, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            <div className="group relative bg-gradient-to-br from-blue-900/25 via-purple-900/20 to-indigo-900/25 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl hover-lift overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
              <div className="flex items-start gap-4 mb-4">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/15 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  {briefcaseIcon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-semibold text-white leading-tight">{exp.title}</div>
                  <div className="text-white/70 text-sm mt-0.5">{exp.company}</div>
                </div>
              </div>
              {exp.description && (
                <p className="text-white/75 text-base leading-relaxed font-light flex-1">{exp.description}</p>
              )}
              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="inline-block text-white/60 text-xs font-mono tracking-wide bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {exp.period}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="title-underline text-3xl md:text-4xl font-semibold mb-12 text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Education
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {eduList.map((edu, idx) => (
          <Reveal key={idx} delay={idx * 100}>
            <div className="group relative bg-gradient-to-br from-emerald-900/25 via-teal-900/20 to-cyan-900/25 backdrop-blur-xl border border-white/15 rounded-2xl p-7 shadow-2xl hover-lift overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
              <div className="flex items-start gap-4 mb-3">
                {(edu.collegePfp || edu.schoolPfp) ? (
                  <img
                    src={edu.collegePfp || edu.schoolPfp}
                    alt={edu.type === 'college' ? edu.institution : edu.schoolName}
                    loading="lazy"
                    className="w-11 h-11 rounded-xl object-cover border border-white/25 flex-shrink-0 shadow-md"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 border border-white/15 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {capIcon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  {edu.type === 'college' ? (
                    <>
                      <div className="text-xl font-semibold text-white leading-tight">{edu.institution}</div>
                      <div className="text-white/85 text-sm font-light mt-0.5">{edu.program}{edu.branch ? ` · ${edu.branch}` : ''}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl font-semibold text-white leading-tight">{edu.schoolName}</div>
                      <div className="text-white/85 text-sm font-light mt-0.5">{edu.board}{edu.class ? ` · ${edu.class}` : ''}</div>
                    </>
                  )}
                </div>
              </div>

              {edu.type === 'college' && edu.description && (
                <p className="text-white/75 text-base leading-relaxed font-light flex-1">{edu.description}</p>
              )}
              {edu.type === 'school' && edu.marks && (
                <p className="text-white/75 text-base leading-relaxed font-light flex-1">Marks: {edu.marks}</p>
              )}

              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="inline-block text-white/60 text-xs font-mono tracking-wide bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {edu.type === 'college' ? `${edu.startYear} - ${edu.endYear}` : edu.yearOfPassing}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Experience;
