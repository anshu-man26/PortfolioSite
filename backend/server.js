const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/mongodb');
const portfolioController = require('./controllers/portfolioController');
const { verifyEmail } = require('./config/email');
const fs = require('fs');

// Connect to MongoDB
connectDB();

// Verify email service
verifyEmail();
 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const featureRoutes = require('./routes/featureRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

// Route middleware
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/password', passwordRoutes);

// Public portfolio route
app.get('/api/portfolio', portfolioController.getPortfolio);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

// Root endpoint for backend health check
app.get('/', (req, res) => {
  res.send('Backend API working fine');
});

// Serve static files (for images)
app.use('/images', express.static('public/images'));

const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Portfolio server running on port ${PORT}`);
}); 