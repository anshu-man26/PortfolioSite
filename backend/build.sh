#!/bin/bash

echo "🚀 Starting build process..."

# Navigate to frontend directory and install dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Navigate back to backend directory
cd ../backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "✅ Build completed successfully!" 