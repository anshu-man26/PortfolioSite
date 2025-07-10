import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

const AdminRoute = () => {
  const token = localStorage.getItem('adminToken');
  
  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If not logged in, show login page
  return <AdminLogin />;
};

export default AdminRoute; 