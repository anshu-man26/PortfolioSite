import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import portfolioIcon from '../../assets/portfolio.png';
import ChangePassword from './ChangePassword';

const handleLogout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin';
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [tab, setTab] = useState('projects');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    github: '',
    live: '',
    image: null,
  });
  const [newFeature, setNewFeature] = useState({
    project: '',
    title: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioTab, setPortfolioTab] = useState('personal');
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteFeatureModal, setShowDeleteFeatureModal] = useState(false);
  const [deleteFeatureTargetId, setDeleteFeatureTargetId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [pfpUploadLoading, setPfpUploadLoading] = useState(false);
  const [eduPfpUploadLoading, setEduPfpUploadLoading] = useState({}); // { idx: boolean }
  // Add state for editing features
  const [showEditFeatureModal, setShowEditFeatureModal] = useState(false);
  const [editFeature, setEditFeature] = useState(null);
  // Add state for pending education pfps
  const [pendingEduPfp, setPendingEduPfp] = useState({}); // { idx: File }
  // Add state for pending personal pfp
  const [pendingPersonalPfp, setPendingPersonalPfp] = useState(null);
  // Add state for selected project in features tab
  const [selectedProject, setSelectedProject] = useState('');
  // Add state for upload success messages
  const [uploadSuccess, setUploadSuccess] = useState({}); // { type: string, message: string }
  // Add state for drag and drop reordering
  const [draggedFeature, setDraggedFeature] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  // Add state for enhanced project selector
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  // Add state for change password modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Close project selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProjectSelector && !event.target.closest('.project-selector')) {
        setShowProjectSelector(false);
        setProjectSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProjectSelector]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.PROJECTS);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.FEATURES);
      const data = await res.json();
      setFeatures(data);
    } catch (err) {
      setError('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolio info (admin)
  const fetchPortfolio = async () => {
    setPortfolioLoading(true);
    setPortfolioError('');
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_PORTFOLIO, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      setPortfolioError('Failed to fetch portfolio');
    } finally {
      setPortfolioLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchFeatures();
    fetchPortfolio();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProject((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewFeature((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewFeature((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle portfolio form changes
  const handlePortfolioChange = (section, field, value, idx) => {
    setPortfolio((prev) => {
      const updated = { ...prev };
      if (section === 'personalInfo') {
        updated.personalInfo = { ...updated.personalInfo, [field]: value };
      } else if (section === 'aboutMe') {
        updated.aboutMe = value;
      } else if (section === 'skills') {
        updated.personalInfo.skills = value.split(',').map((s) => s.trim());
      } else if (section === 'socialLinks') {
        updated.personalInfo.socialLinks = { ...updated.personalInfo.socialLinks, [field]: value };
      } else if (section === 'experience') {
        updated.experience = [...updated.experience];
        updated.experience[idx][field] = value;
      } else if (section === 'education') {
        updated.education = [...updated.education];
        updated.education[idx][field] = value;
      }
      return updated;
    });
  };

  // Add/remove experience/education
  const addExperience = () => {
    setPortfolio((prev) => ({ ...prev, experience: [...(prev.experience || []), { title: '', company: '', period: '', description: '' }] }));
  };
  const removeExperience = (idx) => {
    setPortfolio((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
  };
  const addEducation = () => {
    setPortfolio((prev) => ({ ...prev, education: [...(prev.education || []), { type: 'college', institution: '', program: '', branch: '', startYear: '', endYear: '', description: '' }] }));
  };
  const removeEducation = (idx) => {
    setPortfolio((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  };

  // Save portfolio
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setPortfolioLoading(true);
    setPortfolioError('');
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_PORTFOLIO, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          personalInfo: portfolio.personalInfo,
          aboutMe: portfolio.aboutMe,
          experience: portfolio.experience,
          education: portfolio.education,
        }),
      });
      if (!res.ok) throw new Error('Failed to update portfolio');
      fetchPortfolio();
    } catch (err) {
      setPortfolioError('Failed to update portfolio');
    } finally {
      setPortfolioLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', newProject.title);
      formData.append('description', newProject.description);
      formData.append('techStack', newProject.techStack);
      formData.append('github', newProject.github);
      formData.append('live', newProject.live);
      if (newProject.image) formData.append('image', newProject.image);
      const res = await fetch(API_ENDPOINTS.PROJECTS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to add project');
      } else {
        setShowAdd(false);
        setNewProject({ title: '', description: '', techStack: '', github: '', live: '', image: null });
        fetchProjects();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('projectId', newFeature.project); // Use projectId
      formData.append('title', newFeature.title);
      formData.append('description', newFeature.description);
      if (newFeature.image) formData.append('image', newFeature.image);
      const res = await fetch(API_ENDPOINTS.FEATURES, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to add feature');
      } else {
        setShowAddFeature(false);
        setNewFeature({ project: '', title: '', description: '', image: null });
        fetchFeatures();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    setShowDeleteModal(true);
    setDeleteTargetId(id);
  };

  const confirmDeleteProject = async () => {
    if (!deleteTargetId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.PROJECT_BY_ID(deleteTargetId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete project');
      } else {
        fetchProjects();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDeleteProject = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const handleDeleteFeature = async (id) => {
    setShowDeleteFeatureModal(true);
    setDeleteFeatureTargetId(id);
  };

  const confirmDeleteFeature = async () => {
    if (!deleteFeatureTargetId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.FEATURE_BY_ID(deleteFeatureTargetId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete feature');
      } else {
        fetchFeatures();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
      setShowDeleteFeatureModal(false);
      setDeleteFeatureTargetId(null);
    }
  };

  const cancelDeleteFeature = () => {
    setShowDeleteFeatureModal(false);
    setDeleteFeatureTargetId(null);
  };

  // Edit project handlers
  const openEditModal = (project) => {
    setEditProject({ ...project, techStack: project.techStack ? project.techStack.join(', ') : '' });
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProject(null);
  };
  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditProject((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditProject((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleEditProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', editProject.title);
      formData.append('description', editProject.description);
      formData.append('techStack', editProject.techStack);
      formData.append('github', editProject.github);
      formData.append('live', editProject.live);
      if (editProject.image) formData.append('image', editProject.image);
      const res = await fetch(API_ENDPOINTS.PROJECT_BY_ID(editProject._id), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update project');
      } else {
        closeEditModal();
        fetchProjects();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  // Open/close edit modal
  const openEditFeatureModal = (feature) => {
    setEditFeature({ ...feature });
    setShowEditFeatureModal(true);
  };
  const closeEditFeatureModal = () => {
    setShowEditFeatureModal(false);
    setEditFeature(null);
  };
  // Handle input change
  const handleEditFeatureInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditFeature((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditFeature((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Save edited feature
  const handleEditFeature = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('projectId', editFeature.project); // Use projectId
      formData.append('title', editFeature.title);
      formData.append('description', editFeature.description);
      if (editFeature.image) formData.append('image', editFeature.image);
      const res = await fetch(API_ENDPOINTS.FEATURE_BY_ID(editFeature._id), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update feature');
      } else {
        closeEditFeatureModal();
        fetchFeatures();
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  // Personal PFP upload handler
  const handlePersonalPfpChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingPersonalPfp(file);
  };

  // New handler to actually upload the pending personal pfp
  const handleUploadPersonalPfp = async () => {
    if (!pendingPersonalPfp) return;
    setPfpUploadLoading(true);
    setUploadSuccess({});
    try {
      const formData = new FormData();
      formData.append('image', pendingPersonalPfp);
      const res = await fetch(API_ENDPOINTS.ADMIN_PERSONAL_PFP, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        // Update local state
        setPortfolio((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, pfp: data.url },
        }));
        setPendingPersonalPfp(null);
        
        console.log('Personal PFP uploaded successfully:', data.url);
        
        // Save to backend
        const saveRes = await fetch(API_ENDPOINTS.ADMIN_PORTFOLIO, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify({
            personalInfo: { ...portfolio.personalInfo, pfp: data.url },
            aboutMe: portfolio.aboutMe,
            experience: portfolio.experience,
            education: portfolio.education,
          }),
        });
        if (!saveRes.ok) {
          console.error('Failed to save portfolio');
        } else {
          console.log('Portfolio saved successfully with PFP:', data.url);
          // Show success message
          setUploadSuccess({ type: 'personal', message: 'Profile picture uploaded successfully!' });
          // Clear success message after 3 seconds
          setTimeout(() => setUploadSuccess({}), 3000);
          // Refresh portfolio data to ensure UI is updated
          fetchPortfolio();
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
    setPfpUploadLoading(false);
  };

  // Update handleEducationPfpChange to only set pending file
  const handleEducationPfpChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingEduPfp((prev) => ({ ...prev, [idx]: file }));
  };

  // New handler to actually upload the pending pfp
  const handleUploadEducationPfp = async (idx, type) => {
    const file = pendingEduPfp[idx];
    if (!file) return;
    setEduPfpUploadLoading((prev) => ({ ...prev, [idx]: true }));
    setUploadSuccess({});
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('educationIndex', idx.toString());
      const endpoint = type === 'college'
        ? API_ENDPOINTS.ADMIN_COLLEGE_PFP
        : API_ENDPOINTS.ADMIN_SCHOOL_PFP;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData,
      });
      const data = await res.json();
      console.log('Upload response:', data);
      if (data.url) {
        console.log(`Setting ${type} PFP for education index ${idx}:`, data.url);
        setPortfolio((prev) => {
          const updated = { ...prev };
          updated.education = [...updated.education];
          if (type === 'college') updated.education[idx].collegePfp = data.url;
          else updated.education[idx].schoolPfp = data.url;
          console.log('Updated portfolio education:', updated.education);
          return updated;
        });
        setPendingEduPfp((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });
        
        // Show success message
        const institutionName = portfolio.education[idx]?.institution || portfolio.education[idx]?.schoolName || `Education ${idx + 1}`;
        setUploadSuccess({ 
          type: 'education', 
          message: `${type === 'college' ? 'College' : 'School'} profile picture uploaded successfully for ${institutionName}!` 
        });
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccess({}), 3000);
        // Refresh portfolio data to ensure UI is updated
        fetchPortfolio();
      } else {
        console.error('Upload failed:', data);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
    setEduPfpUploadLoading((prev) => ({ ...prev, [idx]: false }));
  };

  // Drag and drop functions for feature reordering
  const handleDragStart = (e, feature) => {
    setDraggedFeature(feature);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetFeature) => {
    e.preventDefault();
    if (!draggedFeature || draggedFeature._id === targetFeature._id) {
      setDraggedFeature(null);
      return;
    }

    setIsReordering(true);
    try {
      // Get all features for the current project
      const projectFeatures = features.filter(f => f.project === selectedProject);
      
      // Find indices of dragged and target features
      const draggedIndex = projectFeatures.findIndex(f => f._id === draggedFeature._id);
      const targetIndex = projectFeatures.findIndex(f => f._id === targetFeature._id);
      
      // Create new order array
      const newOrder = [...projectFeatures];
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      
      // Prepare data for API call
      const featureOrders = newOrder.map((feature, index) => ({
        featureId: feature._id,
        order: index
      }));

      // Update order in backend
      const res = await fetch(API_ENDPOINTS.FEATURE_ORDER_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ featureOrders }),
      });

      if (!res.ok) throw new Error('Failed to update feature order');
      
      // Refresh features to get updated order
      fetchFeatures();
    } catch (err) {
      setError('Failed to update feature order');
    } finally {
      setIsReordering(false);
      setDraggedFeature(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedFeature(null);
  };

  // Toggle key feature status
  const handleToggleKeyFeature = async (featureId) => {
    try {
      const res = await fetch(API_ENDPOINTS.FEATURE_TOGGLE_KEY(featureId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to toggle key feature status');
      
      // Refresh features to get updated status
      fetchFeatures();
    } catch (err) {
      setError('Failed to toggle key feature status');
    }
  };

  // Filter features by selected project
  const filteredFeatures = selectedProject 
    ? features.filter(feature => feature.project === selectedProject || feature.project?._id === selectedProject)
    : [];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col p-8 shadow-2xl">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <img 
                src={portfolioIcon} 
                alt="Portfolio Icon" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Portfolio Admin</h1>
              <p className="text-xs text-white/60">Content Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setTab('projects')} 
            className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
              tab === 'projects' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-medium">Projects</span>
            {tab === 'projects' && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button 
            onClick={() => setTab('features')} 
            className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
              tab === 'features' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
            </svg>
            <span className="font-medium">Features</span>
            {tab === 'features' && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button 
            onClick={() => setTab('portfolio')} 
            className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
              tab === 'portfolio' 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Portfolio</span>
            {tab === 'portfolio' && (
              <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
        </nav>

        {/* Stats */}
        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Projects</span>
              <span className="text-white font-medium">{projects.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Features</span>
              <span className="text-white font-medium">{features.length}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <button
          onClick={() => setShowChangePassword(true)}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-300 flex items-center gap-3 justify-center shadow-lg hover:shadow-xl mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Change Password
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-300 flex items-center gap-3 justify-center shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>
      {/* Enhanced Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto">
          {tab === 'projects' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
                  <p className="text-white/60">Manage your portfolio projects and showcase your work</p>
                </div>
                <button
                  onClick={() => setShowAdd((v) => !v)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {showAdd ? 'Cancel' : 'Add Project'}
                </button>
              </div>
              {showAdd && (
                <form onSubmit={handleAddProject} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl mb-8 border border-white/10 shadow-2xl">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Project
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Project Title *</label>
                      <input 
                        name="title" 
                        value={newProject.title} 
                        onChange={handleInputChange} 
                        placeholder="Enter project title" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:outline-none focus:border-blue-500/50 transition-all duration-300" 
                        required 
                      />
                  </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Tech Stack</label>
                      <input 
                        name="techStack" 
                        value={newProject.techStack} 
                        onChange={handleInputChange} 
                        placeholder="React, Node.js, MongoDB (comma separated)" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:outline-none focus:border-blue-500/50 transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">GitHub URL</label>
                      <input 
                        name="github" 
                        value={newProject.github} 
                        onChange={handleInputChange} 
                        placeholder="https://github.com/username/project" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:outline-none focus:border-blue-500/50 transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Live URL</label>
                      <input 
                        name="live" 
                        value={newProject.live} 
                        onChange={handleInputChange} 
                        placeholder="https://project-demo.com" 
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:outline-none focus:border-blue-500/50 transition-all duration-300" 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
                    <textarea 
                      name="description" 
                      value={newProject.description} 
                      onChange={handleInputChange} 
                      placeholder="Describe your project, its features, and what you learned..." 
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-light focus:outline-none focus:border-blue-500/50 transition-all duration-300 resize-none" 
                      required 
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-white/80 text-sm font-medium mb-2">Project Image</label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleInputChange} 
                        className="hidden" 
                        id="project-image"
                      />
                      <label htmlFor="project-image" className="cursor-pointer">
                        <svg className="w-12 h-12 text-white/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-white/60">Click to upload project image</p>
                        <p className="text-white/40 text-sm">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Add Project
                        </>
                      )}
                  </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAdd(false)}
                      className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {error && <div className="mb-4 text-red-400 text-center text-sm font-light">{error}</div>}
              <div className="space-y-6">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-white/60">
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading projects...
                    </div>
                  </div>
                )}
                
                {projects.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                    <p className="text-white/60 mb-6">Start by adding your first project to showcase your work</p>
                    <button
                      onClick={() => setShowAdd(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Your First Project
                    </button>
                  </div>
                )}
                
                {projects.map((project) => (
                  <div key={project._id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Project Image */}
                      <div className="lg:w-48 lg:h-32 flex-shrink-0">
                        {project.mainImage ? (
                          <img 
                            src={project.mainImage} 
                            alt={project.title} 
                            className="w-full h-32 lg:h-full object-cover rounded-xl shadow-lg" 
                          />
                        ) : (
                          <div className="w-full h-32 lg:h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Project Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                            {project.title}
                          </h3>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openEditModal(project)} 
                              className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
                              title="Edit Project"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project._id)} 
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300"
                              title="Delete Project"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-white/70 mb-4 line-clamp-2">{project.description}</p>
                        
                        {/* Tech Stack */}
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs font-medium border border-white/20">
                                {tech}
                              </span>
                        ))}
                      </div>
                        )}
                        
                        {/* Links */}
                      <div className="flex gap-4">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                              </svg>
                              GitHub
                            </a>
                          )}
                          {project.live && (
                            <a 
                              href={project.live} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live Demo
                            </a>
                          )}
                      </div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Edit Project Modal */}
              {showEditModal && editProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <form onSubmit={handleEditProject} className="bg-white rounded-xl p-8 shadow-xl max-w-lg w-full text-left">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">Edit Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input name="title" value={editProject.title} onChange={handleEditInputChange} placeholder="Title" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" required />
                      <input name="techStack" value={editProject.techStack} onChange={handleEditInputChange} placeholder="Tech Stack (comma separated)" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" />
                      <input name="github" value={editProject.github} onChange={handleEditInputChange} placeholder="GitHub URL" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" />
                      <input name="live" value={editProject.live} onChange={handleEditInputChange} placeholder="Live URL" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" />
                    </div>
                    <textarea name="description" value={editProject.description} onChange={handleEditInputChange} placeholder="Description" className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light mb-4" required />
                    <input type="file" name="image" accept="image/*" onChange={handleEditInputChange} className="mb-4 text-gray-900" />
                    <div className="flex gap-4 justify-end">
                      <button type="button" onClick={closeEditModal} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-200">Cancel</button>
                      <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                    {error && <div className="mt-4 text-red-500 text-center text-sm font-light">{error}</div>}
                  </form>
                </div>
              )}
              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Delete Project?</h3>
                    <p className="text-gray-700 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                    {error && <div className="mb-4 text-red-500 text-center text-sm font-light">{error}</div>}
                    <div className="flex gap-4 justify-center">
                      <button onClick={confirmDeleteProject} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200">Delete</button>
                      <button onClick={cancelDeleteProject} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-200">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === 'features' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-light text-white">Features</h1>
                <div className="flex gap-4 items-center">
                  {/* Enhanced Project Selector */}
                  <div className="relative project-selector">
                    <button
                      onClick={() => setShowProjectSelector(!showProjectSelector)}
                      className={`px-6 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 min-w-[280px] ${
                        selectedProject 
                          ? 'bg-blue-500/20 border-blue-500/30 text-white' 
                          : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex-1 text-left">
                        {selectedProject ? (
                          <div>
                            <div className="font-medium">{projects.find(p => p._id === selectedProject)?.title}</div>
                            <div className="text-xs opacity-70">
                              {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        ) : (
                          <div>Select a project to manage features</div>
                        )}
                      </div>
                      <svg className={`w-5 h-5 transition-transform duration-200 ${showProjectSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Project Selector Dropdown */}
                    {showProjectSelector && (
                      <div className="project-selector absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/10">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search projects..."
                              value={projectSearchTerm}
                              onChange={(e) => setProjectSearchTerm(e.target.value)}
                              className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Project List */}
                        <div className="max-h-64 overflow-y-auto">
                          {projects
                            .filter(project => 
                              project.title.toLowerCase().includes(projectSearchTerm.toLowerCase())
                            )
                            .map((project) => {
                              const projectFeatures = features.filter(f => f.project === project._id);
                              const keyFeatures = projectFeatures.filter(f => f.isKeyFeature);
                              return (
                                <div
                                  key={project._id}
                                  onClick={() => {
                                    setSelectedProject(project._id);
                                    setShowProjectSelector(false);
                                    setProjectSearchTerm('');
                                  }}
                                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                                    selectedProject === project._id ? 'bg-blue-500/20 border-l-4 border-blue-500' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Project Icon */}
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0">
                                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    
                                    {/* Project Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-white truncate">{project.title}</div>
                                      <div className="text-sm text-white/60 flex items-center gap-4">
                                        <span>{projectFeatures.length} feature{projectFeatures.length !== 1 ? 's' : ''}</span>
                                        {keyFeatures.length > 0 && (
                                          <span className="text-blue-400">{keyFeatures.length} key</span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Selection Indicator */}
                                    {selectedProject === project._id && (
                                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        
                        {/* No Results */}
                        {projects.filter(project => 
                          project.title.toLowerCase().includes(projectSearchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="p-4 text-center text-white/50">
                            No projects found matching "{projectSearchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {selectedProject && (
                    <button
                      onClick={() => {
                        setNewFeature(prev => ({ ...prev, project: selectedProject }));
                        setShowAddFeature(true);
                      }}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-md flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Feature
                    </button>
                  )}
                </div>
              </div>
              
              {!selectedProject && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-white/70 text-xl font-light mb-3">Select a Project</div>
                  <div className="text-white/50 text-sm max-w-md mx-auto">
                    Choose a project from the dropdown above to view and manage its features. 
                    You can add new features, reorder them, and mark key features for the frontend.
                  </div>
                </div>
              )}
              
              {selectedProject && (
                <>
                  {showAddFeature && (
                    <form onSubmit={handleAddFeature} className="bg-white/10 p-6 rounded-xl mb-8 border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input name="title" value={newFeature.title} onChange={handleFeatureInputChange} placeholder="Feature Title" className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" required />
                        <input name="description" value={newFeature.description} onChange={handleFeatureInputChange} placeholder="Feature Description" className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" required />
                      </div>
                      <input type="file" name="image" accept="image/*" onChange={handleFeatureInputChange} className="mb-4 text-white" />
                      <div className="flex gap-4">
                        <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-md" disabled={loading}>
                          {loading ? 'Adding...' : 'Add Feature'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowAddFeature(false);
                            setNewFeature({ project: '', title: '', description: '', image: null });
                          }}
                          className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all duration-200 shadow-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {error && <div className="mb-4 text-red-400 text-center text-sm font-light">{error}</div>}
                  <div className="space-y-6">
                    {loading && <div className="text-white/60">Loading...</div>}
                    {isReordering && <div className="text-white/60 text-center">Reordering features...</div>}
                    {filteredFeatures.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-white/60 text-lg mb-2">No features found for this project</div>
                        <div className="text-white/40 text-sm">Add the first feature using the button above</div>
                      </div>
                    ) : (
                                              <div className="space-y-4">
                          <div className="text-white/60 text-sm mb-4">💡 Drag and drop features to reorder them • Click "Key Feature" to toggle which features appear in the frontend Key Features list</div>
                          {filteredFeatures.map((feature) => (
                            <div 
                              key={feature._id} 
                              className={`bg-white/5 rounded-xl p-6 flex flex-col md:flex-row items-center border border-white/10 cursor-move transition-all duration-200 ${
                                draggedFeature?._id === feature._id ? 'opacity-50 scale-95' : ''
                              } ${feature.isKeyFeature ? 'border-blue-500/30 bg-blue-500/5' : ''}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, feature)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, feature)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="flex items-center gap-4 w-full">
                                <div className="text-white/40 text-lg">⋮⋮</div>
                                {feature.imageUrl && (
                                  <img src={feature.imageUrl} alt={feature.title} className="w-32 h-32 object-cover rounded-lg" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-2xl font-light text-white">{feature.title}</h2>
                                    {feature.isKeyFeature && (
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Key Feature</span>
                                    )}
                                  </div>
                                  <p className="text-white/70 mb-2">{feature.description}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button 
                                    onClick={() => handleToggleKeyFeature(feature._id)} 
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                      feature.isKeyFeature 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                                    }`}
                                  >
                                    {feature.isKeyFeature ? 'Remove Key' : 'Key Feature'}
                                  </button>
                                  <button onClick={() => openEditFeatureModal(feature)} className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-all duration-200">Edit</button>
                                  <button onClick={() => handleDeleteFeature(feature._id)} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200">Delete</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Edit Feature Modal */}
              {showEditFeatureModal && editFeature && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <form onSubmit={handleEditFeature} className="bg-white rounded-xl p-8 shadow-xl max-w-lg w-full text-left">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">Edit Feature</h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <select name="project" value={editFeature.project || ''} onChange={handleEditFeatureInputChange} className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" required>
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                      <input name="title" value={editFeature.title} onChange={handleEditFeatureInputChange} placeholder="Title" className="px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light" required />
                      <textarea name="description" value={editFeature.description} onChange={handleEditFeatureInputChange} placeholder="Description" className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-light mb-4" required />
                      <input type="file" name="image" accept="image/*" onChange={handleEditFeatureInputChange} className="mb-4 text-gray-900" />
                    </div>
                    <div className="flex gap-4 justify-end">
                      <button type="button" onClick={closeEditFeatureModal} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-200">Cancel</button>
                      <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                    {error && <div className="mt-4 text-red-500 text-center text-sm font-light">{error}</div>}
                  </form>
                </div>
              )}
              
              {/* Delete Feature Confirmation Modal */}
              {showDeleteFeatureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Delete Feature?</h3>
                    <p className="text-gray-700 mb-6">Are you sure you want to delete this feature? This action cannot be undone.</p>
                    <div className="flex gap-4 justify-center">
                      <button onClick={confirmDeleteFeature} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200">Delete</button>
                      <button onClick={cancelDeleteFeature} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-200">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === 'portfolio' && (
            <div className="bg-white/10 p-8 rounded-xl border border-white/10">
              <div className="flex gap-4 mb-8">
                <button onClick={() => setPortfolioTab('personal')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'personal' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>Personal Info</button>
                <button onClick={() => setPortfolioTab('about')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'about' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>About Me</button>
                <button onClick={() => setPortfolioTab('experience')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'experience' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>Experience</button>
                <button onClick={() => setPortfolioTab('education')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'education' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>Education</button>
                <button onClick={() => setPortfolioTab('skills')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'skills' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>Skills</button>
                <button onClick={() => setPortfolioTab('social')} className={`px-4 py-2 rounded-lg ${portfolioTab === 'social' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>Social/Contact</button>
              </div>
              {portfolioLoading && <div className="text-white/60 mb-4">Loading...</div>}
              {portfolioError && <div className="text-red-400 mb-4">{portfolioError}</div>}
              {uploadSuccess.message && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
                  {uploadSuccess.message}
                </div>
              )}
              {portfolio && (
                <form onSubmit={handleSavePortfolio} className="space-y-6">
                  {portfolioTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.name || ''} onChange={e => handlePortfolioChange('personalInfo', 'name', e.target.value)} placeholder="Name" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.title || ''} onChange={e => handlePortfolioChange('personalInfo', 'title', e.target.value)} placeholder="Title" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.email || ''} onChange={e => handlePortfolioChange('personalInfo', 'email', e.target.value)} placeholder="Email" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.location || ''} onChange={e => handlePortfolioChange('personalInfo', 'location', e.target.value)} placeholder="Location" />
                      <textarea className="col-span-2 px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.about || ''} onChange={e => handlePortfolioChange('personalInfo', 'about', e.target.value)} placeholder="Intro (for homepage)" />
                      
                      {/* Resume Link */}
                      <div className="col-span-2">
                        <label className="block text-white/70 text-sm font-medium mb-2">Resume Link</label>
                        <input 
                          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white font-light" 
                          value={portfolio.personalInfo?.resumeLink || ''} 
                          onChange={e => handlePortfolioChange('personalInfo', 'resumeLink', e.target.value)} 
                          placeholder="https://drive.google.com/file/d/your-resume-link" 
                        />
                        <p className="text-white/50 text-xs mt-2">
                          Add a link to your resume (Google Drive, Dropbox, or any direct download link)
                        </p>
                      </div>
                      
                      <div className="col-span-2 flex items-center gap-4 mt-2">
                        <label className="text-white/70">Profile Picture:</label>
                        <input type="file" accept="image/*" onChange={handlePersonalPfpChange} disabled={pfpUploadLoading} />
                        {pendingPersonalPfp && (
                          <>
                            <img src={URL.createObjectURL(pendingPersonalPfp)} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/20 ml-2" />
                            <button type="button" onClick={handleUploadPersonalPfp} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium ml-2" disabled={pfpUploadLoading}>Upload</button>
                          </>
                        )}
                        {pfpUploadLoading && (
                          <div className="flex items-center gap-2 ml-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-white/60 text-xs">Uploading...</span>
                          </div>
                        )}
                        {portfolio.personalInfo?.pfp && !pendingPersonalPfp && (
                          <img src={portfolio.personalInfo.pfp} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-white/20 ml-4" />
                        )}
                        {console.log('Rendering PFP:', portfolio.personalInfo?.pfp, 'Pending:', pendingPersonalPfp)}
                      </div>
                    </div>
                  )}
                  {portfolioTab === 'about' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/70 mb-2">About Me Content (for About section)</label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white font-light min-h-[200px]" 
                          value={portfolio.aboutMe || ''} 
                          onChange={e => handlePortfolioChange('aboutMe', '', e.target.value)} 
                          placeholder="Write your detailed about me content here. This will be displayed in the About section of your portfolio." 
                        />
                        <p className="text-white/50 text-sm mt-2">
                          This content will be displayed in the About section of your portfolio. You can write about your background, interests, goals, etc.
                        </p>
                      </div>
                    </div>
                  )}
                  {portfolioTab === 'experience' && (
                    <div>
                      {(portfolio.experience || []).map((exp, idx) => (
                        <div key={idx} className="mb-4 bg-white/5 p-4 rounded-lg">
                          <div className="flex gap-2 mb-2">
                            <input className="flex-1 px-3 py-2 rounded bg-white/20 text-white font-light" value={exp.title} onChange={e => handlePortfolioChange('experience', 'title', e.target.value, idx)} placeholder="Title" />
                            <input className="flex-1 px-3 py-2 rounded bg-white/20 text-white font-light" value={exp.company} onChange={e => handlePortfolioChange('experience', 'company', e.target.value, idx)} placeholder="Company" />
                            <input className="flex-1 px-3 py-2 rounded bg-white/20 text-white font-light" value={exp.period} onChange={e => handlePortfolioChange('experience', 'period', e.target.value, idx)} placeholder="Period" />
                          </div>
                          <textarea className="w-full px-3 py-2 rounded bg-white/20 text-white font-light mb-2" value={exp.description} onChange={e => handlePortfolioChange('experience', 'description', e.target.value, idx)} placeholder="Description" />
                          <button type="button" onClick={() => removeExperience(idx)} className="text-red-400 hover:underline text-xs">Remove</button>
                        </div>
                      ))}
                      <button type="button" onClick={addExperience} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200">Add Experience</button>
                    </div>
                  )}
                  {portfolioTab === 'education' && (
                    <div>
                      {(portfolio.education || []).map((edu, idx) => (
                        <div key={idx} className="mb-4 bg-white/5 p-4 rounded-lg">
                          <div className="flex gap-2 mb-2 items-center">
                            <select className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.type || 'college'} onChange={e => handlePortfolioChange('education', 'type', e.target.value, idx)}>
                              <option value="college">College/University</option>
                              <option value="school">School</option>
                            </select>
                            <button type="button" onClick={() => removeEducation(idx)} className="text-red-400 hover:underline text-xs ml-auto">Remove</button>
                          </div>
                          {edu.type === 'college' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.institution || ''} onChange={e => handlePortfolioChange('education', 'institution', e.target.value, idx)} placeholder="Institution" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.program || ''} onChange={e => handlePortfolioChange('education', 'program', e.target.value, idx)} placeholder="Program (e.g. B.Tech)" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.branch || ''} onChange={e => handlePortfolioChange('education', 'branch', e.target.value, idx)} placeholder="Branch/Major" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.startYear || ''} onChange={e => handlePortfolioChange('education', 'startYear', e.target.value, idx)} placeholder="Start Year" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.endYear || ''} onChange={e => handlePortfolioChange('education', 'endYear', e.target.value, idx)} placeholder="End Year" />
                              <input className="col-span-2 px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.description || ''} onChange={e => handlePortfolioChange('education', 'description', e.target.value, idx)} placeholder="Description (optional)" />
                              <div className="col-span-2 flex items-center gap-4 mt-2">
                                <label className="text-white/70">College PFP:</label>
                                <input type="file" accept="image/*" onChange={e => handleEducationPfpChange(e, idx)} disabled={eduPfpUploadLoading[idx]} />
                                {pendingEduPfp[idx] && (
                                  <>
                                    <img src={URL.createObjectURL(pendingEduPfp[idx])} alt="Preview" className="w-14 h-14 rounded object-cover border border-white/20 ml-2" />
                                    <button type="button" onClick={() => handleUploadEducationPfp(idx, 'college')} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium ml-2" disabled={eduPfpUploadLoading[idx]}>Upload</button>
                                  </>
                                )}
                                {eduPfpUploadLoading[idx] && (
                                  <div className="flex items-center gap-2 ml-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span className="text-white/60 text-xs">Uploading...</span>
                                  </div>
                                )}
                                {edu.collegePfp && !pendingEduPfp[idx] && (
                                  <img src={edu.collegePfp} alt="College PFP" className="w-14 h-14 rounded object-cover border border-white/20 ml-4" />
                                )}
                              </div>
                            </div>
                          )}
                          {edu.type === 'school' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.schoolName || ''} onChange={e => handlePortfolioChange('education', 'schoolName', e.target.value, idx)} placeholder="School Name" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.board || ''} onChange={e => handlePortfolioChange('education', 'board', e.target.value, idx)} placeholder="Board (e.g. CBSE)" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.class || ''} onChange={e => handlePortfolioChange('education', 'class', e.target.value, idx)} placeholder="Class (e.g. 10th, 12th)" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.yearOfPassing || ''} onChange={e => handlePortfolioChange('education', 'yearOfPassing', e.target.value, idx)} placeholder="Year of Passing" />
                              <input className="px-3 py-2 rounded bg-white/20 text-white font-light" value={edu.marks || ''} onChange={e => handlePortfolioChange('education', 'marks', e.target.value, idx)} placeholder="Marks/Percentage" />
                              <div className="col-span-2 flex items-center gap-4 mt-2">
                                <label className="text-white/70">School PFP:</label>
                                <input type="file" accept="image/*" onChange={e => handleEducationPfpChange(e, idx)} disabled={eduPfpUploadLoading[idx]} />
                                {pendingEduPfp[idx] && (
                                  <>
                                    <img src={URL.createObjectURL(pendingEduPfp[idx])} alt="Preview" className="w-14 h-14 rounded object-cover border border-white/20 ml-2" />
                                    <button type="button" onClick={() => handleUploadEducationPfp(idx, 'school')} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium ml-2" disabled={eduPfpUploadLoading[idx]}>Upload</button>
                                  </>
                                )}
                                {eduPfpUploadLoading[idx] && (
                                  <div className="flex items-center gap-2 ml-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    <span className="text-white/60 text-xs">Uploading...</span>
                                  </div>
                                )}
                                {edu.schoolPfp && !pendingEduPfp[idx] && (
                                  <img src={edu.schoolPfp} alt="School PFP" className="w-14 h-14 rounded object-cover border border-white/20 ml-4" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setPortfolio(prev => ({ ...prev, education: [...(prev.education || []), { type: 'college', institution: '', program: '', branch: '', startYear: '', endYear: '', description: '' }] }))} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200">Add College/University</button>
                        <button type="button" onClick={() => setPortfolio(prev => ({ ...prev, education: [...(prev.education || []), { type: 'school', schoolName: '', board: '', class: '', yearOfPassing: '', marks: '' }] }))} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200">Add School</button>
                      </div>
                    </div>
                  )}
                  {portfolioTab === 'skills' && (
                    <input className="w-full px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.skills?.join(', ') || ''} onChange={e => handlePortfolioChange('skills', '', e.target.value)} placeholder="Skills (comma separated)" />
                  )}
                  {portfolioTab === 'social' && (
                    <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.github || ''} onChange={e => handlePortfolioChange('socialLinks', 'github', e.target.value)} placeholder="GitHub" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.linkedin || ''} onChange={e => handlePortfolioChange('socialLinks', 'linkedin', e.target.value)} placeholder="LinkedIn" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.twitter || ''} onChange={e => handlePortfolioChange('socialLinks', 'twitter', e.target.value)} placeholder="Twitter" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.website || ''} onChange={e => handlePortfolioChange('socialLinks', 'website', e.target.value)} placeholder="Website" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.email || ''} onChange={e => handlePortfolioChange('socialLinks', 'email', e.target.value)} placeholder="Contact Email" />
                      <input className="px-4 py-3 rounded-lg bg-white/20 text-white font-light" value={portfolio.personalInfo?.socialLinks?.phone || ''} onChange={e => handlePortfolioChange('socialLinks', 'phone', e.target.value)} placeholder="Phone" />
                      </div>
                      
                      {/* Phone Number Visibility Toggle */}
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium mb-1">Phone Number Visibility</h4>
                            <p className="text-white/60 text-sm">Control whether your phone number is displayed on your portfolio</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={portfolio.personalInfo?.socialLinks?.showPhone !== false}
                              onChange={e => handlePortfolioChange('socialLinks', 'showPhone', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="mt-3 text-xs text-white/50">
                          {portfolio.personalInfo?.socialLinks?.showPhone !== false ? 
                            '✅ Phone number will be visible on your portfolio' : 
                            '❌ Phone number will be hidden from your portfolio'
                          }
                        </div>
                      </div>
                    </div>
                  )}
                  <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-md" disabled={portfolioLoading}>Save Changes</button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword 
          onClose={() => setShowChangePassword(false)} 
          token={localStorage.getItem('adminToken')}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 