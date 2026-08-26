// backend/src/routes/invitation.routes.ts

import { Router, Request, Response } from "express";
import { Resend } from "resend";

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

  // Compatibility with older frontend/backend field names
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
   RESEND CONFIGURATION
========================================================================== */

function getResendConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;

  const adminEmail =
    process.env.ADMIN_EMAIL ||
    "mugenijames99@gmail.com";

  /*
   * IMPORTANT:
   *
   * If you have NOT verified your own domain in Resend,
   * use:
   *
   * onboarding@resend.dev
   *
   * for testing.
   *
   * Once your domain is verified in Resend, change
   * RESEND_FROM_EMAIL in Render to something like:
   *
   * David Emuria <hello@yourdomain.com>
   */

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "David Emuria Website <onboarding@resend.dev>";

  return {
    apiKey,
    adminEmail,
    fromEmail,
  };
}

/* ==========================================================================
   HEALTH CHECK
   GET /api/invite/health
========================================================================== */

router.get(
  "/health",
  async (_req: Request, res: Response) => {
    const config =
      getResendConfiguration();

    res.json({
      success: true,

      service:
        "David Emuria Speaking Invitation",

      emailConfigured:
        Boolean(config.apiKey),

      resendConfigured:
        Boolean(config.apiKey),

      adminEmail:
        config.adminEmail,

      fromEmail:
        config.fromEmail,

      provider:
        "Resend",

      smtpUsed:
        false,
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
        "📨 Request received."
      );

      console.log(
        "📨 Request body:",
        req.body
      );

      /* ======================================================================
         RECEIVE FORM DATA
      ====================================================================== */

      const {
        name,
        email,
        phone,
        eventType,
        date,
        location,
        message,

        // Old field names
        program,
        preferredDate,
      } = req.body;

      /* ======================================================================
         NORMALIZE FIELD NAMES
      ====================================================================== */

      const finalEventType =
        eventType ||
        program ||
        "";

      const finalDate =
        date ||
        preferredDate ||
        "";

      /* ======================================================================
         VALIDATION
      ====================================================================== */

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

      /* ======================================================================
         RESEND CONFIGURATION
      ====================================================================== */

      const {
        apiKey,
        adminEmail,
        fromEmail,
      } = getResendConfiguration();

      console.log(
        "📧 Email provider: Resend"
      );

      console.log(
        "📧 Resend API Key:",
        apiKey
          ? "✓ Loaded"
          : "✗ Missing"
      );

      console.log(
        "📧 Admin Email:",
        adminEmail ||
          "✗ Missing"
      );

      console.log(
        "📧 From Email:",
        fromEmail
      );

      /* ======================================================================
         CHECK RESEND API KEY
      ====================================================================== */

      if (!apiKey) {
        console.error(
          "❌ RESEND_API_KEY is missing."
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is not configured correctly. RESEND_API_KEY is missing.",
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

      /* ======================================================================
         CREATE RESEND CLIENT
      ====================================================================== */

      const resend =
        new Resend(apiKey);

      /* ======================================================================
         ESCAPE USER DATA
      ====================================================================== */

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
        `📧 Sending admin notification to ${adminEmail}`
      );

      const adminEmailResult =
        await resend.emails.send({
          from: fromEmail,

          to: [adminEmail],

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

      /* ======================================================================
         HANDLE ADMIN EMAIL ERROR
      ====================================================================== */

      if (adminEmailResult.error) {
        console.error(
          "❌ Resend admin email error:",
          adminEmailResult.error
        );

        return res.status(500).json({
          success: false,
          error:
            "Failed to send administrator notification.",
          details:
            adminEmailResult.error.message ||
            "Resend failed to send the email.",
        });
      }

      console.log(
        "✅ Admin notification sent."
      );

      console.log(
        "📨 Admin email ID:",
        adminEmailResult.data?.id ||
          "No ID returned"
      );

      /* ======================================================================
         EMAIL 2
         CUSTOMER CONFIRMATION
      ====================================================================== */

      console.log(
        `📧 Sending confirmation to ${email}`
      );

      const customerEmailResult =
        await resend.emails.send({
          from: fromEmail,

          to: [String(email)],

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

      /* ======================================================================
         HANDLE CUSTOMER EMAIL ERROR
      ====================================================================== */

      if (customerEmailResult.error) {
        console.error(
          "❌ Resend customer email error:",
          customerEmailResult.error
        );

        /*
         * The admin email was already sent successfully.
         *
         * We don't want to tell the frontend that the entire
         * request failed when the administrator has already
         * received the invitation.
         */

        return res.status(200).json({
          success: true,

          message:
            "Speaking invitation received, but the confirmation email could not be sent.",

          emailNotification: {
            admin: true,
            customer: false,
          },

          customerEmailError:
            customerEmailResult.error.message ||
            "Resend failed to send the confirmation email.",
        });
      }

      console.log(
        "✅ Customer confirmation sent."
      );

      console.log(
        "📨 Customer email ID:",
        customerEmailResult.data?.id ||
          "No ID returned"
      );

      /* ======================================================================
         SUCCESS
      ====================================================================== */

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

        emailIds: {
          admin:
            adminEmailResult.data?.id ||
            null,

          customer:
            customerEmailResult.data?.id ||
            null,
        },
      });

    } catch (error: any) {
      /* ======================================================================
         GENERAL ERROR
      ====================================================================== */

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