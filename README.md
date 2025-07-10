# My PortFolio Website

A modern, responsive portfolio website built with React frontend and Node.js backend. Features a beautiful Apple-like design with admin panel for easy content management.

## ✨ Features

- **Modern Design**: Apple-inspired UI with beautiful gradients and animations
- **Responsive**: Works perfectly on all devices
- **Admin Panel**: Easy content management for portfolio updates
- **Image Upload**: Cloudinary integration for profile pictures and project images
- **Password Management**: Secure admin authentication with password reset
- **Resume Integration**: Direct resume download link
- **Contact Management**: Toggle phone number visibility
- **Real-time Updates**: Instant content updates through admin panel

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/My-PortFolio-Website.git
   cd My-PortFolio-Website
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

## 📁 Project Structure

```
My-PortFolio-Website/
├── backend/                 # Node.js API server
│   ├── config/             # Database and service configs
│   ├── controllers/        # API route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/              # React application
│   ├── public/            # Static files
│   ├── src/               # React components
│   │   ├── components/    # UI components
│   │   └── config/        # API configuration
│   └── build/             # Production build (generated)
├── package.json           # Root package.json
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run frontend only (port 4000)
npm run dev:backend      # Run backend only (port 5000)
```

### Production
```bash
npm run build            # Build frontend for production
npm run deploy:build     # Build both frontend and backend
npm start                # Start production server
```

### Setup
```bash
npm run install-all      # Install all dependencies
npm run create-admin     # Create admin user
npm run setup            # Install dependencies + create admin
```

## 🌐 Deployment

### Quick Deployment
```bash
# Run the deployment script
./deploy.sh

# Or manually
npm run deploy:build
npm start
```

### Supported Platforms
- **Render** (Recommended)
- **Vercel + Railway**
- **Heroku**
- **DigitalOcean App Platform**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Admin Panel

Access the admin panel at `/admin` after starting the application.

### Features
- **Portfolio Management**: Update personal info, about, experience, education
- **Project Management**: Add, edit, delete projects with images
- **Feature Management**: Add project features with drag-and-drop reordering
- **Image Upload**: Upload profile pictures and project images
- **Password Management**: Change admin password with OTP verification
- **Contact Settings**: Toggle phone number visibility

## 🎨 Design Features

- **Apple-like Aesthetics**: Clean, modern design with subtle animations
- **Gradient Backgrounds**: Beautiful color gradients throughout
- **Glassmorphism**: Modern glass effects on cards and components
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects and hover animations
- **Dark Theme**: Easy on the eyes with excellent contrast

## 🔒 Security Features

- **JWT Authentication**: Secure admin authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Express-validator for API validation
- **CORS Protection**: Configured for production domains
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout and touch interactions
- **Mobile**: Mobile-first design with touch-friendly elements

## 🚀 Performance

- **Optimized Build**: React production build with code splitting
- **Image Optimization**: Cloudinary integration for fast image loading
- **Lazy Loading**: Components load as needed
- **Minified Assets**: CSS and JS are minified for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** for the amazing frontend framework
- **Node.js** for the robust backend
- **MongoDB** for the flexible database
- **Cloudinary** for image management
- **Tailwind CSS** for the utility-first styling

## 📞 Support

If you have any questions or need help with deployment:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ using React, Node.js, and MongoDB**

**Live Demo**: [Your Portfolio URL]
**Admin Panel**: [Your Portfolio URL]/admin 