import React from 'react';
import Reveal from './Reveal';

const iconMail = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25ZM21.75 6.75l-9.75 7.5-9.75-7.5" />
  </svg>
);
const iconPhone = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const iconGithub = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
  </svg>
);
const iconLinkedin = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
  </svg>
);
const iconTwitter = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.56c-.89.39-1.85.65-2.86.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2.01.97-3.13 1.19a4.92 4.92 0 0 0-8.39 4.48A13.97 13.97 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.52 6.57c-.8-.02-1.56-.25-2.22-.62v.06a4.93 4.93 0 0 0 3.95 4.83c-.39.11-.8.17-1.22.17-.3 0-.59-.03-.87-.08a4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.56 2.22c9.05 0 14-7.5 14-14v-.64A9.93 9.93 0 0 0 24 4.56z" />
  </svg>
);
const iconWebsite = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>
);

const Contact = ({ personalInfo }) => {
  const email = personalInfo?.email || 'contact@myportfolio.com';
  const socialLinks = personalInfo?.socialLinks || {};
  const phone = socialLinks.phone || personalInfo?.phone;
  const showPhone = socialLinks.showPhone !== false;

  const cards = [
    {
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      icon: iconMail,
      accent: 'from-blue-500/30 to-cyan-400/20',
      ring: 'group-hover:ring-blue-400/40',
    },
    showPhone && phone && {
      label: 'Phone',
      value: phone,
      href: `tel:${phone}`,
      icon: iconPhone,
      accent: 'from-emerald-500/30 to-teal-400/20',
      ring: 'group-hover:ring-emerald-400/40',
    },
    socialLinks.github && {
      label: 'GitHub',
      value: socialLinks.github.replace(/^https?:\/\//, ''),
      href: socialLinks.github,
      icon: iconGithub,
      accent: 'from-zinc-500/30 to-zinc-400/10',
      ring: 'group-hover:ring-zinc-300/40',
      external: true,
    },
    socialLinks.linkedin && {
      label: 'LinkedIn',
      value: socialLinks.linkedin.replace(/^https?:\/\//, ''),
      href: socialLinks.linkedin,
      icon: iconLinkedin,
      accent: 'from-sky-500/30 to-blue-400/20',
      ring: 'group-hover:ring-sky-400/40',
      external: true,
    },
    socialLinks.twitter && {
      label: 'Twitter',
      value: socialLinks.twitter.replace(/^https?:\/\//, ''),
      href: socialLinks.twitter,
      icon: iconTwitter,
      accent: 'from-sky-400/30 to-indigo-400/20',
      ring: 'group-hover:ring-sky-300/40',
      external: true,
    },
    socialLinks.website && {
      label: 'Website',
      value: socialLinks.website.replace(/^https?:\/\//, ''),
      href: socialLinks.website,
      icon: iconWebsite,
      accent: 'from-purple-500/30 to-fuchsia-400/20',
      ring: 'group-hover:ring-purple-400/40',
      external: true,
    },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-20 px-4 max-w-5xl mx-auto">
      <Reveal>
        <h2 className="title-underline text-3xl md:text-4xl font-semibold mb-4 text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Let's Connect
        </h2>
      </Reveal>
      <Reveal delay={80}>
        <p className="text-white/60 text-base md:text-lg font-light mb-10 max-w-2xl">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((card, idx) => (
          <Reveal key={card.label} delay={idx * 60}>
            <a
              href={card.href}
              {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={`${card.label}: ${card.value}`}
              className={`group block relative rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} backdrop-blur-xl p-5 hover-lift overflow-hidden ring-1 ring-transparent ${card.ring} transition-shadow`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-md flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-widest text-white/55 mb-1">{card.label}</div>
                  <div className="text-white/95 font-light text-sm md:text-base break-all">{card.value}</div>
                </div>
                <svg className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Contact;
