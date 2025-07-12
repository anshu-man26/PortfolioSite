# Railway Deployment Setup Guide

## Environment Variables Required

You need to set these environment variables in your Railway project:

### 1. MongoDB Configuration
```
MONGO_DB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/portfolio
```
- Get this from MongoDB Atlas or Railway MongoDB service
- Replace `your_username`, `your_password`, `your_cluster` with your actual MongoDB connection string

### 2. JWT Configuration
```
JWT_SECRET=your_jwt_secret_key_here
```
- Generate a strong secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Cloudinary Configuration (for image uploads)
```
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```
- Get these from your Cloudinary dashboard

### 4. Email Configuration (for password reset)
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
- Use Gmail with App Password (not regular password)

### 5. Server Configuration
```
NODE_ENV=production
PORT=5000
```

## How to Set Environment Variables in Railway

1. Go to your Railway dashboard
2. Select your project
3. Click on the "Variables" tab
4. Click "New Variable" for each environment variable
5. Add the variable name and value
6. Click "Add" to save

## Testing the Setup

After setting the environment variables:
1. Redeploy your application in Railway
2. Check the logs to see if MongoDB connects successfully
3. Test the health endpoint: `https://your-railway-app.railway.app/api/health`

## Common Issues

- **MONGO_DB_URI undefined**: Make sure you've set the environment variable in Railway
- **MongoDB connection failed**: Check your connection string and network access
- **JWT errors**: Ensure JWT_SECRET is set and is a strong random string 