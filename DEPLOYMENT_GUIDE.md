# Portfolio Deployment Guide

## 🚀 Railway Deployment (Full-Stack)

This guide will help you deploy your portfolio website on Railway with both frontend and backend.

### Prerequisites

1. **MongoDB Atlas Account** - for database
2. **Cloudinary Account** - for image uploads
3. **Gmail Account** - for password reset emails
4. **Railway Account** - for hosting

### Step 1: Set Up Environment Variables

In your Railway project dashboard, add these environment variables:

```bash
# MongoDB Configuration
MONGO_DB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/portfolio

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
NODE_ENV=production
PORT=5000
```

### Step 2: Deploy to Railway

1. **Connect your GitHub repository** to Railway
2. **Select the backend directory** as the source
3. **Railway will automatically:**
   - Run `npm run build` (builds frontend + installs backend deps)
   - Run `npm start` (starts the server)
   - Serve both API and frontend from the same domain

### Step 3: Access Your Application

- **Frontend**: `https://your-railway-app.railway.app`
- **API Health Check**: `https://your-railway-app.railway.app/api/health`
- **Admin Panel**: `https://your-railway-app.railway.app/admin`

### Alternative: Separate Deployments

If you prefer separate deployments:

#### Frontend (Vercel/Netlify)
1. Deploy frontend to Vercel/Netlify
2. Set environment variable: `REACT_APP_API_URL=https://your-railway-backend.railway.app`

#### Backend (Railway)
1. Deploy only backend to Railway
2. Set environment variables as above
3. Access API at: `https://your-railway-backend.railway.app/api/*`

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure IP whitelist includes Railway's IPs

2. **Frontend Not Loading**
   - Check if build completed successfully
   - Verify static files are being served

3. **Environment Variables Not Working**
   - Double-check variable names (case-sensitive)
   - Redeploy after adding variables

### Build Process

The build script (`backend/build.sh`) does the following:
1. Installs frontend dependencies
2. Builds frontend React app
3. Installs backend dependencies
4. Server serves both API and frontend

## 📝 Notes

- The backend serves the frontend build files from `/frontend/build`
- All API routes are prefixed with `/api`
- React Router handles client-side routing
- Static files (images) are served from `/images` 