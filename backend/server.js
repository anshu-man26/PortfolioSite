// Long-running Node entrypoint (local dev / classic VM hosts).
// AWS Lambda invocations go through lambda.js instead.

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = require('./app');
const connectDB = require('./config/mongodb');
const { verifyEmail } = require('./config/email');

// Connect to MongoDB and verify email service on boot. These are
// fire-and-forget here because their failure modes (connection error,
// SMTP unreachable) are already logged inside their modules.
connectDB();
verifyEmail();

// In a unified deploy the frontend build sits next to the backend; serve
// it as a static SPA. Lambda doesn't reach this code path.
const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on :${PORT}`));
