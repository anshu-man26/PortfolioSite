const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter
const verifyEmail = async () => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
  } catch (error) {
    console.error('Email service error:', error);
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Portfolio Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You have requested to reset your password for the Portfolio Admin Panel.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Your OTP Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; font-family: monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This OTP is valid for 10 minutes. If you didn't request this password reset, please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email from your Portfolio Admin Panel.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send password change confirmation
const sendPasswordChangeEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Changed Successfully - Portfolio Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">Password Changed Successfully</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your password for the Portfolio Admin Panel has been successfully changed.
            </p>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-weight: bold;">
                ✅ Password change completed successfully
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If you didn't make this change, please contact the administrator immediately.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email from your Portfolio Admin Panel.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  transporter,
  verifyEmail,
  sendOTPEmail,
  sendPasswordChangeEmail
}; 