const bcrypt = require('bcryptjs');
const connectDB = require('../config/mongodb');
const Admin = require('../models/adminModel');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin';
    const adminPassword = 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create admin
    const admin = new Admin({
      email: adminEmail,
      password: hashedPassword,
    });
    
    await admin.save();
    console.log('Admin created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin(); 