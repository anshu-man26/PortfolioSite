import React from 'react';

const Experience = ({ experience, education }) => {
  const expList = (experience && experience.length) ? experience : [
    {
      title: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description: 'Developing full-stack web applications using MERN stack, implementing real-time features, and ensuring optimal user experience.'
    }
  ];
  const eduList = (education && education.length) ? education : [
    {
      type: 'college',
      institution: 'IIT Delhi',
      program: 'B.Tech',
      branch: 'Computer Science',
      startYear: '2020',
      endYear: '2024',
      description: 'Focused on software engineering, web development, and database management.'
    }
  ];
  return (
    <section id="experience" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-white text-left tracking-tight" style={{letterSpacing: '-0.02em'}}>Experience</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {expList.map((exp, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col gap-2 shadow-2xl hover-lift transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/20">
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5V6.75A2.25 2.25 0 0 0 14.25 4.5h-4.5A2.25 2.25 0 0 0 7.5 6.75v.75m9 0v10.5A2.25 2.25 0 0 1 14.25 20.25h-4.5A2.25 2.25 0 0 1 7.5 18.75V7.5m9 0H7.5" /></svg>
              </span>
              <div>
                <div className="text-xl font-semibold text-white mb-0.5">{exp.title}</div>
                <div className="text-white/70 text-sm">{exp.company}</div>
              </div>
            </div>
            <div className="text-white/80 text-base mb-2">{exp.description}</div>
            <div className="flex justify-between items-center mt-auto">
              <div className="text-white/60 text-xs font-mono tracking-wide bg-white/10 px-3 py-1 rounded-full">{exp.period}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-semibold mb-8 text-white text-left tracking-tight" style={{letterSpacing: '-0.02em'}}>Education</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {eduList.map((edu, idx) => (
          <div key={idx} className="bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col gap-2 shadow-2xl hover-lift transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              {/* Education PFP or default icon */}
              {(edu.collegePfp || edu.schoolPfp) ? (
                <img 
                  src={edu.collegePfp || edu.schoolPfp} 
                  alt={edu.type === 'college' ? edu.institution : edu.schoolName} 
                  className="w-10 h-10 rounded-full object-cover border border-white/30 flex-shrink-0" 
                />
              ) : (
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 border border-white/20">
                  <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v-4.5m0 0V6.75m0 3v-3m0 3h3.75m-3.75 0H8.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              </span>
              )}
              <div className="flex-1">
                {edu.type === 'college' ? (
                  <>
                    <div className="text-xl font-semibold text-white mb-0.5">{edu.institution}</div>
                    <div className="text-white/90 text-base font-light mb-0.5">{edu.program}</div>
                    <div className="text-white/80 text-base font-light mb-0.5">{edu.branch}</div>
                    <div className="text-white/70 text-sm mb-0.5">{edu.startYear} - {edu.endYear}</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-semibold text-white mb-0.5">{edu.schoolName}</div>
                    <div className="text-white/90 text-base font-light mb-0.5">{edu.board}</div>
                    <div className="text-white/70 text-sm mb-0.5">{edu.class} - {edu.yearOfPassing}</div>
                  </>
                )}
              </div>
            </div>
            {edu.type === 'college' && edu.description && (
              <div className="text-white/80 text-base mb-2">{edu.description}</div>
            )}
            {edu.type === 'school' && edu.marks && (
              <div className="text-white/80 text-base mb-2">Marks: {edu.marks}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 