// backend/src/routes/invitation.routes.ts

import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

/* ==========================================================================
   EMAIL TRANSPORTER
   ========================================================================== */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure:
    String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ==========================================================================
   HTML ESCAPE
   ========================================================================== */

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   POST /api/invite
   ========================================================================== */

router.post("/", async (req, res) => {
  try {
    console.log("");
    console.log("========================================");
    console.log("🎤 NEW SPEAKING INVITATION");
    console.log("========================================");

    console.log("Request body:", req.body);

    /* ----------------------------------------------------------------------
       RECEIVE FORM DATA
       ---------------------------------------------------------------------- */

    const {
      name,
      email,
      phone,
      program,
      preferredDate,
      location,
      message,
    } = req.body;

    /* ----------------------------------------------------------------------
       VALIDATION
       ---------------------------------------------------------------------- */

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter your name.",
      });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter your email address.",
      });
    }

    if (!program || !String(program).trim()) {
      return res.status(400).json({
        success: false,
        error: "Please tell us what you are inviting David to speak about.",
      });
    }

    /* ----------------------------------------------------------------------
       CLEAN / ESCAPE DATA
       ---------------------------------------------------------------------- */

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(
      phone || "Not provided"
    );

    const safeProgram = escapeHtml(program);

    const safeDate = escapeHtml(
      preferredDate || "Not specified"
    );

    const safeLocation = escapeHtml(
      location || "Not provided"
    );

    const safeMessage = escapeHtml(
      message || "No additional message provided."
    );

    /* ==========================================================================
       EMAIL CONFIGURATION
       ========================================================================== */

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.SMTP_USER;

    const smtpFrom =
      process.env.SMTP_FROM ||
      `David Emuria Website <${process.env.SMTP_USER}>`;

    /* ----------------------------------------------------------------------
       CHECK EMAIL CONFIGURATION
       ---------------------------------------------------------------------- */

    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error(
        "❌ SMTP_USER or SMTP_PASS is missing."
      );

      return res.status(500).json({
        success: false,
        error:
          "Email service is not configured correctly.",
      });
    }

    if (!adminEmail) {
      console.error(
        "❌ ADMIN_EMAIL is missing."
      );

      return res.status(500).json({
        success: false,
        error:
          "Administrator email is not configured.",
      });
    }

    /* ==========================================================================
       VERIFY SMTP CONNECTION
       ========================================================================== */

    try {
      await transporter.verify();

      console.log(
        "✅ SMTP connection verified."
      );
    } catch (smtpError) {
      console.error(
        "❌ SMTP verification failed:",
        smtpError
      );

      return res.status(500).json({
        success: false,
        error:
          "Email service is currently unavailable.",
      });
    }

    /* ==========================================================================
       EMAIL 1 — NOTIFICATION TO DAVID / ADMIN
       ========================================================================== */

    console.log(
      `📧 Sending admin notification to ${adminEmail}`
    );

    await transporter.sendMail({
      from: smtpFrom,

      to: adminEmail,

      replyTo: email,

      subject:
        `🎤 New Speaking Invitation from ${name}`,

      html: `
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            New Speaking Invitation
          </title>

        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f4f1ec;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              max-width:650px;
              margin:30px auto;
              background:#ffffff;
              border-radius:14px;
              overflow:hidden;
              box-shadow:0 4px 20px rgba(0,0,0,0.08);
            "
          >

            <!-- HEADER -->

            <div
              style="
                background:#4A1F0E;
                color:#ffffff;
                padding:28px;
              "
            >

              <h1
                style="
                  margin:0;
                  font-size:24px;
                "
              >
                🎤 New Speaking Invitation
              </h1>

              <p
                style="
                  margin:10px 0 0;
                  color:#f3dfc8;
                  font-size:14px;
                "
              >
                A new speaking request has been
                submitted through David Emuria's website.
              </p>

            </div>

            <!-- CONTENT -->

            <div
              style="
                padding:30px;
              "
            >

              <h2
                style="
                  color:#3B2314;
                  margin-top:0;
                "
              >
                Invitation Details
              </h2>

              <table
                width="100%"
                cellpadding="10"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                  font-size:14px;
                "
              >

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                      width:35%;
                      border-bottom:1px solid #eee;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      border-bottom:1px solid #eee;
                    "
                  >
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                      border-bottom:1px solid #eee;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      border-bottom:1px solid #eee;
                    "
                  >
                    ${safeEmail}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                      border-bottom:1px solid #eee;
                    "
                  >
                    Phone
                  </td>

                  <td
                    style="
                      border-bottom:1px solid #eee;
                    "
                  >
                    ${safePhone}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                      border-bottom:1px solid #eee;
                    "
                  >
                    Event / Program
                  </td>

                  <td
                    style="
                      border-bottom:1px solid #eee;
                    "
                  >
                    ${safeProgram}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                      border-bottom:1px solid #eee;
                    "
                  >
                    Preferred Date
                  </td>

                  <td
                    style="
                      border-bottom:1px solid #eee;
                    "
                  >
                    ${safeDate}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      font-weight:bold;
                      color:#555;
                    "
                  >
                    Location
                  </td>

                  <td>
                    ${safeLocation}
                  </td>
                </tr>

              </table>

              <!-- MESSAGE -->

              <div
                style="
                  margin-top:25px;
                  padding:20px;
                  background:#faf7f2;
                  border-left:4px solid #C08A43;
                  border-radius:8px;
                "
              >

                <h3
                  style="
                    margin-top:0;
                    color:#3B2314;
                  "
                >
                  Message
                </h3>

                <p
                  style="
                    margin-bottom:0;
                    line-height:1.7;
                    color:#555;
                    white-space:pre-line;
                  "
                >
                  ${safeMessage}
                </p>

              </div>

              <!-- REPLY BUTTON -->

              <div
                style="
                  margin-top:25px;
                  text-align:center;
                "
              >

                <a
                  href="mailto:${safeEmail}"
                  style="
                    display:inline-block;
                    background:#4A1F0E;
                    color:#ffffff;
                    text-decoration:none;
                    padding:12px 22px;
                    border-radius:25px;
                    font-weight:bold;
                  "
                >
                  Reply to ${safeName}
                </a>

              </div>

              <hr
                style="
                  margin:30px 0 20px;
                  border:none;
                  border-top:1px solid #eee;
                "
              />

              <p
                style="
                  margin:0;
                  color:#888;
                  font-size:12px;
                  text-align:center;
                "
              >
                Submitted from
                David Emuria's official website.
              </p>

            </div>

          </div>

        </body>

        </html>
      `,
    });

    console.log(
      "✅ Admin notification email sent."
    );

    /* ==========================================================================
       EMAIL 2 — CONFIRMATION TO CUSTOMER
       ========================================================================== */

    console.log(
      `📧 Sending confirmation email to ${email}`
    );

    await transporter.sendMail({
      from: smtpFrom,

      to: email,

      subject:
        "✅ We received your speaking invitation",

      html: `
        <!DOCTYPE html>

        <html>

        <head>

          <meta charset="UTF-8" />

          <title>
            Speaking Invitation Received
          </title>

        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f4f1ec;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              max-width:650px;
              margin:30px auto;
              background:#ffffff;
              border-radius:14px;
              overflow:hidden;
              box-shadow:0 4px 20px rgba(0,0,0,0.08);
            "
          >

            <!-- HEADER -->

            <div
              style="
                background:#4A1F0E;
                color:#ffffff;
                padding:28px;
              "
            >

              <h1
                style="
                  margin:0;
                  font-size:24px;
                "
              >
                Thank You, ${safeName}!
              </h1>

              <p
                style="
                  margin:10px 0 0;
                  color:#f3dfc8;
                "
              >
                Your speaking invitation has been received.
              </p>

            </div>

            <!-- CONTENT -->

            <div
              style="
                padding:30px;
              "
            >

              <p
                style="
                  font-size:15px;
                  line-height:1.7;
                  color:#555;
                "
              >
                Thank you for reaching out to David
                Emuria through the website.
                We have successfully received your
                speaking invitation.
              </p>

              <p
                style="
                  font-size:15px;
                  line-height:1.7;
                  color:#555;
                "
              >
                David's team will review your request
                and get back to you shortly.
              </p>

              <!-- REQUEST SUMMARY -->

              <div
                style="
                  margin-top:25px;
                  padding:22px;
                  background:#faf7f2;
                  border-radius:10px;
                "
              >

                <h2
                  style="
                    margin-top:0;
                    color:#3B2314;
                    font-size:18px;
                  "
                >
                  Your Request
                </h2>

                <p>
                  <strong>Event / Program:</strong>
                  ${safeProgram}
                </p>

                <p>
                  <strong>Preferred Date:</strong>
                  ${safeDate}
                </p>

                <p>
                  <strong>Location:</strong>
                  ${safeLocation}
                </p>

              </div>

              <p
                style="
                  margin-top:25px;
                  font-size:15px;
                  line-height:1.7;
                  color:#555;
                "
              >
                We appreciate your interest in having
                David speak at your event.
              </p>

              <p
                style="
                  margin-top:25px;
                  color:#3B2314;
                "
              >
                Blessings,
                <br />

                <strong>
                  David Emuria's Team
                </strong>
              </p>

              <hr
                style="
                  margin:30px 0 20px;
                  border:none;
                  border-top:1px solid #eee;
                "
              />

              <p
                style="
                  margin:0;
                  color:#888;
                  font-size:12px;
                  text-align:center;
                "
              >
                This is an automated confirmation
                from David Emuria's official website.
              </p>

            </div>

          </div>

        </body>

        </html>
      `,
    });

    console.log(
      "✅ Customer confirmation email sent."
    );

    console.log(
      "========================================"
    );
    console.log(
      "🎉 SPEAKING INVITATION COMPLETED"
    );
    console.log(
      "========================================"
    );

    /* ==========================================================================
       SUCCESS RESPONSE
       ========================================================================== */

    return res.status(200).json({
      success: true,
      message:
        "Speaking invitation submitted successfully.",
    });

  } catch (error: any) {

    console.error("");
    console.error(
      "========================================"
    );
    console.error(
      "❌ SPEAKING INVITATION ERROR"
    );
    console.error(
      "========================================"
    );

    console.error(
      "Error:",
      error
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to send speaking invitation. Please try again later.",
    });
  }
});

/* ==========================================================================
   EXPORT
   ========================================================================== */

export default router;