import React from 'react';

const Hero = ({ personalInfo }) => {
  const resumeLink = personalInfo?.resumeLink;
  const title = personalInfo?.title || 'Full Stack Developer';
  const name = personalInfo?.name || 'My Portfolio';

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-28 pb-24"
      style={{ backgroundColor: 'rgb(var(--indigo))' }}
    >
      {/* Lime block on the right (visible from md and up) */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-0 right-0 h-full w-[42%] z-0"
        style={{ backgroundColor: 'rgb(var(--lime))' }}
      />

      {/* Memphis flourishes */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        {/* curving line on the left */}
        <svg
          className="absolute -left-10 top-10 w-72 h-[80%] opacity-40"
          viewBox="0 0 200 800"
          fill="none"
        >
          <path
            d="M120 0 C 30 200, 220 380, 80 560 S 180 760, 120 800"
            stroke="rgb(var(--lime))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* zigzag near image */}
        <svg
          className="hidden md:block absolute right-[44%] top-[40%] w-32 h-12 opacity-80"
          viewBox="0 0 200 60"
          fill="none"
        >
          <polyline
            points="0,30 25,5 50,30 75,5 100,30 125,5 150,30 175,5 200,30"
            stroke="rgb(var(--lime))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* dot grids */}
        <div className="hidden md:block absolute right-[8%] top-[12%] w-32 h-24 dot-grid-light opacity-90" />
        <div className="hidden md:block absolute right-[6%] bottom-[14%] w-40 h-32 dot-grid opacity-80" />

        {/* small squares */}
        <div className="hidden md:block absolute right-[3%] top-[42%] flex flex-col gap-3">
          <span className="block w-3 h-3 rotate-45" style={{ backgroundColor: 'rgb(var(--indigo))' }} />
          <span className="block w-3 h-3 rotate-45" style={{ backgroundColor: 'rgb(var(--indigo))' }} />
          <span className="block w-3 h-3 rotate-45" style={{ backgroundColor: 'rgb(var(--indigo))' }} />
        </div>
      </div>

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 items-center">
        {/* Left: typography */}
        <div className="md:col-span-7 space-y-6">
          <div className="animate-fade-in-up">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm tracking-widest uppercase border"
              style={{
                color: 'rgb(var(--lime))',
                borderColor: 'rgba(var(--lime), 0.4)',
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'rgb(var(--lime))' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: 'rgb(var(--lime))' }}
                />
              </span>
              Available for opportunities
            </span>
          </div>

          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-base md:text-lg font-light text-white/80">Hello, I'm</p>
            <h2 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
              {name}
            </h2>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <h1
              className="font-extrabold tracking-[-0.03em] leading-[0.95] text-6xl sm:text-7xl md:text-8xl"
              style={{ color: 'rgb(var(--lime))' }}
            >
              {title}<span className="text-white">.</span>
            </h1>
          </div>

          <div className="animate-fade-in-up animation-delay-600">
            <p className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed font-light">
              {personalInfo?.about ||
                'I like to craft solid and scalable products with great user experiences.'}
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-800 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl"
                style={{
                  backgroundColor: 'rgb(var(--lime))',
                  color: 'rgb(var(--ink))',
                  boxShadow: '0 10px 30px rgba(199, 251, 110, 0.35)',
                }}
              >
                View My Work
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-full font-semibold border-2 text-white transition-all duration-300 hover:scale-[1.04]"
                style={{ borderColor: 'rgba(var(--lime), 0.6)' }}
              >
                Get In Touch
              </button>
              {resumeLink && (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.04] flex items-center gap-2"
                  style={{ backgroundColor: 'white', color: 'rgb(var(--ink))' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </a>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-1000 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg">
            <div className="text-white/85 text-sm leading-relaxed">
              <span className="block w-6 h-px mb-2" style={{ backgroundColor: 'rgb(var(--lime))' }} />
              Highly skilled at progressive enhancement, design systems & UI engineering.
            </div>
            <div className="text-white/85 text-sm leading-relaxed">
              <span className="block w-6 h-px mb-2" style={{ backgroundColor: 'rgb(var(--lime))' }} />
              Building scalable products with clean code and modern best practices.
            </div>
          </div>
        </div>

        {/* Right: portrait card */}
        <div className="md:col-span-5 relative animate-fade-in-up animation-delay-600">
          <div className="relative mx-auto md:mx-0 md:ml-auto w-72 sm:w-80 md:w-96">
            {/* outline frame, slightly offset */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 w-full h-full rounded-sm border-2 z-0"
              style={{ borderColor: 'rgba(255,255,255,0.85)' }}
            />
            <div className="relative z-10 aspect-[4/5] rounded-sm overflow-hidden shadow-2xl ring-2 ring-black/10 bg-white/10">
              {personalInfo?.pfp ? (
                <img
                  src={personalInfo.pfp}
                  alt={`${name} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                >
                  <svg className="w-24 h-24 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
