import React from 'react';

const iconMail = (
  <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25ZM21.75 6.75l-9.75 7.5-9.75-7.5" /></svg>
);
const iconPhone = (
  <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1 2.25 2.25V6.75ZM21.75 6.75l-9.75 7.5-9.75-7.5" /></svg>
);
const iconGithub = (
  <svg className="w-6 h-6 text-white mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" /></svg>
);
const iconLinkedin = (
  <svg className="w-6 h-6 text-blue-300 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>
);
const iconTwitter = (
  <svg className="w-6 h-6 text-sky-400 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.89.39-1.85.65-2.86.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2.01.97-3.13 1.19a4.92 4.92 0 0 0-8.39 4.48A13.97 13.97 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.52 6.57c-.8-.02-1.56-.25-2.22-.62v.06a4.93 4.93 0 0 0 3.95 4.83c-.39.11-.8.17-1.22.17-.3 0-.59-.03-.87-.08a4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 21.54a13.94 13.94 0 0 0 7.56 2.22c9.05 0 14-7.5 14-14v-.64A9.93 9.93 0 0 0 24 4.56z" /></svg>
);
const iconWebsite = (
  <svg className="w-6 h-6 text-purple-300 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" /></svg>
);

const Contact = ({ personalInfo }) => {
  const email = personalInfo?.email || 'contact@myportfolio.com';
  const socialLinks = personalInfo?.socialLinks || {};
  const phone = socialLinks.phone || '+91-9876543210';
  const showPhone = socialLinks.showPhone !== false; // Default to true if not set
  
  return (
    <section id="contact" className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8 text-white text-left tracking-tight" style={{letterSpacing: '-0.02em'}}>Contact</h2>
      <div className="bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-fuchsia-900/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl hover-lift transition-all duration-300 animate-fade-in-up max-w-xl w-full">
        {/* Email */}
        <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
          {iconMail}
          <span className="text-white/80 font-semibold w-28">Email</span>
          <a href={`mailto:${email}`} className="text-white font-light hover:text-blue-400 transition-colors duration-200 ml-4 break-all">{email}</a>
        </div>
        {/* Phone - Only show if showPhone is true */}
        {showPhone && phone && (
          <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
            {iconPhone}
            <span className="text-white/80 font-semibold w-28">Phone</span>
            <a href={`tel:${phone}`} className="text-white font-light hover:text-green-400 transition-colors duration-200 ml-4 break-all">{phone}</a>
          </div>
        )}
        {/* Social Links */}
        {socialLinks.github && (
          <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
            {iconGithub}
            <span className="text-white/80 font-semibold w-28">GitHub</span>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white font-light hover:text-blue-400 transition-colors duration-200 ml-4 break-all">{socialLinks.github}</a>
          </div>
        )}
        {socialLinks.linkedin && (
          <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
            {iconLinkedin}
            <span className="text-white/80 font-semibold w-28">LinkedIn</span>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white font-light hover:text-blue-400 transition-colors duration-200 ml-4 break-all">{socialLinks.linkedin}</a>
          </div>
        )}
        {socialLinks.twitter && (
          <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
            {iconTwitter}
            <span className="text-white/80 font-semibold w-28">Twitter</span>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white font-light hover:text-sky-400 transition-colors duration-200 ml-4 break-all">{socialLinks.twitter}</a>
          </div>
        )}
        {socialLinks.website && (
          <div className="flex items-center py-4 border-b border-white/20 last:border-b-0">
            {iconWebsite}
            <span className="text-white/80 font-semibold w-28">Website</span>
            <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white font-light hover:text-purple-300 transition-colors duration-200 ml-4 break-all">{socialLinks.website}</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact; 