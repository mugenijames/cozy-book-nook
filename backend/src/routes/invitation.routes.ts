// backend/src/routes/invitation.routes.ts

import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

/* ==========================================================================
   TYPES
========================================================================== */

interface SpeakingInvitationBody {
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  date?: string;
  location?: string;
  message?: string;

  // Also accept the old backend names for compatibility
  program?: string;
  preferredDate?: string;
}

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
   EMAIL CONFIGURATION
   ==========================================================================

   IMPORTANT:
   Create the transporter INSIDE the request handler.

   This ensures Render environment variables are read when the request
   actually arrives rather than relying on values captured during startup.
========================================================================== */

function createTransporter() {
  const host =
    process.env.SMTP_HOST || "smtp.gmail.com";

  const port =
    Number(process.env.SMTP_PORT || "587");

  const secure =
    String(
      process.env.SMTP_SECURE || "false"
    ).toLowerCase() === "true";

  const user =
    process.env.SMTP_USER;

  const pass =
    process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP_USER or SMTP_PASS is missing."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,

    auth: {
      user,
      pass,
    },
  });
}

/* ==========================================================================
   EMAIL CONFIGURATION CHECK
========================================================================== */

function getEmailConfiguration() {
  const smtpUser =
    process.env.SMTP_USER;

  const smtpPass =
    process.env.SMTP_PASS;

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    smtpUser;

  const smtpFrom =
    process.env.SMTP_FROM ||
    `David Emuria Website <${smtpUser}>`;

  return {
    smtpUser,
    smtpPass,
    adminEmail,
    smtpFrom,
  };
}

/* ==========================================================================
   HEALTH CHECK
   GET /api/invite/health
========================================================================== */

router.get(
  "/health",
  (_req: Request, res: Response) => {
    const config =
      getEmailConfiguration();

    res.json({
      success: true,

      service:
        "David Emuria Speaking Invitation",

      emailConfigured:
        Boolean(
          config.smtpUser &&
          config.smtpPass
        ),

      smtpHost:
        Boolean(
          process.env.SMTP_HOST
        ),

      smtpUser:
        Boolean(
          config.smtpUser
        ),

      smtpPassword:
        Boolean(
          config.smtpPass
        ),

      adminEmail:
        config.adminEmail || null,

      smtpPort:
        Number(
          process.env.SMTP_PORT || "587"
        ),

      smtpSecure:
        String(
          process.env.SMTP_SECURE ||
            "false"
        ).toLowerCase() === "true",
    });
  }
);

/* ==========================================================================
   POST /api/invite
========================================================================== */

router.post(
  "/",
  async (
    req: Request<
      {},
      {},
      SpeakingInvitationBody
    >,
    res: Response
  ) => {
    try {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "🎤 NEW SPEAKING INVITATION"
      );
      console.log(
        "========================================"
      );

      console.log(
        "Request body:",
        req.body
      );

      /* ----------------------------------------------------------------------
         RECEIVE FORM DATA
      ---------------------------------------------------------------------- */

      const {
        name,
        email,
        phone,
        eventType,
        date,
        location,
        message,

        // Compatibility with old field names
        program,
        preferredDate,
      } = req.body;

      /* ----------------------------------------------------------------------
         NORMALIZE FIELD NAMES
      ---------------------------------------------------------------------- */

      const finalEventType =
        eventType ||
        program ||
        "";

      const finalDate =
        date ||
        preferredDate ||
        "";

      /* ----------------------------------------------------------------------
         VALIDATION
      ---------------------------------------------------------------------- */

      if (
        !name ||
        !String(name).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter your name.",
        });
      }

      if (
        !email ||
        !String(email).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter your email address.",
        });
      }

      if (
        !finalEventType ||
        !String(finalEventType).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please select the event type.",
        });
      }

      if (
        !finalDate ||
        !String(finalDate).trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please select the event date.",
        });
      }

      /* ----------------------------------------------------------------------
         EMAIL CONFIGURATION
      ---------------------------------------------------------------------- */

      const {
        smtpUser,
        smtpPass,
        adminEmail,
        smtpFrom,
      } = getEmailConfiguration();

      console.log(
        "📧 SMTP Host:",
        process.env.SMTP_HOST ||
          "smtp.gmail.com"
      );

      console.log(
        "📧 SMTP Port:",
        process.env.SMTP_PORT ||
          "587"
      );

      console.log(
        "📧 SMTP Secure:",
        process.env.SMTP_SECURE ||
          "false"
      );

      console.log(
        "📧 SMTP User:",
        smtpUser
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "📧 SMTP Password:",
        smtpPass
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "📧 Admin Email:",
        adminEmail ||
          "✗ Missing"
      );

      if (
        !smtpUser ||
        !smtpPass
      ) {
        console.error(
          "❌ SMTP configuration is incomplete."
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

      /* ----------------------------------------------------------------------
         CREATE TRANSPORTER
      ---------------------------------------------------------------------- */

      let transporter;

      try {
        transporter =
          createTransporter();

        await transporter.verify();

        console.log(
          "✅ SMTP connection verified."
        );
      } catch (smtpError: any) {
        console.error(
          "❌ SMTP verification failed:"
        );

        console.error(
          smtpError
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is currently unavailable. Please try again later.",
        });
      }

      /* ----------------------------------------------------------------------
         ESCAPE DATA
      ---------------------------------------------------------------------- */

      const safeName =
        escapeHtml(name);

      const safeEmail =
        escapeHtml(email);

      const safePhone =
        escapeHtml(
          phone ||
            "Not provided"
        );

      const safeEventType =
        escapeHtml(
          finalEventType
        );

      const safeDate =
        escapeHtml(
          finalDate
        );

      const safeLocation =
        escapeHtml(
          location ||
            "Not provided"
        );

      const safeMessage =
        escapeHtml(
          message ||
            "No additional message provided."
        );

      /* ======================================================================
         EMAIL 1
         ADMIN NOTIFICATION
      ====================================================================== */

      console.log(
        `📧 Sending speaking invitation to ${adminEmail}`
      );

      await transporter.sendMail({
        from: smtpFrom,

        to: adminEmail,

        replyTo:
          String(email),

        subject:
          `🎤 New Speaking Invitation — ${String(
            name
          )}`,

        html: `
<!DOCTYPE html>

<html>

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

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
        padding:30px;
      "
    >

      <h1
        style="
          margin:0;
          font-size:25px;
        "
      >
        🎤 New Speaking Invitation
      </h1>

      <p
        style="
          margin:10px 0 0;
          color:#f3dfc8;
          font-size:14px;
          line-height:1.6;
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
          margin-top:0;
          color:#3B2314;
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
              width:35%;
              font-weight:bold;
              color:#555;
              border-bottom:1px solid #eeeeee;
            "
          >
            Full Name
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
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
              border-bottom:1px solid #eeeeee;
            "
          >
            Email
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
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
              border-bottom:1px solid #eeeeee;
            "
          >
            Phone
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
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
              border-bottom:1px solid #eeeeee;
            "
          >
            Event Type
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
            "
          >
            ${safeEventType}
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#555;
              border-bottom:1px solid #eeeeee;
            "
          >
            Event Date
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
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
          Message / Event Details
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
          href="mailto:${escapeHtml(
            email
          )}"
          style="
            display:inline-block;
            background:#4A1F0E;
            color:#ffffff;
            text-decoration:none;
            padding:13px 24px;
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
          border-top:1px solid #eeeeee;
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
        Submitted through David Emuria's official website.
      </p>

    </div>

  </div>

</body>

</html>
        `,
      });

      console.log(
        "✅ Admin notification sent."
      );

      /* ======================================================================
         EMAIL 2
         CUSTOMER CONFIRMATION
      ====================================================================== */

      console.log(
        `📧 Sending confirmation to ${email}`
      );

      await transporter.sendMail({
        from: smtpFrom,

        to: String(email),

        subject:
          "✅ We received your speaking invitation",

        html: `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

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
        padding:30px;
      "
    >

      <h1
        style="
          margin:0;
          font-size:25px;
        "
      >
        Thank You, ${safeName}!
      </h1>

      <p
        style="
          margin:10px 0 0;
          color:#f3dfc8;
          line-height:1.6;
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
        Thank you for reaching out to David Emuria
        through the website. We have successfully
        received your speaking invitation.
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
          <strong>Event Type:</strong>
          ${safeEventType}
        </p>

        <p>
          <strong>Event Date:</strong>
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
          border-top:1px solid #eeeeee;
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
        "✅ Customer confirmation sent."
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

      return res.status(200).json({
        success: true,

        message:
          "Speaking invitation submitted successfully.",

        emailNotification: {
          admin: true,
          customer: true,
        },
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
          error?.message ||
          "Failed to send speaking invitation. Please try again later.",
      });
    }
  }
);

/* ==========================================================================
   EXPORT
========================================================================== */

export default router;