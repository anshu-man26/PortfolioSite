// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Portfolio endpoints
  PORTFOLIO: `${API_BASE_URL}/api/portfolio`,
  HEALTH: `${API_BASE_URL}/api/health`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_PORTFOLIO: `${API_BASE_URL}/api/admin/portfolio`,
  ADMIN_PERSONAL_PFP: `${API_BASE_URL}/api/admin/personal-pfp`,
  ADMIN_COLLEGE_PFP: `${API_BASE_URL}/api/admin/college-pfp`,
  ADMIN_SCHOOL_PFP: `${API_BASE_URL}/api/admin/school-pfp`,
  
  // Password endpoints
  PASSWORD_REQUEST_RESET: `${API_BASE_URL}/api/password/request-reset`,
  PASSWORD_RESET: `${API_BASE_URL}/api/password/reset`,
  PASSWORD_CHANGE: `${API_BASE_URL}/api/password/change`,
  PASSWORD_REQUEST_CHANGE_OTP: `${API_BASE_URL}/api/password/request-change-otp`,
  PASSWORD_CHANGE_WITH_OTP: `${API_BASE_URL}/api/password/change-with-otp`,
  
  // Project endpoints
  PROJECTS: `${API_BASE_URL}/api/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE_URL}/api/projects/${id}`,
  
  // Feature endpoints
  FEATURES: `${API_BASE_URL}/api/features`,
  FEATURE_BY_ID: (id) => `${API_BASE_URL}/api/features/${id}`,
  FEATURE_ORDER_UPDATE: `${API_BASE_URL}/api/features/order/update`,
  FEATURE_TOGGLE_KEY: (id) => `${API_BASE_URL}/api/features/${id}/toggle-key`,
};

export default API_BASE_URL; 