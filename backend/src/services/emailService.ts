import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface InviteData {
  name: string;
  email: string;
  phone?: string;
  program: string;
  date: string;
  location?: string;
  message?: string;
}

export const sendInviteEmails = async (data: InviteData) => {
  const { name, email, phone, program, date, location, message } = data;

  // Email to David (admin)
  const adminEmail = {
    from: process.env.SMTP_FROM || 'noreply@davidemuria.com',
    to: process.env.ADMIN_EMAIL || 'david@davidemuria.com',
    subject: `New Speaking Invitation from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #D4A017; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; color: #2E1208; }
          .content { background: #F9F6EF; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2E1208; }
          .value { color: #555; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E8DDD4; color: #888; font-size: 12px; }
          .program-badge { display: inline-block; background: #D4A017; color: #2E1208; padding: 5px 10px; border-radius: 5px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ New Speaking Invitation ✨</h1>
          </div>
          <div class="content">
            <p><strong>${name}</strong> has requested you to speak at their event!</p>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value">${email}</div>
            </div>
            
            ${phone ? `
            <div class="field">
              <div class="label">📞 Phone:</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">🎯 Program:</div>
              <div class="value"><span class="program-badge">${program}</span></div>
            </div>
            
            <div class="field">
              <div class="label">📅 Preferred Date:</div>
              <div class="value">${new Date(date).toLocaleDateString()}</div>
            </div>
            
            ${location ? `
            <div class="field">
              <div class="label">📍 Location:</div>
              <div class="value">${location}</div>
            </div>
            ` : ''}
            
            ${message ? `
            <div class="field">
              <div class="label">💬 Additional Details:</div>
              <div class="value">${message}</div>
            </div>
            ` : ''}
            
            <hr style="margin: 20px 0; border-color: #E8DDD4;" />
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/admin/invitations" style="background: #2E1208; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View All Invitations</a>
            </p>
          </div>
          <div class="footer">
            <p>This invitation was sent from your website's speaking request form.</p>
            <p>© ${new Date().getFullYear()} David Emuria</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Confirmation email to the requester
  const requesterEmail = {
    from: process.env.SMTP_FROM || 'noreply@davidemuria.com',
    to: email,
    subject: `Speaking Invitation Received - David Emuria`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #D4A017; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; color: #2E1208; }
          .content { background: #F9F6EF; padding: 30px; border-radius: 0 0 10px 10px; }
          .thankyou { font-size: 24px; color: #D4A017; text-align: center; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #E8DDD4; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You for Your Invitation!</h1>
          </div>
          <div class="content">
            <div class="thankyou">✨ ${name} ✨</div>
            
            <p>Thank you for inviting me to speak at your event. I'm honored by your invitation!</p>
            
            <p>I've received your request and will review the details:</p>
            
            <ul>
              <li><strong>Program:</strong> ${program}</li>
              <li><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString()}</li>
              ${location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
            </ul>
            
            <p>I will get back to you within 2-3 business days to discuss availability and next steps.</p>
            
            <p>In the meantime, feel free to explore my books and resources at <a href="${process.env.FRONTEND_URL}">davidemuria.com</a></p>
            
            <hr style="margin: 20px 0; border-color: #E8DDD4;" />
            
            <p style="text-align: center; font-size: 14px;">
              With gratitude,<br />
              <strong>David Emuria</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated confirmation. I'll respond personally soon.</p>
            <p>© ${new Date().getFullYear()} David Emuria</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(adminEmail);
    await transporter.sendMail(requesterEmail);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};