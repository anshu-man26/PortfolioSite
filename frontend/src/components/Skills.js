import React, { useMemo } from 'react';
import Reveal from './Reveal';

const CATEGORIES = [
  {
    label: 'Frontend',
    accentStyle: { background: 'linear-gradient(135deg, rgba(199,251,110,0.18), rgba(79,53,230,0.15))' },
    keywords: ['react', 'next', 'vue', 'angular', 'html', 'css', 'tailwind', 'bootstrap',
               'sass', 'javascript', 'typescript', 'redux', 'svelte', 'webpack', 'vite'],
  },
  {
    label: 'Backend',
    accentStyle: { background: 'linear-gradient(135deg, rgba(79,53,230,0.30), rgba(199,251,110,0.10))' },
    keywords: ['node', 'express', 'nest', 'django', 'flask', 'rails', 'spring', 'fastapi',
               'graphql', 'rest', 'api', 'socket', 'jwt'],
  },
  {
    label: 'Databases',
    accentStyle: { background: 'linear-gradient(135deg, rgba(199,251,110,0.22), rgba(255,255,255,0.04))' },
    keywords: ['mongo', 'mysql', 'postgres', 'sql', 'redis', 'firebase', 'supabase',
               'sqlite', 'dynamodb', 'prisma'],
  },
  {
    label: 'Tools & Cloud',
    accentStyle: { background: 'linear-gradient(135deg, rgba(79,53,230,0.35), rgba(79,53,230,0.10))' },
    keywords: ['git', 'github', 'docker', 'aws', 'azure', 'gcp', 'vercel', 'netlify',
               'cloudinary', 'razorpay', 'stripe', 'jest', 'cypress', 'webpack', 'vite',
               'linux', 'bash', 'ci', 'cd'],
  },
];

const categorize = (skills) => {
  const buckets = CATEGORIES.map((c) => ({ ...c, items: [] }));
  const other = {
    label: 'Other',
    accentStyle: { background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' },
    items: [],
  };

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
            <div
              className="relative rounded-2xl border backdrop-blur-xl p-6 hover-lift overflow-hidden"
              style={{
                ...group.accentStyle,
                borderColor: 'rgba(var(--lime), 0.18)',
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: 'rgba(var(--lime), 0.10)' }}
              />
              <div className="flex items-center justify-between mb-4 relative">
                <h3 className="text-lg font-semibold tracking-wide" style={{ color: 'rgb(var(--lime))' }}>
                  {group.label}
                </h3>
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
