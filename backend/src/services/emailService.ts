import nodemailer from 'nodemailer';

// Email configuration
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
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Email to David (admin)
  const adminEmail = {
    from: process.env.SMTP_FROM || 'noreply@davidemuria.com',
    to: process.env.ADMIN_EMAIL || 'david@davidemuria.com',
    subject: `🎤 New Speaking Invitation from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2E1208 0%, #4A2A1A 100%); padding: 30px; text-align: center; }
          .header h1 { margin: 0; color: #D4A017; font-size: 28px; }
          .header p { margin: 10px 0 0; color: #F5E6B5; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .label { font-weight: bold; color: #2E1208; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .value { color: #555; font-size: 16px; margin-top: 5px; }
          .program-badge { display: inline-block; background: #D4A017; color: #2E1208; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
          .button { display: inline-block; background: #2E1208; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ New Speaking Invitation ✨</h1>
            <p>Someone wants to hear you speak!</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name</div>
              <div class="value"><strong>${name}</strong></div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email</div>
              <div class="value"><a href="mailto:${email}" style="color: #D4A017;">${email}</a></div>
            </div>
            
            ${phone ? `
            <div class="field">
              <div class="label">📞 Phone</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">🎯 Program</div>
              <div class="value"><span class="program-badge">${program}</span></div>
            </div>
            
            <div class="field">
              <div class="label">📅 Preferred Date</div>
              <div class="value">${formattedDate}</div>
            </div>
            
            ${location ? `
            <div class="field">
              <div class="label">📍 Location</div>
              <div class="value">${location}</div>
            </div>
            ` : ''}
            
            ${message ? `
            <div class="field">
              <div class="label">💬 Additional Details</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${email}" class="button">Reply to ${name}</a>
            </div>
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
    subject: `Thank You for Inviting David Emuria to Speak`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2E1208 0%, #4A2A1A 100%); padding: 30px; text-align: center; }
          .header h1 { margin: 0; color: #D4A017; font-size: 28px; }
          .content { padding: 30px; }
          .thankyou { font-size: 24px; color: #D4A017; text-align: center; margin-bottom: 20px; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You!</h1>
          </div>
          <div class="content">
            <div class="thankyou">Dear ${name},</div>
            
            <p>Thank you for inviting me to speak at your event. I'm truly honored by your invitation!</p>
            
            <p>I've received your request and will review the details:</p>
            
            <div class="details">
              <p><strong>🎯 Program:</strong> ${program}</p>
              <p><strong>📅 Preferred Date:</strong> ${formattedDate}</p>
              ${location ? `<p><strong>📍 Location:</strong> ${location}</p>` : ''}
            </div>
            
            <p>I will get back to you within <strong>2-3 business days</strong> to discuss availability and next steps.</p>
            
            <p>In the meantime, feel free to explore my books and resources at <a href="${process.env.FRONTEND_URL || 'https://emuria.netlify.app'}" style="color: #D4A017;">davidemuria.com</a></p>
            
            <hr style="margin: 30px 0; border-color: #eee;">
            
            <p style="text-align: center; font-size: 16px;">
              With gratitude,<br>
              <strong style="color: #D4A017;">David Emuria</strong>
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
    console.log(`✅ Invitation emails sent to ${email} and admin`);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};