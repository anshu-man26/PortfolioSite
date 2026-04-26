// Express app shared by the long-running server (server.js) and the
// AWS Lambda handler (lambda.js). No DB connect, no listen, no startup
// side effects — those happen in the entrypoints.

const express = require('express');
const cors = require('cors');
const portfolioController = require('./controllers/portfolioController');

const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const featureRoutes = require('./routes/featureRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

// CORS — allow the configured frontend origin in production, fall back
// to fully open for local dev so `npm start` on port 4000 still works.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: allowedOrigin || true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/password', passwordRoutes);

app.get('/api/portfolio', portfolioController.getPortfolio);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

app.get('/', (_req, res) => {
  res.send('Backend API working fine');
});

app.use('/images', express.static('public/images'));

module.exports = app;
