import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create a test account (for development only)
const createTestAccount = async () => {
  return await nodemailer.createTestAccount();
};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.NODE_ENV === 'production', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER || 'user@example.com',
    pass: process.env.EMAIL_SERVER_PASSWORD || 'password',
  },
  tls: {
    // Do not fail on invalid certs in development
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
  debug: process.env.NODE_ENV !== 'production', // Show SMTP traffic in development
});

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  console.log('Sending email with config:', {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    from: process.env.EMAIL_FROM,
    to,
    subject,
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'CamGrocer'}" <${process.env.EMAIL_FROM || 'noreply@camgrocer.com'}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return { 
      success: false, 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const sendApprovalEmail = async (email: string, storeName: string) => {
  const subject = '🎉 Your Store Has Been Approved!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #27AE60;">Welcome to CamGrocer!</h1>
      <p>Dear Store Owner,</p>
      <p>We're excited to let you know that your store <strong>${storeName}</strong> has been approved!</p>
      <p>You can now log in to your account and start managing your store.</p>
      <p>
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login" 
           style="display: inline-block; padding: 10px 20px; background-color: #27AE60; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Log In to Your Account
        </a>
      </p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br/>The CamGrocer Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

export const sendRejectionEmail = async (email: string, storeName: string, reason: string) => {
  const subject = 'Update on Your Store Application';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #E74C3C;">Update on Your Store Application</h1>
      <p>Dear Store Owner,</p>
      <p>We regret to inform you that your store <strong>${storeName}</strong> application has been reviewed and we're unable to approve it at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is a mistake or would like more information, please contact our support team.</p>
      <p>Best regards,<br/>The CamGrocer Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};
