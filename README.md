# My Portfolio Website

deployed here: https://portfolio-site-yt7t.vercel.app/

A modern portfolio website built with React frontend and Node.js backend.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anshu-man26/PortfolioSite.git
   cd PortfolioSite
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create `.env` files in both `backend/` and `frontend/` directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```

   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Create admin user**
   ```bash
   npm run create-admin
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run frontend only (port 4000)
npm run dev:backend      # Run backend only (port 5000)
npm run build            # Build frontend for production
npm start                # Start production server
npm run install-all      # Install all dependencies
npm run create-admin     # Create admin user
```

## Access

- **Portfolio**: http://localhost:4000
- **Admin Panel**: http://localhost:4000/admin
