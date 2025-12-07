/**
 * Email Service using Brevo (formerly Sendinblue)
 * 
 * Setup:
 * 1. Create Brevo account at https://brevo.com/
 * 2. Go to Settings > API Keys
 * 3. Create or copy your API key
 * 4. Add to .env: BREVO_API_KEY=your_api_key
 * 5. Add to .env: BREVO_FROM_EMAIL=your_verified_email
 * 6. Add to .env: BREVO_FROM_NAME=Z Blogs
 * 
 * Important: Verify your sender email in Brevo dashboard!
 */

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send email using Brevo HTTP API
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.htmlContent - HTML content
 * @returns {Promise} Response
 */
const sendBrevoEmail = async (emailData) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || 'Z Blogs';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }
  if (!fromEmail) {
    throw new Error('BREVO_FROM_EMAIL is not configured');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: emailData.to }],
      subject: emailData.subject,
      htmlContent: emailData.htmlContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to send email (status: ${response.status})`);
  }

  return data;
};

/**
 * Send OTP email for signup verification
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} username - User's username
 * @returns {Promise} Brevo response
 */
export const sendSignupOTP = async (email, otp, username) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin: 0;">Z Blogs</h1>
        <p style="color: #666; margin-top: 5px;">Email Verification</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h2 style="color: white; margin: 0 0 10px 0;">Welcome, ${username}!</h2>
        <p style="color: rgba(255,255,255,0.9); margin: 0;">Your verification code is:</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
        </div>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">This code expires in 5 minutes</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p>If you didn't request this code, please ignore this email.</p>
        <p style="margin-top: 20px;">© ${new Date().getFullYear()} Z Blogs. All rights reserved.</p>
      </div>
    </div>
  `;

  const response = await sendBrevoEmail({
    to: email,
    subject: 'Verify Your Email - Z Blogs',
    htmlContent,
  });

  return { success: true, response };
};

/**
 * Send OTP email for email change verification
 * @param {string} email - New email to verify
 * @param {string} otp - 6-digit OTP code
 * @param {string} username - User's username
 * @returns {Promise} Brevo response
 */
export const sendEmailChangeOTP = async (email, otp, username) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin: 0;">Z Blogs</h1>
        <p style="color: #666; margin-top: 5px;">Email Change Verification</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h2 style="color: white; margin: 0 0 10px 0;">Hi ${username}!</h2>
        <p style="color: rgba(255,255,255,0.9); margin: 0;">Your email change verification code is:</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
        </div>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">This code expires in 5 minutes</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p>If you didn't request this change, please secure your account immediately.</p>
        <p style="margin-top: 20px;">© ${new Date().getFullYear()} Z Blogs. All rights reserved.</p>
      </div>
    </div>
  `;

  const response = await sendBrevoEmail({
    to: email,
    subject: 'Verify Your New Email - Z Blogs',
    htmlContent,
  });

  return { success: true, response };
};

/**
 * Send welcome email after successful signup
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @returns {Promise} Brevo response
 */
export const sendWelcomeEmail = async (email, username) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin: 0;">Z Blogs</h1>
      </div>
      
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h2 style="color: white; margin: 0 0 20px 0;">Welcome to Z Blogs, ${username}! 🎉</h2>
        <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
          Your account has been successfully created and verified.
        </p>
        <p style="color: rgba(255,255,255,0.9); margin-top: 15px; font-size: 16px;">
          Start exploring and sharing your thoughts with the world!
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p style="margin-top: 20px;">© ${new Date().getFullYear()} Z Blogs. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const response = await sendBrevoEmail({
      to: email,
      subject: 'Welcome to Z Blogs! 🎉',
      htmlContent,
    });
    return { success: true, response };
  } catch (error) {
    // Don't throw - welcome email is not critical
    return { success: false, error };
  }
};

/**
 * Send OTP email for profile update verification
 * @param {string} email - User's current email
 * @param {string} otp - 6-digit OTP code
 * @param {string} username - User's username
 * @returns {Promise} Brevo response
 */
export const sendProfileUpdateOTP = async (email, otp, username) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a1a; margin: 0;">Z Blogs</h1>
        <p style="color: #666; margin-top: 5px;">Profile Update Verification</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h2 style="color: white; margin: 0 0 10px 0;">Hi ${username}!</h2>
        <p style="color: rgba(255,255,255,0.9); margin: 0;">Someone is trying to update your profile.</p>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0;">Your verification code is:</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
        </div>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">This code expires in 5 minutes</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p>If you didn't request this change, please secure your account immediately.</p>
        <p style="margin-top: 20px;">© ${new Date().getFullYear()} Z Blogs. All rights reserved.</p>
      </div>
    </div>
  `;

  const response = await sendBrevoEmail({
    to: email,
    subject: 'Verify Profile Update - Z Blogs',
    htmlContent,
  });

  return { success: true, response };
};
