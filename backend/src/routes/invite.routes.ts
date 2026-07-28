import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/invite-david", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      date,
      location,
      message,
    } = req.body;

    // Validation
    if (!name || !email || !eventType || !date) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Email to you
    await transporter.sendMail({
      from: `"Speaking Invitation" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "🎤 New Speaking Invitation Received",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#B8860B;">New Speaking Invitation</h2>

          <table cellpadding="8">
            <tr><td><strong>Name</strong></td><td>${name}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || "Not provided"}</td></tr>
            <tr><td><strong>Event Type</strong></td><td>${eventType}</td></tr>
            <tr><td><strong>Date</strong></td><td>${date}</td></tr>
            <tr><td><strong>Location</strong></td><td>${location || "Not provided"}</td></tr>
          </table>

          <h3>Message</h3>

          <p>${message || "No message provided"}</p>

          <hr>

          <small>Submitted from your website.</small>
        </div>
      `,
    });

    // Confirmation email
    await transporter.sendMail({
      from: `"David's Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We have received your invitation",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">

          <h2>Thank you ${name}!</h2>

          <p>
            We have successfully received your speaking invitation.
          </p>

          <p>
            Our team will review your request and contact you shortly.
          </p>

          <hr>

          <p><strong>Your Request</strong></p>

          <ul>
            <li><strong>Event:</strong> ${eventType}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Location:</strong> ${location || "Not specified"}</li>
          </ul>

          <p>
            Thank you for considering David.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Invitation submitted successfully.",
    });
  } catch (error) {
    console.error("Invite Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send invitation.",
    });
  }
});

export default router;