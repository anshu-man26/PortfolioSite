/**
 * Add feature image slideshow on hover over the large image box.
 * - Use React.useState for currentSlide per project (by index)
 * - On hover, show overlay with slideshow and arrows
 * - Show feature title/description below image
 */
import React, { useState, useEffect, useRef } from 'react';

const Projects = ({ projects = [] }) => {
  // Track current slide for each project by index
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [slideIndices, setSlideIndices] = useState({});
  const [isTransitioning, setIsTransitioning] = useState({});
  const intervalsRef = useRef({});

  const handleMouseEnter = (projectIdx) => {
    setHoveredIndex(projectIdx);
    // Stop the auto slideshow for this project
    if (intervalsRef.current[projectIdx]) {
      clearInterval(intervalsRef.current[projectIdx]);
      intervalsRef.current[projectIdx] = null;
    }
    // Only reset to first slide if no slide index exists for this project
    setSlideIndices((prev) => ({ 
      ...prev, 
      [projectIdx]: prev[projectIdx] !== undefined ? prev[projectIdx] : 0 
    }));
  };
  
  const handleMouseLeave = () => {
    setHoveredIndex(null);
    // Resume auto slideshow for all projects
    startAutoSlideshow();
  };
  
  const handlePrev = (projectIdx, featuresWithImages) => {
    console.log(`handlePrev called for project ${projectIdx}, current slide: ${slideIndices[projectIdx] || 0}, total slides: ${featuresWithImages.length}`);
    setIsTransitioning(prev => ({ ...prev, [projectIdx]: true }));
    setSlideIndices((prev) => {
      const currentIndex = prev[projectIdx] || 0;
      const newIndex = (currentIndex - 1 + featuresWithImages.length) % featuresWithImages.length;
      console.log(`Setting slide index for project ${projectIdx} from ${currentIndex} to ${newIndex} (total slides: ${featuresWithImages.length})`);
      return {
        ...prev,
        [projectIdx]: newIndex,
      };
    });
    setTimeout(() => setIsTransitioning(prev => ({ ...prev, [projectIdx]: false })), 300);
  };
  
  const handleNext = (projectIdx, featuresWithImages) => {
    console.log(`handleNext called for project ${projectIdx}, current slide: ${slideIndices[projectIdx] || 0}, total slides: ${featuresWithImages.length}`);
    setIsTransitioning(prev => ({ ...prev, [projectIdx]: true }));
    setSlideIndices((prev) => {
      const currentIndex = prev[projectIdx] || 0;
      const newIndex = (currentIndex + 1) % featuresWithImages.length;
      console.log(`Setting slide index for project ${projectIdx} from ${currentIndex} to ${newIndex} (total slides: ${featuresWithImages.length})`);
      return {
        ...prev,
        [projectIdx]: newIndex,
      };
    });
    setTimeout(() => setIsTransitioning(prev => ({ ...prev, [projectIdx]: false })), 300);
  };

  // Start auto slideshow for all projects
  const startAutoSlideshow = () => {
    console.log('Starting auto slideshow...');
    projects.forEach((project, index) => {
      const featuresWithImages = (project.features || []).filter(f => f && f.imageUrl);
      // Remove duplicates based on imageUrl
      const uniqueFeaturesWithImages = featuresWithImages.filter((feature, idx, self) => 
        idx === self.findIndex(f => f.imageUrl === feature.imageUrl)
      );
      
      // Sort features by order field (if available) to maintain admin panel order
      const sortedFeaturesWithImages = uniqueFeaturesWithImages.sort((a, b) => {
        // If order field exists, sort by it, otherwise maintain current order
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });
      
      console.log(`Project ${index}: ${sortedFeaturesWithImages.length} sorted features with images`);
      
      if (sortedFeaturesWithImages.length > 1) {
        // Clear existing interval if any
        if (intervalsRef.current[index]) {
          clearInterval(intervalsRef.current[index]);
        }
        
        console.log(`Setting up interval for project ${index}`);
        intervalsRef.current[index] = setInterval(() => {
          // Only auto-advance if not currently hovered
          if (hoveredIndex !== index) {
            console.log(`Auto-advancing slide for project ${index}`);
            setIsTransitioning(prev => ({ ...prev, [index]: true }));
            setSlideIndices((prev) => {
              const currentIndex = prev[index] || 0;
              const newIndex = (currentIndex + 1) % sortedFeaturesWithImages.length;
              console.log(`Auto-advance: Setting slide index for project ${index} from ${currentIndex} to ${newIndex} (total slides: ${sortedFeaturesWithImages.length})`);
              return {
                ...prev,
                [index]: newIndex,
              };
            });
            setTimeout(() => setIsTransitioning(prev => ({ ...prev, [index]: false })), 300);
          }
        }, 2000); // Change slide every 2 seconds
      }
    });
  };

  // Auto slideshow effect - start on mount and when projects change
  useEffect(() => {
    // Start slideshow immediately
    startAutoSlideshow();

    return () => {
      // Cleanup all intervals
      const intervals = intervalsRef.current;
      Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [projects, hoveredIndex, startAutoSlideshow]); // Add startAutoSlideshow to dependencies

  // Debug logging to check if slideshow is working
  useEffect(() => {
    console.log('Projects data:', projects);
    console.log('Slide indices:', slideIndices);
    console.log('Hovered index:', hoveredIndex);
  }, [projects, slideIndices, hoveredIndex]);

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-white/20 mx-auto"></div>
        </div>

        <div className="space-y-16">
          {(projects || []).map((project, index) => {
            // Filter features that have images - use imageUrl field from Feature model
            const featuresWithImages = (project.features || []).filter(f => {
              if (!f) return false;
              return f.imageUrl; // Use imageUrl field from Feature model
            });
            
            // Remove duplicates based on imageUrl to prevent slideshow issues
            const uniqueFeaturesWithImages = featuresWithImages.filter((feature, index, self) => 
              index === self.findIndex(f => f.imageUrl === feature.imageUrl)
            );
            
            // Sort features by order field (if available) to maintain admin panel order
            const sortedFeaturesWithImages = uniqueFeaturesWithImages.sort((a, b) => {
              // If order field exists, sort by it, otherwise maintain current order
              if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
              }
              return 0;
            });
            
            const currentSlide = slideIndices[index] || 0;
            const transitioning = isTransitioning[index] || false;
            
            // Use sorted features for slideshow
            const slideshowFeatures = sortedFeaturesWithImages;
            
            // Debug logging for this specific project
            console.log(`Project ${index} (${project.title}):`, {
              totalFeatures: project.features?.length || 0,
              featuresWithImages: featuresWithImages.length,
              uniqueFeatures: uniqueFeaturesWithImages.length,
              sortedFeatures: sortedFeaturesWithImages.length,
              currentSlide: currentSlide,
              imageUrls: sortedFeaturesWithImages.map(f => f.imageUrl),
              currentImageUrl: sortedFeaturesWithImages[currentSlide]?.imageUrl,
              orders: sortedFeaturesWithImages.map(f => f.order)
            });
            
            return (
              <div key={project.id || project._id || index}>
                <div 
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Project Image/Slideshow */}
                  <div 
                    className={`relative group ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden flex items-center justify-center">
                      {/* Show current feature image if not hovered, otherwise show slideshow */}
                      {slideshowFeatures.length > 0 ? (
                        hoveredIndex === index ? (
                          <>
                            <img
                              src={slideshowFeatures[currentSlide].imageUrl}
                              alt={slideshowFeatures[currentSlide].title || 'Feature'}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${
                                transitioning ? 'opacity-70' : 'opacity-100'
                              }`}
                            />
                            {/* Slideshow overlay - only navigation arrows */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-between z-10">
                              {/* Navigation arrows at top */}
                              {slideshowFeatures.length > 1 && (
                                <div className="flex justify-between items-center p-4">
                                  <button
                                    onClick={e => { e.stopPropagation(); handlePrev(index, slideshowFeatures); }}
                                    className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); handleNext(index, slideshowFeatures); }}
                                    className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-300"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                  </button>
                                </div>
                              )}
                              
                              {/* Slide indicator at bottom */}
                              {slideshowFeatures.length > 1 && (
                                <div className="flex justify-center p-4">
                                  <div className="flex space-x-2">
                                    {slideshowFeatures.map((_, slideIndex) => (
                                      <div
                                        key={slideIndex}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                          slideIndex === currentSlide 
                                            ? 'bg-white' 
                                            : 'bg-white/30'
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
                            alt={slideshowFeatures[currentSlide].title || 'Feature'}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-light text-white/80 mb-2">{project.title || project.name || 'Project'}</h3>
                            <p className="text-white/60 font-light">Project Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Feature description outside image box */}
                    {slideshowFeatures.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className={`text-xl font-semibold text-white transition-all duration-300 ease-out ${
                          transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}>
                          {slideshowFeatures[currentSlide].title}
                        </h4>
                        <p className={`text-white/70 text-base leading-relaxed font-light transition-all duration-300 ease-out delay-75 ${
                          transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}>
                          {slideshowFeatures[currentSlide].description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="flex items-center gap-4">
                      {/* Project Profile Picture */}
                      {(project.imageUrl || project.mainImage) && (
                        <div className="w-16 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                          <img
                            src={project.imageUrl || project.mainImage}
                            alt={project.title || project.name || 'Project'}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-3xl md:text-4xl font-light text-white">
                        {project.title || project.name || 'Project'}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-white/70 leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-light text-white/80">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || project.techStack || []).map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 font-light text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-light text-white/80">Key Features:</h4>
                      <ul className="space-y-2">
                        {(project.features || [])
                          .filter(feature => feature && feature.isKeyFeature)
                          .slice(0, 4)
                          .map((feature, featureIndex) => (
                          <li key={feature._id || featureIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-white/60 font-light text-sm">
                              {typeof feature === 'string' ? feature : feature.title || feature.description || JSON.stringify(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {(!project.features || project.features.filter(f => f && f.isKeyFeature).length === 0) && (
                        <p className="text-white/40 text-sm italic">No key features selected</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all duration-300 text-center"
                      >
                        View on GitHub
                      </a>
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300 text-center"
                      >
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Beautiful separation line between projects */}
                {index < projects.length - 1 && (
                  <div className="mt-16 pt-8">
                    <div className="relative">
                      {/* Gradient line */}
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      {/* Center accent */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-full border border-white/10 backdrop-blur-sm"></div>
                      {/* Subtle glow effect */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-sm"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects; 