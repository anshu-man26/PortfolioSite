const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    // Check if MONGO_DB_URI is defined
    if (!process.env.MONGO_DB_URI) {
      throw new Error('MONGO_DB_URI environment variable is not defined. Please set it in your Railway environment variables.');
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message.includes('MONGO_DB_URI environment variable is not defined')) {
      console.error('Please set the MONGO_DB_URI environment variable in your Railway project settings.');
    }
    process.exit(1);
  }
};

module.exports = connectDB; 