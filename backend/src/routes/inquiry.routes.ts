// backend/src/routes/inquiry.routes.ts

import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

/* ==========================================================================
   TYPES
   ========================================================================== */

interface InquiryBody {
  name?: string;
  email?: string;
  phone?: string;
  participationType?: string;
  subject?: string;
  message?: string;
}

/* ==========================================================================
   EMAIL CONFIGURATION
   ========================================================================== */

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const adminEmail =
  process.env.ADMIN_EMAIL ||
  process.env.SMTP_USER ||
  "davidemuria9780@gmail.com";

/*
 * We create the transporter once when the server starts.
 */
const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure:
          process.env.SMTP_SECURE === "true" ||
          smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

/* ==========================================================================
   HELPERS
   ========================================================================== */

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const normalizeParticipationType = (
  value: string
): string => {
  const normalized = value.trim().toLowerCase();

  if (normalized === "donate") {
    return "Donate";
  }

  if (normalized === "sponsor") {
    return "Sponsor";
  }

  if (normalized === "partner") {
    return "Partner";
  }

  return value.trim();
};

/* ==========================================================================
   POST /api/inquiries
   ========================================================================== */

/**
 * Dear Dad Initiative inquiry endpoint.
 *
 * Supports:
 *
 * Donate
 * Sponsor
 * Partner
 *
 * Sends:
 *
 * 1. Notification to admin
 * 2. Confirmation to participant
 */

router.post(
  "/",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        email,
        phone,
        participationType,
        subject,
        message,
      } = req.body as InquiryBody;

      /* --------------------------------------------------------------------
         VALIDATION
         -------------------------------------------------------------------- */

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Name is required.",
        });
      }

      if (!email?.trim()) {
        return res.status(400).json({
          success: false,
          error: "Email address is required.",
        });
      }

      if (!participationType?.trim()) {
        return res.status(400).json({
          success: false,
          error:
            "Please select how you would like to participate.",
        });
      }

      const normalizedType =
        normalizeParticipationType(
          participationType
        );

      if (
        !["Donate", "Sponsor", "Partner"].includes(
          normalizedType
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid participation type. Please choose Donate, Sponsor, or Partner.",
        });
      }

      /* --------------------------------------------------------------------
         EMAIL VALIDATION
         -------------------------------------------------------------------- */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          error:
            "Please provide a valid email address.",
        });
      }

      /* --------------------------------------------------------------------
         CLEAN DATA
         -------------------------------------------------------------------- */

      const cleanName = name.trim();
      const cleanEmail = email.trim();
      const cleanPhone =
        phone?.trim() || "Not provided";
      const cleanSubject =
        subject?.trim() ||
        `Dear Dad Initiative - ${normalizedType}`;
      const cleanMessage =
        message?.trim() ||
        "No additional message provided.";

      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "📨 NEW DEAR DAD INQUIRY"
      );
      console.log(
        "========================================"
      );
      console.log("Name:", cleanName);
      console.log("Email:", cleanEmail);
      console.log("Phone:", cleanPhone);
      console.log(
        "Participation:",
        normalizedType
      );
      console.log("Subject:", cleanSubject);
      console.log(
        "========================================"
      );

      /* --------------------------------------------------------------------
         CHECK EMAIL CONFIGURATION
         -------------------------------------------------------------------- */

      if (!transporter) {
        console.error(
          "❌ SMTP is not configured."
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is not configured on the server. Please contact us directly.",
        });
      }

      /* --------------------------------------------------------------------
         ADMIN EMAIL
         -------------------------------------------------------------------- */

      const adminHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Dear Dad Initiative Inquiry</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f7f4ef;
              font-family:Arial,Helvetica,sans-serif;
              color:#2e1208;
            "
          >
            <div
              style="
                max-width:680px;
                margin:40px auto;
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <div
                style="
                  background:#4a1f0e;
                  padding:30px;
                  color:#ffffff;
                "
              >
                <p
                  style="
                    margin:0 0 8px;
                    font-size:12px;
                    font-weight:bold;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    color:#d4a017;
                  "
                >
                  Dear Dad Initiative
                </p>

                <h1
                  style="
                    margin:0;
                    font-size:28px;
                  "
                >
                  New ${escapeHtml(
                    normalizedType
                  )} Inquiry
                </h1>
              </div>

              <div style="padding:32px">

                <p
                  style="
                    margin-top:0;
                    font-size:16px;
                    line-height:1.7;
                    color:#5c4436;
                  "
                >
                  A new person has expressed interest
                  in supporting the Dear Dad Initiative.
                </p>

                <div
                  style="
                    margin:25px 0;
                    padding:22px;
                    background:#f8f6f2;
                    border-radius:14px;
                  "
                >

                  <p>
                    <strong>Participation:</strong>
                    ${escapeHtml(
                      normalizedType
                    )}
                  </p>

                  <p>
                    <strong>Name:</strong>
                    ${escapeHtml(cleanName)}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${escapeHtml(cleanEmail)}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(cleanPhone)}
                  </p>

                  <p>
                    <strong>Subject:</strong>
                    ${escapeHtml(cleanSubject)}
                  </p>

                </div>

                <div
                  style="
                    margin-top:24px;
                  "
                >
                  <h3
                    style="
                      margin-bottom:10px;
                      color:#4a1f0e;
                    "
                  >
                    Message
                  </h3>

                  <div
                    style="
                      padding:18px;
                      background:#fffaf4;
                      border-left:4px solid #d4a017;
                      border-radius:8px;
                      line-height:1.7;
                      white-space:pre-wrap;
                    "
                  >
                    ${escapeHtml(
                      cleanMessage
                    )}
                  </div>
                </div>

                <div
                  style="
                    margin-top:30px;
                    padding-top:20px;
                    border-top:1px solid #eee;
                    font-size:12px;
                    color:#777;
                  "
                >
                  This inquiry was submitted through
                  the Dear Dad Initiative website.
                </div>

              </div>
            </div>
          </body>
        </html>
      `;

      /* --------------------------------------------------------------------
         PARTICIPANT CONFIRMATION EMAIL
         -------------------------------------------------------------------- */

      const participantHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Thank You - Dear Dad Initiative</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f7f4ef;
              font-family:Arial,Helvetica,sans-serif;
              color:#2e1208;
            "
          >

            <div
              style="
                max-width:680px;
                margin:40px auto;
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <div
                style="
                  background:#4a1f0e;
                  padding:30px;
                  color:white;
                "
              >
                <p
                  style="
                    margin:0 0 8px;
                    font-size:12px;
                    font-weight:bold;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    color:#d4a017;
                  "
                >
                  Dear Dad Initiative
                </p>

                <h1
                  style="
                    margin:0;
                    font-size:28px;
                  "
                >
                  Thank You, ${escapeHtml(
                    cleanName
                  )}!
                </h1>
              </div>

              <div style="padding:32px">

                <p
                  style="
                    font-size:16px;
                    line-height:1.8;
                    color:#5c4436;
                  "
                >
                  Thank you for your interest in
                  supporting the
                  <strong>Dear Dad Initiative</strong>.
                </p>

                <p
                  style="
                    font-size:16px;
                    line-height:1.8;
                    color:#5c4436;
                  "
                >
                  We have received your
                  <strong>${escapeHtml(
                    normalizedType
                  )}</strong>
                  inquiry successfully.
                </p>

                <div
                  style="
                    margin:25px 0;
                    padding:20px;
                    background:#f8f6f2;
                    border-radius:14px;
                  "
                >
                  <p
                    style="
                      margin:0;
                      font-weight:bold;
                      color:#4a1f0e;
                    "
                  >
                    Your inquiry
                  </p>

                  <p
                    style="
                      margin-bottom:0;
                      color:#5c4436;
                    "
                  >
                    ${escapeHtml(
                      cleanSubject
                    )}
                  </p>
                </div>

                <p
                  style="
                    font-size:16px;
                    line-height:1.8;
                    color:#5c4436;
                  "
                >
                  Our team will review your message
                  and contact you shortly with the
                  next steps.
                </p>

                <div
                  style="
                    margin-top:30px;
                    padding:20px;
                    background:#fffaf4;
                    border-radius:12px;
                    border-left:4px solid #d4a017;
                  "
                >
                  <strong>
                    Thank you for helping us make a
                    difference in the lives of children
                    and families.
                  </strong>
                </div>

                <p
                  style="
                    margin-top:30px;
                    font-size:14px;
                    color:#777;
                  "
                >
                  With gratitude,<br />
                  <strong>
                    Dear Dad Initiative Team
                  </strong>
                </p>

              </div>
            </div>
          </body>
        </html>
      `;

      /* --------------------------------------------------------------------
         SEND BOTH EMAILS
         -------------------------------------------------------------------- */

      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          smtpUser,
        to: adminEmail,
        replyTo: cleanEmail,
        subject: `Dear Dad ${normalizedType} Inquiry - ${cleanName}`,
        html: adminHtml,
        text: `
Dear Dad Initiative - New ${normalizedType} Inquiry

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
Participation: ${normalizedType}
Subject: ${cleanSubject}

Message:
${cleanMessage}
        `,
      });

      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          smtpUser,
        to: cleanEmail,
        subject:
          "Thank You for Supporting the Dear Dad Initiative",
        html: participantHtml,
        text: `
Dear ${cleanName},

Thank you for your interest in supporting the Dear Dad Initiative.

We have received your ${normalizedType} inquiry successfully.

Our team will review your message and contact you shortly.

With gratitude,
Dear Dad Initiative Team
        `,
      });

      /* --------------------------------------------------------------------
         SUCCESS
         -------------------------------------------------------------------- */

      return res.status(201).json({
        success: true,
        message:
          "Your inquiry has been submitted successfully. A confirmation email has been sent to you.",
        data: {
          participationType:
            normalizedType,
          name: cleanName,
          email: cleanEmail,
        },
      });
    } catch (error) {
      console.error("");
      console.error(
        "========================================"
      );
      console.error(
        "❌ DEAR DAD INQUIRY ERROR"
      );
      console.error(
        "========================================"
      );
      console.error(error);
      console.error(
        "========================================"
      );

      return res.status(500).json({
        success: false,
        error:
          "We could not submit your inquiry at this time. Please try again later.",
      });
    }
  }
);

/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

router.get(
  "/health",
  async (
    _req: Request,
    res: Response
  ) => {
    res.json({
      success: true,
      service: "Dear Dad Inquiry",
      emailConfigured:
        Boolean(transporter),
    });
  }
);

export default router;