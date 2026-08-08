// backend/src/routes/invitation.routes.ts

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

/**
 * Escape user input before inserting it into HTML emails.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
        error: "Please fill in all required fields.",
      });
    }

    // Clean / escape values
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeEventType = escapeHtml(eventType);
    const safeDate = escapeHtml(date);
    const safeLocation = escapeHtml(location || "Not provided");
    const safeMessage = escapeHtml(message || "No message provided");

    // ---------------------------------------------------------
    // Email to David / website owner
    // ---------------------------------------------------------

    await transporter.sendMail({
      from: `"Speaking Invitation" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,

      subject: "🎤 New Speaking Invitation Received",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            padding: 30px;
            background: #f9f6ef;
            color: #2e1208;
          "
        >

          <div
            style="
              background: #4a1f0e;
              color: white;
              padding: 24px;
              border-radius: 12px 12px 0 0;
            "
          >
            <h2 style="margin: 0;">
              🎤 New Speaking Invitation
            </h2>

            <p style="margin: 8px 0 0; opacity: 0.85;">
              A new speaking request has been submitted through the website.
            </p>
          </div>

          <div
            style="
              background: white;
              padding: 25px;
              border-radius: 0 0 12px 12px;
            "
          >

            <table
              cellpadding="8"
              cellspacing="0"
              width="100%"
              style="border-collapse: collapse;"
            >

              <tr>
                <td><strong>Name</strong></td>
                <td>${safeName}</td>
              </tr>

              <tr>
                <td><strong>Email</strong></td>
                <td>${safeEmail}</td>
              </tr>

              <tr>
                <td><strong>Phone</strong></td>
                <td>${safePhone}</td>
              </tr>

              <tr>
                <td><strong>Event Type</strong></td>
                <td>${safeEventType}</td>
              </tr>

              <tr>
                <td><strong>Date</strong></td>
                <td>${safeDate}</td>
              </tr>

              <tr>
                <td><strong>Location</strong></td>
                <td>${safeLocation}</td>
              </tr>

            </table>

            <div
              style="
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #e8ddd4;
              "
            >

              <h3>Message</h3>

              <p style="line-height: 1.7; white-space: pre-line;">
                ${safeMessage}
              </p>

            </div>

            <hr style="border: none; border-top: 1px solid #e8ddd4; margin-top: 25px;" />

            <p
              style="
                font-size: 12px;
                color: #777;
              "
            >
              Submitted from David Emuria's official website.
            </p>

          </div>
        </div>
      `,
    });

    // ---------------------------------------------------------
    // Confirmation email to person making the invitation
    // ---------------------------------------------------------

    await transporter.sendMail({
      from: `"David's Team" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: "✅ We have received your invitation",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            padding: 30px;
            background: #f9f6ef;
            color: #2e1208;
          "
        >

          <div
            style="
              background: #4a1f0e;
              color: white;
              padding: 25px;
              border-radius: 12px 12px 0 0;
            "
          >

            <h2 style="margin: 0;">
              Thank you, ${safeName}!
            </h2>

            <p style="margin-top: 8px;">
              Your speaking invitation has been received.
            </p>

          </div>

          <div
            style="
              background: white;
              padding: 25px;
              border-radius: 0 0 12px 12px;
            "
          >

            <p style="line-height: 1.7;">
              We have successfully received your speaking invitation.
            </p>

            <p style="line-height: 1.7;">
              Our team will review your request and contact you shortly.
            </p>

            <div
              style="
                margin-top: 25px;
                padding: 20px;
                background: #f9f6ef;
                border-radius: 10px;
              "
            >

              <h3>Your Request</h3>

              <ul style="line-height: 1.8;">
                <li>
                  <strong>Event:</strong>
                  ${safeEventType}
                </li>

                <li>
                  <strong>Date:</strong>
                  ${safeDate}
                </li>

                <li>
                  <strong>Location:</strong>
                  ${safeLocation}
                </li>
              </ul>

            </div>

            <p style="margin-top: 25px; line-height: 1.7;">
              Thank you for considering David for your event.
            </p>

            <hr
              style="
                border: none;
                border-top: 1px solid #e8ddd4;
                margin-top: 25px;
              "
            />

            <p
              style="
                font-size: 12px;
                color: #777;
              "
            >
              This is an automated confirmation from David Emuria's website.
            </p>

          </div>
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
      message: "Failed to send invitation. Please try again later.",
    });
  }
});

export default router;