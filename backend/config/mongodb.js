const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_DB_URI is defined
    if (!process.env.MONGO_DB_URI) {
      console.error('❌ MONGO_DB_URI environment variable is not defined!');
      console.error('📋 Please set the following environment variables in Railway:');
      console.error('   - MONGO_DB_URI (MongoDB connection string)');
      console.error('   - JWT_SECRET (for authentication)');
      console.error('   - CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY (for image uploads)');
      console.error('   - EMAIL_USER, EMAIL_PASS (for password reset)');
      console.error('🔗 Railway Dashboard → Your Project → Variables tab');
      throw new Error('Environment variables not configured');
    }
    
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 Connection string:', process.env.MONGO_DB_URI.substring(0, 20) + '...');
    
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.message.includes('Environment variables not configured')) {
      console.error('💡 Solution: Set environment variables in Railway dashboard');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Solution: Check your MongoDB username/password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solution: Check your MongoDB connection string and network access');
    }
    process.exit(1);
  }
};

module.exports = connectDB; 