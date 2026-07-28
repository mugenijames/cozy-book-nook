import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInviteNotification = async (formData: any) => {
  const { name, email, phone, program, date, location, message } = formData;

  await transporter.sendMail({
    from: `Cozy Book Nook <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFICATION_EMAIL, // your inbox
    subject: `🎤 New Speaking Invitation from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color:#B8860B;">New Speaking Invitation Received</h2>
        
        <table style="width:100%; border-collapse: collapse;">
          <tr><td><b>Name:</b></td><td>${name}</td></tr>
          <tr><td><b>Email:</b></td><td>${email}</td></tr>
          <tr><td><b>Phone:</b></td><td>${phone || "Not provided"}</td></tr>
          <tr><td><b>Program:</b></td><td>${program}</td></tr>
          <tr><td><b>Preferred Date:</b></td><td>${date}</td></tr>
          <tr><td><b>Location:</b></td><td>${location || "Not provided"}</td></tr>
        </table>

        <div style="margin-top:20px;">
          <b>Message:</b>
          <p style="background:#f8f8f8; padding:12px; border-radius:8px;">
            ${message || "No additional message"}
          </p>
        </div>

        <p style="color:#666; margin-top:24px;">
          Submitted from the Cozy Book Nook website.
        </p>
      </div>
    `,
  });
};

export const sendConfirmationEmail = async (formData: any) => {
  const { name, email, program, date } = formData;

  await transporter.sendMail({
    from: `David's Team <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ We received your invitation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color:#B8860B;">Thank you, ${name}!</h2>
        
        <p>Your invitation has been received successfully.</p>
        
        <div style="background:#FFF8E1; border:1px solid #D4AF37; padding:16px; border-radius:12px;">
          <p><b>Program:</b> ${program}</p>
          <p><b>Preferred Date:</b> ${date}</p>
        </div>

        <p style="margin-top:20px;">
          David's team will review your request and get back to you shortly.
        </p>

        <p style="color:#666; margin-top:24px;">
          Blessings,<br/>
          <b>David's Team</b>
        </p>
      </div>
    `,
  });
};