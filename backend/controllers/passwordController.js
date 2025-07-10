const Admin = require('../models/adminModel');
const OTP = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail, sendPasswordChangeEmail } = require('../config/email');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset (send OTP)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    const otpDoc = new OTP({
      email,
      otp,
      expiresAt,
      type: 'password_reset'
    });
    await otpDoc.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ 
      message: 'OTP sent successfully to your email',
      email: email // Return email for frontend reference
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find and validate OTP
    const otpDoc = await OTP.findOne({ 
      email, 
      otp, 
      type: 'password_reset',
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update admin password
    await Admin.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    // Mark OTP as used
    otpDoc.used = true;
    await otpDoc.save();

    // Delete all OTPs for this email
    await OTP.deleteMany({ email });

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password (requires current password)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Verify token and get admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    // Send confirmation email
    await sendPasswordChangeEmail(admin.email);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password change OTP (for admin dashboard)
exports.requestPasswordChangeOTP = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Verify token and get admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: admin.email });

    // Save new OTP
    const otpDoc = new OTP({
      email: admin.email,
      otp,
      expiresAt,
      type: 'password_change'
    });
    await otpDoc.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(admin.email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ 
      message: 'OTP sent successfully to your email',
      email: admin.email
    });

  } catch (error) {
    console.error('Password change OTP request error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and change password (for admin dashboard)
exports.changePasswordWithOTP = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Verify token and get admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find and validate OTP
    const otpDoc = await OTP.findOne({ 
      email: admin.email, 
      otp, 
      type: 'password_change',
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    // Mark OTP as used
    otpDoc.used = true;
    await otpDoc.save();

    // Delete all OTPs for this email
    await OTP.deleteMany({ email: admin.email });

    // Send confirmation email
    await sendPasswordChangeEmail(admin.email);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change with OTP error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}; 