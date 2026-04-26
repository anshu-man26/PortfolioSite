import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import CheatCode from './components/CheatCode';
import { API_ENDPOINTS } from './config/api';

function RequireAdminAuth({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" />;
}

const DEFAULT_DATA = {
  personalInfo: {
    name: 'My Portfolio',
    title: 'Full Stack Developer',
    email: 'contact@myportfolio.com',
    location: 'India',
    about:
      'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies. I build scalable and user-friendly applications with a focus on clean code and best practices.',
    skills: [
      'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
      'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'RESTful APIs',
      'Socket.io', 'JWT Authentication', 'Cloudinary', 'Razorpay',
    ],
    socialLinks: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      twitter: 'https://twitter.com/yourusername',
      website: '',
      email: 'contact@myportfolio.com',
      phone: '+91-9876543210',
    },
  },
  experience: [
    {
      title: 'Full Stack Developer',
      company: 'Freelance',
      period: '2023 - Present',
      description:
        'Developing full-stack web applications using MERN stack, implementing real-time features, and ensuring optimal user experience.',
    },
  ],
  education: [
    {
      type: 'college',
      institution: 'IIT Delhi',
      program: 'B.Tech',
      branch: 'Computer Science',
      startYear: '2020',
      endYear: '2024',
      description: 'Focused on software engineering, web development, and database management.',
    },
    {
      type: 'school',
      schoolName: 'Delhi Public School',
      board: 'CBSE',
      class: '12th',
      yearOfPassing: '2020',
      marks: '95%',
    },
  ],
  projects: [],
};

const LoadingSkeleton = () => (
  <div
    className="min-h-screen relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, rgb(var(--ink)), rgba(79,53,230,0.35), rgb(var(--ink)))' }}
  >
    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(var(--indigo), 0.30)' }} />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(var(--lime), 0.20)', animationDelay: '1.5s' }} />
    <div className="relative max-w-3xl mx-auto px-6 pt-32 space-y-6">
      <div className="skeleton h-6 w-40 mx-auto" />
      <div className="skeleton h-16 w-3/4 mx-auto" />
      <div className="skeleton h-8 w-1/2 mx-auto" />
      <div className="skeleton h-4 w-full mt-8" />
      <div className="skeleton h-4 w-11/12 mx-auto" />
      <div className="skeleton h-4 w-9/12 mx-auto" />
      <div className="flex gap-3 justify-center pt-6">
        <div className="skeleton h-12 w-36 rounded-full" />
        <div className="skeleton h-12 w-36 rounded-full" />
      </div>
    </div>
  </div>
);

function MainSite() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const auroraRef = useRef(null);

  useEffect(() => {
    fetchPortfolioData();
    fetchProjectsData();
  }, []);

  useEffect(() => {
    if (backendStatus !== 'offline') return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PORTFOLIO);
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
          setBackendStatus('online');
        }
      } catch {
        // still offline
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [backendStatus]);

  // Mouse-tracking aurora — only on devices with a fine pointer
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = auroraRef.current;
        if (!node) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        node.style.setProperty('--mx', `${x}%`);
        node.style.setProperty('--my', `${y}%`);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PORTFOLIO);
      const data = await response.json();
      setPortfolioData(data);
      setBackendStatus('online');
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const isShowingPlaceholders =
    !portfolioData ||
    !portfolioData.personalInfo?.name ||
    portfolioData.personalInfo?.name === DEFAULT_DATA.personalInfo.name;

  if (loading) return <LoadingSkeleton />;

  const merged = {
    personalInfo: { ...DEFAULT_DATA.personalInfo, ...(portfolioData?.personalInfo || {}) },
    aboutMe: portfolioData?.aboutMe || '',
    experience: (portfolioData?.experience && portfolioData.experience.length > 0)
      ? portfolioData.experience
      : DEFAULT_DATA.experience,
    education: (portfolioData?.education && portfolioData.education.length > 0)
      ? portfolioData.education
      : DEFAULT_DATA.education,
    skills: (portfolioData?.personalInfo?.skills && portfolioData.personalInfo.skills.length > 0)
      ? portfolioData.personalInfo.skills
      : DEFAULT_DATA.personalInfo.skills,
    projects: (backendStatus === 'online' && projects.length > 0) ? projects : DEFAULT_DATA.projects,
  };

  const BackendOfflineNotice = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="alertdialog" aria-modal="true" aria-label="Server offline">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      <div className="relative z-10 bg-gradient-to-br from-red-600 to-red-700 text-white p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center border border-white/15">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 w-12 h-12 bg-white/30 rounded-full animate-ping" />
            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-2xl text-center">Backend Offline</h3>
          <p className="text-base opacity-90 text-center">
            The server is currently unavailable. You're viewing placeholder data — we're checking again every few seconds.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-full text-base font-medium transition-colors backdrop-blur-md border border-white/15"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App text-white overflow-x-hidden relative min-h-screen">
      {/* Base gradient — deep ink with hints of indigo */}
      <div
        className="fixed inset-0"
        style={{ background: 'linear-gradient(135deg, rgb(var(--ink)), rgba(79,53,230,0.18), rgb(var(--ink)))' }}
      />

      {/* Mouse-following aurora */}
      <div ref={auroraRef} className="aurora" aria-hidden="true" />

      {/* Slow-drifting blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-slow-pulse" style={{ backgroundColor: 'rgba(var(--indigo), 0.18)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-slow-pulse" style={{ backgroundColor: 'rgba(var(--lime), 0.10)', animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-slow-pulse" style={{ backgroundColor: 'rgba(var(--indigo), 0.10)', animationDelay: '5s' }} />
      </div>

      <ScrollProgress />

      <div className="relative z-10">
        {backendStatus === 'offline' && isShowingPlaceholders && <BackendOfflineNotice />}

        <Header />
        <main>
          <Hero personalInfo={merged.personalInfo} />
          <Projects projects={merged.projects} />
          <Experience experience={merged.experience} education={merged.education} />
          <About personalInfo={merged.personalInfo} aboutMe={merged.aboutMe} />
          <Skills skills={merged.skills} />
          <Contact personalInfo={merged.personalInfo} />
        </main>
        <Footer />
        <CheatCode />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/dashboard" element={
          <RequireAdminAuth>
            <AdminDashboard />
          </RequireAdminAuth>
        } />
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </Router>
  );
}

export default App;
