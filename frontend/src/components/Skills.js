import React from 'react';

const Skills = ({ skills }) => {
  const skillList = (skills && skills.length) ? skills : [
    'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'RESTful APIs', 'Socket.io', 'JWT Authentication', 'Cloudinary', 'Razorpay'
  ];
  return (
    <section id="skills" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-white text-left tracking-tight" style={{letterSpacing: '-0.02em'}}>Skills</h2>
      <div className="flex flex-wrap gap-3">
        {skillList.map((skill, idx) => (
          <span key={idx} className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-base font-light border border-white/10 shadow-sm">{skill}</span>
        ))}
      </div>
    </section>
  );
};

export default Skills; 