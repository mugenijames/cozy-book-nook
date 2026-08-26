// backend/src/routes/invitation.routes.ts

import { Router, Request, Response } from "express";
import nodemailer, {
  Transporter,
  SendMailOptions,
} from "nodemailer";

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

  // Backward compatibility
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
========================================================================== */

/**
 * Supports BOTH:
 *
 * SMTP_USER / SMTP_PASS
 *
 * and the older:
 *
 * EMAIL_USER / EMAIL_PASS
 *
 * This prevents deployment problems when Render still contains the
 * previous environment variable names.
 */

function getEmailConfiguration() {
  const smtpUser =
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    "";

  const smtpPass =
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    "";

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_ADMIN ||
    smtpUser;

  const smtpHost =
    process.env.SMTP_HOST ||
    "smtp.gmail.com";

  const smtpPort =
    Number(
      process.env.SMTP_PORT || "587"
    );

  const smtpSecure =
    String(
      process.env.SMTP_SECURE || "false"
    ).toLowerCase() === "true";

  const smtpFrom =
    process.env.SMTP_FROM ||
    `David Emuria Website <${smtpUser}>`;

  return {
    smtpUser,
    smtpPass,
    adminEmail,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpFrom,
  };
}

/* ==========================================================================
   CREATE TRANSPORTER
========================================================================== */

function createTransporter(): Transporter {
  const config =
    getEmailConfiguration();

  if (
    !config.smtpUser ||
    !config.smtpPass
  ) {
    throw new Error(
      "SMTP credentials are missing. Please configure SMTP_USER and SMTP_PASS on Render."
    );
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,

    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/* ==========================================================================
   HEALTH CHECK
   GET /api/invite/health
========================================================================== */

router.get(
  "/health",
  async (
    _req: Request,
    res: Response
  ) => {
    const config =
      getEmailConfiguration();

    const configured =
      Boolean(
        config.smtpUser &&
        config.smtpPass
      );

    let smtpVerified = false;
    let smtpError = "";

    /**
     * Only verify SMTP when credentials exist.
     *
     * This makes the endpoint useful for testing Render.
     */

    if (configured) {
      try {
        const transporter =
          createTransporter();

        await transporter.verify();

        smtpVerified = true;
      } catch (error: any) {
        console.error(
          "❌ SMTP health check failed:",
          error
        );

        smtpError =
          error?.message ||
          "SMTP verification failed.";
      }
    }

    return res.status(200).json({
      success: true,

      service:
        "David Emuria Speaking Invitation",

      emailConfigured:
        configured,

      smtpVerified,

      smtpHost:
        config.smtpHost,

      smtpPort:
        config.smtpPort,

      smtpSecure:
        config.smtpSecure,

      smtpUserConfigured:
        Boolean(config.smtpUser),

      smtpPasswordConfigured:
        Boolean(config.smtpPass),

      adminEmail:
        config.adminEmail || null,

      smtpError:
        smtpError || null,
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
        "=========================================="
      );
      console.log(
        "🎤 NEW SPEAKING INVITATION"
      );
      console.log(
        "=========================================="
      );

      console.log(
        "Request received."
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
        program,
        preferredDate,
      } = req.body;

      /* ----------------------------------------------------------------------
         NORMALIZE OLD / NEW FIELD NAMES
      ---------------------------------------------------------------------- */

      const finalEventType =
        String(
          eventType ||
            program ||
            ""
        ).trim();

      const finalDate =
        String(
          date ||
            preferredDate ||
            ""
        ).trim();

      const finalName =
        String(
          name || ""
        ).trim();

      const finalEmail =
        String(
          email || ""
        ).trim();

      const finalPhone =
        String(
          phone || ""
        ).trim();

      const finalLocation =
        String(
          location || ""
        ).trim();

      const finalMessage =
        String(
          message || ""
        ).trim();

      /* ----------------------------------------------------------------------
         VALIDATION
      ---------------------------------------------------------------------- */

      if (!finalName) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter your name.",
        });
      }

      if (!finalEmail) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter your email address.",
        });
      }

      /* Basic email validation */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          finalEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter a valid email address.",
        });
      }

      if (!finalEventType) {
        return res.status(400).json({
          success: false,
          error:
            "Please select the event type.",
        });
      }

      if (!finalDate) {
        return res.status(400).json({
          success: false,
          error:
            "Please select the event date.",
        });
      }

      /* ----------------------------------------------------------------------
         EMAIL CONFIGURATION
      ---------------------------------------------------------------------- */

      const config =
        getEmailConfiguration();

      console.log(
        "📧 SMTP configuration:"
      );

      console.log(
        "Host:",
        config.smtpHost
      );

      console.log(
        "Port:",
        config.smtpPort
      );

      console.log(
        "Secure:",
        config.smtpSecure
      );

      console.log(
        "SMTP user:",
        config.smtpUser
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "SMTP password:",
        config.smtpPass
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "Admin email:",
        config.adminEmail
          ? "✓ Loaded"
          : "✗ Missing"
      );

      if (
        !config.smtpUser ||
        !config.smtpPass
      ) {
        console.error(
          "❌ SMTP credentials are missing."
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is not configured correctly on the server.",
        });
      }

      if (!config.adminEmail) {
        console.error(
          "❌ Administrator email is missing."
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

      let transporter: Transporter;

      try {
        transporter =
          createTransporter();

        console.log(
          "📡 Verifying SMTP connection..."
        );

        await transporter.verify();

        console.log(
          "✅ SMTP connection verified."
        );
      } catch (smtpError: any) {
        console.error("");
        console.error(
          "=========================================="
        );
        console.error(
          "❌ SMTP VERIFICATION FAILED"
        );
        console.error(
          "=========================================="
        );

        console.error(
          "SMTP error code:",
          smtpError?.code
        );

        console.error(
          "SMTP command:",
          smtpError?.command
        );

        console.error(
          "SMTP response code:",
          smtpError?.responseCode
        );

        console.error(
          "SMTP response:",
          smtpError?.response
        );

        console.error(
          "SMTP message:",
          smtpError?.message
        );

        console.error(
          "=========================================="
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is currently unavailable. Please try again later.",

          /**
           * Safe diagnostic information.
           *
           * We NEVER return the SMTP password.
           */

          diagnostics:
            process.env.NODE_ENV ===
            "production"
              ? {
                  code:
                    smtpError?.code ||
                    null,

                  responseCode:
                    smtpError?.responseCode ||
                    null,
                }
              : {
                  code:
                    smtpError?.code ||
                    null,

                  command:
                    smtpError?.command ||
                    null,

                  responseCode:
                    smtpError?.responseCode ||
                    null,

                  response:
                    smtpError?.response ||
                    null,
                },
        });
      }

      /* ----------------------------------------------------------------------
         ESCAPE USER DATA
      ---------------------------------------------------------------------- */

      const safeName =
        escapeHtml(
          finalName
        );

      const safeEmail =
        escapeHtml(
          finalEmail
        );

      const safePhone =
        escapeHtml(
          finalPhone ||
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
          finalLocation ||
            "Not provided"
        );

      const safeMessage =
        escapeHtml(
          finalMessage ||
            "No additional message provided."
        );

      /* ======================================================================
         EMAIL 1 — ADMIN NOTIFICATION
      ====================================================================== */

      console.log(
        `📧 Sending admin notification to ${config.adminEmail}`
      );

      const adminMail: SendMailOptions =
        {
          from: config.smtpFrom,

          to: config.adminEmail,

          replyTo:
            finalEmail,

          subject:
            `🎤 New Speaking Invitation — ${finalName}`,

          html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

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

<div style="padding:30px;">

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
        };

      try {
        await transporter.sendMail(
          adminMail
        );

        console.log(
          "✅ Admin notification sent."
        );
      } catch (adminError: any) {
        console.error(
          "❌ Admin email failed:"
        );

        console.error(
          "Code:",
          adminError?.code
        );

        console.error(
          "Response:",
          adminError?.response
        );

        console.error(
          "Message:",
          adminError?.message
        );

        return res.status(500).json({
          success: false,
          error:
            "We received your request, but the notification email could not be sent. Please try again later.",
        });
      }

      /* ======================================================================
         EMAIL 2 — CUSTOMER CONFIRMATION
      ====================================================================== */

      console.log(
        `📧 Sending confirmation to ${finalEmail}`
      );

      const customerMail: SendMailOptions =
        {
          from: config.smtpFrom,

          to: finalEmail,

          replyTo:
            config.adminEmail,

          subject:
            "✅ We received your speaking invitation",

          html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

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

<div style="padding:30px;">

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

<br>

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
        };

      try {
        await transporter.sendMail(
          customerMail
        );

        console.log(
          "✅ Customer confirmation sent."
        );
      } catch (customerError: any) {
        console.error(
          "❌ Customer confirmation failed:"
        );

        console.error(
          "Code:",
          customerError?.code
        );

        console.error(
          "Response:",
          customerError?.response
        );

        console.error(
          "Message:",
          customerError?.message
        );

        /**
         * Admin email already succeeded.
         *
         * We don't want the whole request to look like the
         * invitation disappeared.
         */

        return res.status(200).json({
          success: true,

          message:
            "Speaking invitation received successfully. However, the confirmation email could not be sent.",

          emailNotification: {
            admin: true,
            customer: false,
          },
        });
      }

      /* ======================================================================
         SUCCESS
      ====================================================================== */

      console.log("");
      console.log(
        "=========================================="
      );

      console.log(
        "🎉 SPEAKING INVITATION COMPLETED"
      );

      console.log(
        "=========================================="
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
        "=========================================="
      );

      console.error(
        "❌ SPEAKING INVITATION ERROR"
      );

      console.error(
        "=========================================="
      );

      console.error(
        "Code:",
        error?.code
      );

      console.error(
        "Command:",
        error?.command
      );

      console.error(
        "Response code:",
        error?.responseCode
      );

      console.error(
        "Response:",
        error?.response
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Stack:",
        error?.stack
      );

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        success: false,

        error:
          "Failed to send speaking invitation. Please try again later.",
      });
    }
  }
);

/* ==========================================================================
   EXPORT
========================================================================== */

export default router;