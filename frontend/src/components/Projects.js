import React, { useState, useEffect, useRef, useCallback } from 'react';
import Reveal from './Reveal';

const Projects = ({ projects = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [slideIndices, setSlideIndices] = useState({});
  const [isTransitioning, setIsTransitioning] = useState({});
  const intervalsRef = useRef({});

  const handleMouseEnter = (projectIdx) => {
    setHoveredIndex(projectIdx);
    if (intervalsRef.current[projectIdx]) {
      clearInterval(intervalsRef.current[projectIdx]);
      intervalsRef.current[projectIdx] = null;
    }
    setSlideIndices((prev) => ({
      ...prev,
      [projectIdx]: prev[projectIdx] !== undefined ? prev[projectIdx] : 0,
    }));
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    startAutoSlideshow();
  };

  const handlePrev = (projectIdx, featuresWithImages) => {
    setIsTransitioning((prev) => ({ ...prev, [projectIdx]: true }));
    setSlideIndices((prev) => {
      const currentIndex = prev[projectIdx] || 0;
      const newIndex = (currentIndex - 1 + featuresWithImages.length) % featuresWithImages.length;
      return { ...prev, [projectIdx]: newIndex };
    });
    setTimeout(() => setIsTransitioning((prev) => ({ ...prev, [projectIdx]: false })), 300);
  };

  const handleNext = (projectIdx, featuresWithImages) => {
    setIsTransitioning((prev) => ({ ...prev, [projectIdx]: true }));
    setSlideIndices((prev) => {
      const currentIndex = prev[projectIdx] || 0;
      const newIndex = (currentIndex + 1) % featuresWithImages.length;
      return { ...prev, [projectIdx]: newIndex };
    });
    setTimeout(() => setIsTransitioning((prev) => ({ ...prev, [projectIdx]: false })), 300);
  };

  const startAutoSlideshow = useCallback(() => {
    projects.forEach((project, index) => {
      const featuresWithImages = (project.features || []).filter((f) => f && f.imageUrl);
      const uniqueFeaturesWithImages = featuresWithImages.filter(
        (feature, idx, self) => idx === self.findIndex((f) => f.imageUrl === feature.imageUrl)
      );
      const sortedFeaturesWithImages = uniqueFeaturesWithImages.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
        return 0;
      });

      if (sortedFeaturesWithImages.length > 1) {
        if (intervalsRef.current[index]) {
          clearInterval(intervalsRef.current[index]);
        }
        intervalsRef.current[index] = setInterval(() => {
          if (hoveredIndex !== index) {
            setIsTransitioning((prev) => ({ ...prev, [index]: true }));
            setSlideIndices((prev) => {
              const currentIndex = prev[index] || 0;
              const newIndex = (currentIndex + 1) % sortedFeaturesWithImages.length;
              return { ...prev, [index]: newIndex };
            });
            setTimeout(() => setIsTransitioning((prev) => ({ ...prev, [index]: false })), 300);
          }
        }, 3000);
      }
    });
  }, [projects, hoveredIndex]);

  useEffect(() => {
    startAutoSlideshow();
    const currentIntervals = intervalsRef.current;
    return () => {
      Object.values(currentIntervals).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [startAutoSlideshow]);

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-black via-gray-900/40 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-6xl font-light text-white">
              Featured{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
        </Reveal>

        <div className="space-y-20">
          {(projects || []).map((project, index) => {
            const featuresWithImages = (project.features || []).filter((f) => f && f.imageUrl);
            const uniqueFeaturesWithImages = featuresWithImages.filter(
              (feature, idx, self) => idx === self.findIndex((f) => f.imageUrl === feature.imageUrl)
            );
            const sortedFeaturesWithImages = uniqueFeaturesWithImages.sort((a, b) => {
              if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
              return 0;
            });

            const currentSlide = slideIndices[index] || 0;
            const transitioning = isTransitioning[index] || false;
            const slideshowFeatures = sortedFeaturesWithImages;

            return (
              <Reveal key={project.id || project._id || index} delay={50}>
                <div>
                  <div
                    className={`grid lg:grid-cols-2 gap-10 lg:gap-12 items-center ${
                      index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                    }`}
                  >
                    {/* Project Image / Slideshow */}
                    <div
                      className={`relative group ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="relative w-full h-80 md:h-96 rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm shadow-2xl shadow-purple-500/10 group-hover:shadow-purple-500/30 transition-shadow duration-500">
                        {/* Gradient frame highlight */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-white/10 group-hover:ring-white/25 transition-all duration-300" />

                        {slideshowFeatures.length > 0 ? (
                          hoveredIndex === index ? (
                            <>
                              <img
                                src={slideshowFeatures[currentSlide].imageUrl}
                                alt={slideshowFeatures[currentSlide].title || 'Feature preview'}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                  transitioning ? 'opacity-70' : 'opacity-100'
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between z-10 pointer-events-none">
                                {slideshowFeatures.length > 1 && (
                                  <div className="flex justify-between items-center p-4 pointer-events-auto">
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handlePrev(index, slideshowFeatures); }}
                                      aria-label="Previous slide"
                                      className="bg-white/15 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-all duration-300 hover:scale-110"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleNext(index, slideshowFeatures); }}
                                      aria-label="Next slide"
                                      className="bg-white/15 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-md transition-all duration-300 hover:scale-110"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                )}

                                {slideshowFeatures.length > 1 && (
                                  <div className="flex justify-center p-4">
                                    <div className="flex space-x-2">
                                      {slideshowFeatures.map((_, slideIndex) => (
                                        <span
                                          key={slideIndex}
                                          className={`h-1.5 rounded-full transition-all duration-300 ${
                                            slideIndex === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <img
                              src={slideshowFeatures[currentSlide].imageUrl}
                              alt={slideshowFeatures[currentSlide].title || 'Feature preview'}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/15">
                                <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                                  <circle cx="12" cy="13" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <h3 className="text-2xl font-light text-white/80 mb-1">
                                {project.title || project.name || 'Project'}
                              </h3>
                              <p className="text-white/50 font-light text-sm">Preview unavailable</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {slideshowFeatures.length > 0 && (
                        <div className="mt-6 space-y-2 min-h-[5rem]">
                          <h4
                            className={`text-xl font-semibold text-white transition-all duration-300 ease-out ${
                              transitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                            }`}
                          >
                            {slideshowFeatures[currentSlide].title}
                          </h4>
                          <p
                            className={`text-white/70 text-base leading-relaxed font-light transition-all duration-300 ease-out delay-75 ${
                              transitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                            }`}
                          >
                            {slideshowFeatures[currentSlide].description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <div className="flex items-center gap-4">
                        {(project.imageUrl || project.mainImage) && (
                          <div className="w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shadow-md shrink-0">
                            <img
                              src={project.imageUrl || project.mainImage}
                              alt={project.title || project.name || 'Project'}
                              loading="lazy"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <h3 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                          {project.title || project.name || 'Project'}
                        </h3>
                      </div>

                      <p className="text-base md:text-lg text-white/70 leading-relaxed font-light">
                        {project.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.25em] text-white/50 font-medium">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {(project.technologies || project.techStack || []).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="skill-chip px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/80 font-light text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.25em] text-white/50 font-medium">Key Features</h4>
                        <ul className="space-y-2">
                          {(project.features || [])
                            .filter((feature) => feature && feature.isKeyFeature)
                            .slice(0, 4)
                            .map((feature, featureIndex) => (
                              <li key={feature._id || featureIndex} className="flex items-start space-x-3">
                                <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0" />
                                <span className="text-white/70 font-light text-sm leading-relaxed">
                                  {typeof feature === 'string'
                                    ? feature
                                    : feature.title || feature.description || ''}
                                </span>
                              </li>
                            ))}
                        </ul>
                        {(!project.features || project.features.filter((f) => f && f.isKeyFeature).length === 0) && (
                          <p className="text-white/40 text-sm italic">No key features selected</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:scale-[1.03] text-center inline-flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
                            View on GitHub
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-center inline-flex items-center justify-center gap-2"
                          >
                            Live Demo
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7M10 14l11-11M5 5h6v2H7v10h10v-4h2v6H5V5z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {index < projects.length - 1 && (
                    <div className="mt-20 pt-4">
                      <div className="relative">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-blue-500/50 to-purple-500/50 rounded-full border border-white/15 backdrop-blur-sm" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-md" />
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}

          {(!projects || projects.length === 0) && (
            <Reveal>
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <p className="text-white/60 text-lg font-light">Projects will appear here once they're added.</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
