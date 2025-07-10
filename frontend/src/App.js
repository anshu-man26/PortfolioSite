import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import AdminButton from './components/AdminButton';
import { API_ENDPOINTS } from './config/api';

function RequireAdminAuth({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin" />;
}

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Default placeholders for all sections
  const defaultData = {
    personalInfo: {
          name: 'My Portfolio',
    title: 'Full Stack Developer',
    email: 'contact@myportfolio.com',
      location: 'India',
      about: 'Passionate Full Stack Developer with expertise in MERN stack, React, Node.js, and modern web technologies. I build scalable and user-friendly applications with a focus on clean code and best practices.',
      skills: [
        'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
        'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'RESTful APIs',
        'Socket.io', 'JWT Authentication', 'Cloudinary', 'Razorpay'
      ],
      socialLinks: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername',
        website: '',
        email: 'contact@myportfolio.com',
        phone: '+91-9876543210',
      }
    },
    experience: [
      {
        title: 'Full Stack Developer',
        company: 'Freelance',
        period: '2023 - Present',
        description: 'Developing full-stack web applications using MERN stack, implementing real-time features, and ensuring optimal user experience.'
      }
    ],
    education: [
      {
        type: 'college',
        institution: 'IIT Delhi',
        program: 'B.Tech',
        branch: 'Computer Science',
        startYear: '2020',
        endYear: '2024',
        description: 'Focused on software engineering, web development, and database management.'
      },
      {
        type: 'school',
        schoolName: 'Delhi Public School',
        board: 'CBSE',
        class: '12th',
        yearOfPassing: '2020',
        marks: '95%'
      }
    ],
    projects: [],
  };

  useEffect(() => {
    fetchPortfolioData();
    fetchProjectsData();
  }, []);

  // Periodic backend status check
  useEffect(() => {
    if (backendStatus === 'offline') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(API_ENDPOINTS.PORTFOLIO);
          if (response.ok) {
            const data = await response.json();
            setPortfolioData(data);
            setBackendStatus('online');
          }
        } catch (error) {
          // Backend still offline, do nothing
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [backendStatus]);

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

  // Check if we're showing placeholder data
  const isShowingPlaceholders = !portfolioData || 
    !portfolioData.personalInfo?.name || 
    portfolioData.personalInfo?.name === defaultData.personalInfo.name;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl font-light">Loading...</div>
      </div>
    );
  }

  // Helper to merge backend data with defaults
  const merged = {
    personalInfo: { ...defaultData.personalInfo, ...(portfolioData?.personalInfo || {}) },
    aboutMe: portfolioData?.aboutMe || '',
    experience: (portfolioData?.experience && portfolioData.experience.length > 0) ? portfolioData.experience : defaultData.experience,
    education: (portfolioData?.education && portfolioData.education.length > 0) ? portfolioData.education : defaultData.education,
    skills: (portfolioData?.personalInfo?.skills && portfolioData.personalInfo.skills.length > 0) ? portfolioData.personalInfo.skills : defaultData.personalInfo.skills,
    projects: (backendStatus === 'online' && projects.length > 0) ? projects : defaultData.projects,
  };

  // Backend Offline Notice Component (centered modal)
  const BackendOfflineNotice = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blackout overlay */}
      <div className="absolute inset-0 bg-black opacity-90"></div>
      {/* Centered notice box */}
      <div className="relative z-10 bg-red-600 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full flex flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 bg-white rounded-full animate-pulse mb-2"></div>
          <h3 className="font-semibold text-2xl text-center">⚠️ Backend Server Offline</h3>
          <p className="text-base opacity-90 text-center mb-4">
            The server is currently unavailable.<br />You're viewing placeholder data.<br />
            Please wait for the server to come back online or refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-base font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/dashboard" element={
          <RequireAdminAuth>
            <AdminDashboard />
          </RequireAdminAuth>
        } />
        <Route path="/*" element={
          <div className="App text-white overflow-x-hidden relative min-h-screen">
            {/* Beautiful Apple-like gradient background */}
            <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
            
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Show notice if backend is offline and we're showing placeholders */}
              {backendStatus === 'offline' && isShowingPlaceholders && <BackendOfflineNotice />}
              
              <Header personalInfo={merged.personalInfo} />
              <main>
                <Hero personalInfo={merged.personalInfo} />
                <Projects projects={merged.projects} />
                <Experience experience={merged.experience} education={merged.education} />
                <About personalInfo={merged.personalInfo} aboutMe={merged.aboutMe} />
                <Skills skills={merged.skills} />
                <Contact personalInfo={merged.personalInfo} />
              </main>
              <Footer />
              <AdminButton />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
