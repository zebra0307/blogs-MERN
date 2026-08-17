const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const sendBrevoEmail = async ({ to, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY) {
    console.warn('No BREVO_API_KEY found, skipping email send.');
    return;
  }

  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Z Blogs',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@zblogs.com',
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  };

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Brevo Email Error:', errorData);
    }
  } catch (error) {
    console.error('Email Service Error:', error.message);
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${FRONTEND_URL}/verify-subscription/${token}`;
  const subject = 'Verify your subscription to Z Blogs';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #0d9488;">Welcome to Z Blogs!</h2>
      <p>Thank you for subscribing to my technical newsletter.</p>
      <p>Please click the button below to verify your email address and confirm your subscription:</p>
      <a href="${verifyUrl}" style="display: inline-block; background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Subscription</a>
      <p style="margin-top: 20px; font-size: 0.9em; color: #666;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
  await sendBrevoEmail({ to: email, subject, htmlContent });
};

export const sendNewPostNotification = async (emails, post) => {
  const postUrl = `${FRONTEND_URL}/post/${post.slug}`;
  
  // Brevo limits API calls, so for a real production system with thousands of users,
  // we would use Brevo's bulk email API or send in batches.
  // For now, we will loop through emails to send individually to handle unsubscribe links easily,
  // or use bcc if there's no unsubscribe token, but it's better to send individually.
  
  // To avoid blocking, we map and Promise.allSettled
  const emailPromises = emails.map((subscriber) => {
    const unsubscribeUrl = `${FRONTEND_URL}/unsubscribe/${subscriber.verificationToken}`;
    const subject = `New Post: ${post.title}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0d9488;">New Post on Z Blogs</h2>
        <h3>${post.title}</h3>
        <p>A new technical note has been published. Read it now!</p>
        <a href="${postUrl}" style="display: inline-block; background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Read Article</a>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 0.8em; color: #999;">
          You are receiving this because you subscribed to Z Blogs.<br/>
          <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
        </div>
      </div>
    `;
    return sendBrevoEmail({ to: subscriber.email, subject, htmlContent });
  });

  await Promise.allSettled(emailPromises);
};
