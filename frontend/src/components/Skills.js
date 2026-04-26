import React, { useMemo } from 'react';
import Reveal from './Reveal';

const CATEGORIES = [
  {
    label: 'Frontend',
    accent: 'from-blue-500/30 to-cyan-400/20',
    keywords: ['react', 'next', 'vue', 'angular', 'html', 'css', 'tailwind', 'bootstrap',
               'sass', 'javascript', 'typescript', 'redux', 'svelte', 'webpack', 'vite'],
  },
  {
    label: 'Backend',
    accent: 'from-emerald-500/30 to-teal-400/20',
    keywords: ['node', 'express', 'nest', 'django', 'flask', 'rails', 'spring', 'fastapi',
               'graphql', 'rest', 'api', 'socket', 'jwt'],
  },
  {
    label: 'Databases',
    accent: 'from-amber-500/30 to-orange-400/20',
    keywords: ['mongo', 'mysql', 'postgres', 'sql', 'redis', 'firebase', 'supabase',
               'sqlite', 'dynamodb', 'prisma'],
  },
  {
    label: 'Tools & Cloud',
    accent: 'from-purple-500/30 to-fuchsia-400/20',
    keywords: ['git', 'github', 'docker', 'aws', 'azure', 'gcp', 'vercel', 'netlify',
               'cloudinary', 'razorpay', 'stripe', 'jest', 'cypress', 'webpack', 'vite',
               'linux', 'bash', 'ci', 'cd'],
  },
];

const categorize = (skills) => {
  const buckets = CATEGORIES.map((c) => ({ ...c, items: [] }));
  const other = { label: 'Other', accent: 'from-slate-500/30 to-slate-400/10', items: [] };

  skills.forEach((skill) => {
    const lower = String(skill).toLowerCase();
    const match = buckets.find((b) => b.keywords.some((k) => lower.includes(k)));
    (match || other).items.push(skill);
  });

  return [...buckets.filter((b) => b.items.length > 0), ...(other.items.length ? [other] : [])];
};

const FALLBACK_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'HTML5', 'CSS3',
  'Tailwind CSS', 'Git', 'RESTful APIs', 'Socket.io', 'JWT Authentication',
  'Cloudinary', 'Razorpay',
];

const Skills = ({ skills }) => {
  const grouped = useMemo(() => {
    const list = (skills && skills.length) ? skills : FALLBACK_SKILLS;
    return categorize(list);
  }, [skills]);

  return (
    <section id="skills" className="py-20 px-4 max-w-5xl mx-auto">
      <Reveal>
        <h2 className="title-underline text-3xl md:text-4xl font-semibold mb-12 text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Skills
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6">
        {grouped.map((group, gi) => (
          <Reveal key={group.label} delay={gi * 80}>
            <div className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${group.accent} backdrop-blur-xl p-6 hover-lift overflow-hidden`}>
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative">
                <h3 className="text-lg font-semibold text-white tracking-wide">{group.label}</h3>
                <span className="text-xs text-white/50 font-mono">{String(group.items.length).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-wrap gap-2 relative">
                {group.items.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="skill-chip px-3.5 py-1.5 rounded-full bg-white/[0.06] text-white/85 text-sm font-light border border-white/10 cursor-default"
                    style={{ transitionDelay: `${idx * 25}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Skills;
