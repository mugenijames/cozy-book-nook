// backend/src/routes/inquiry.routes.ts

import { Router, Request, Response } from "express";
import { Resend } from "resend";

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

  // Book information
  bookId?: string;
  bookTitle?: string;
  bookAuthor?: string;

  // Compatibility with possible older frontend fields
  inquiryType?: string;
  type?: string;
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
   NORMALIZE INQUIRY TYPE
========================================================================== */

function normalizeParticipationType(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (normalized === "donate" || normalized === "donation") {
    return "Donate";
  }

  if (normalized === "sponsor" || normalized === "sponsorship") {
    return "Sponsor";
  }

  if (normalized === "partner" || normalized === "partnership") {
    return "Partner";
  }

  if (
    normalized === "book inquiry" ||
    normalized === "book" ||
    normalized === "book request" ||
    normalized === "hardcopy" ||
    normalized === "hardcopy request"
  ) {
    return "Book Inquiry";
  }

  return value.trim();
}

/* ==========================================================================
   RESEND CONFIGURATION
========================================================================== */

function getResendConfiguration() {
  const apiKey =
    process.env.RESEND_API_KEY?.trim();

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim() ||
    "mugenijames99@gmail.com";

  /*
   * If your domain is not yet verified in Resend,
   * use onboarding@resend.dev.
   *
   * Once your domain is verified, set:
   *
   * RESEND_FROM_EMAIL="Cozy Book Nook <hello@yourdomain.com>"
   */

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Cozy Book Nook <onboarding@resend.dev>";

  return {
    apiKey,
    adminEmail,
    fromEmail,
  };
}

/* ==========================================================================
   HEALTH CHECK
   GET /api/inquiries/health
========================================================================== */

router.get(
  "/health",
  async (_req: Request, res: Response) => {
    const config =
      getResendConfiguration();

    res.json({
      success: true,

      service:
        "Cozy Book Nook Inquiry",

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
   POST /api/inquiries
========================================================================== */

router.post(
  "/",
  async (
    req: Request<{}, {}, InquiryBody>,
    res: Response
  ) => {
    try {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "📨 NEW COZY BOOK NOOK INQUIRY"
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

      /* ====================================================================
         RECEIVE FORM DATA
      ==================================================================== */

      const {
        name,
        email,
        phone,
        participationType,
        inquiryType,
        type,
        subject,
        message,
        bookId,
        bookTitle,
        bookAuthor,
      } = req.body;

      /* ====================================================================
         NORMALIZE INQUIRY TYPE
      ==================================================================== */

      const requestedType =
        participationType ||
        inquiryType ||
        type ||
        "Book Inquiry";

      const normalizedType =
        normalizeParticipationType(
          String(requestedType)
        );

      /* ====================================================================
         VALIDATION
      ==================================================================== */

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

      /* ====================================================================
         EMAIL VALIDATION
      ==================================================================== */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          String(email).trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please provide a valid email address.",
        });
      }

      /* ====================================================================
         ALLOWED TYPES
      ==================================================================== */

      const allowedTypes = [
        "Donate",
        "Sponsor",
        "Partner",
        "Book Inquiry",
      ];

      if (
        !allowedTypes.includes(
          normalizedType
        )
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid inquiry type.",
        });
      }

      /* ====================================================================
         CLEAN DATA
      ==================================================================== */

      const cleanName =
        String(name).trim();

      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();

      const cleanPhone =
        phone &&
        String(phone).trim()
          ? String(phone).trim()
          : "Not provided";

      const cleanBookTitle =
        bookTitle &&
        String(bookTitle).trim()
          ? String(bookTitle).trim()
          : "Not specified";

      const cleanBookAuthor =
        bookAuthor &&
        String(bookAuthor).trim()
          ? String(bookAuthor).trim()
          : "Not specified";

      const cleanBookId =
        bookId &&
        String(bookId).trim()
          ? String(bookId).trim()
          : "Not specified";

      const cleanSubject =
        subject &&
        String(subject).trim()
          ? String(subject).trim()
          : `${cleanBookTitle} - ${normalizedType}`;

      const cleanMessage =
        message &&
        String(message).trim()
          ? String(message).trim()
          : "No additional message provided.";

      /* ====================================================================
         LOG INQUIRY
      ==================================================================== */

      console.log("");
      console.log(
        "📋 INQUIRY DETAILS"
      );
      console.log(
        "Name:",
        cleanName
      );
      console.log(
        "Email:",
        cleanEmail
      );
      console.log(
        "Phone:",
        cleanPhone
      );
      console.log(
        "Type:",
        normalizedType
      );
      console.log(
        "Book:",
        cleanBookTitle
      );
      console.log(
        "Author:",
        cleanBookAuthor
      );
      console.log(
        "Book ID:",
        cleanBookId
      );
      console.log(
        "Subject:",
        cleanSubject
      );

      /* ====================================================================
         RESEND CONFIGURATION
      ==================================================================== */

      const {
        apiKey,
        adminEmail,
        fromEmail,
      } =
        getResendConfiguration();

      console.log("");
      console.log(
        "📧 EMAIL CONFIGURATION"
      );
      console.log(
        "Provider: Resend"
      );
      console.log(
        "Resend API Key:",
        apiKey
          ? "✓ Loaded"
          : "✗ Missing"
      );
      console.log(
        "Admin Email:",
        adminEmail
      );
      console.log(
        "From Email:",
        fromEmail
      );

      /* ====================================================================
         CHECK RESEND API KEY
      ==================================================================== */

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

      /* ====================================================================
         CREATE RESEND CLIENT
      ==================================================================== */

      const resend =
        new Resend(apiKey);

      /* ====================================================================
         ESCAPE DATA
      ==================================================================== */

      const safeName =
        escapeHtml(cleanName);

      const safeEmail =
        escapeHtml(cleanEmail);

      const safePhone =
        escapeHtml(cleanPhone);

      const safeType =
        escapeHtml(normalizedType);

      const safeSubject =
        escapeHtml(cleanSubject);

      const safeBookTitle =
        escapeHtml(cleanBookTitle);

      const safeBookAuthor =
        escapeHtml(cleanBookAuthor);

      const safeBookId =
        escapeHtml(cleanBookId);

      const safeMessage =
        escapeHtml(cleanMessage);

      /* ====================================================================
         BOOK INFORMATION
      ==================================================================== */

      const bookInformationHtml =
        normalizedType === "Book Inquiry"
          ? `
            <div
              style="
                margin:25px 0;
                padding:22px;
                background:#f8f6f2;
                border-radius:14px;
              "
            >

              <h3
                style="
                  margin-top:0;
                  color:#4A1F0E;
                "
              >
                📚 Book Information
              </h3>

              <p>
                <strong>Book:</strong>
                ${safeBookTitle}
              </p>

              <p>
                <strong>Author:</strong>
                ${safeBookAuthor}
              </p>

              <p>
                <strong>Book ID:</strong>
                ${safeBookId}
              </p>

            </div>
          `
          : "";

      /* ====================================================================
         ADMIN EMAIL
      ==================================================================== */

      console.log("");
      console.log(
        `📧 Sending admin notification to ${adminEmail}`
      );

      const adminEmailResult =
        await resend.emails.send({
          from: fromEmail,

          to: [adminEmail],

          replyTo: cleanEmail,

          subject:
            `📚 New ${normalizedType} — ${cleanName}`,

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
    New Cozy Book Nook Inquiry
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
      max-width:680px;
      margin:30px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 5px 25px rgba(0,0,0,0.08);
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

      <p
        style="
          margin:0 0 8px;
          color:#D4A017;
          font-size:12px;
          font-weight:bold;
          letter-spacing:2px;
          text-transform:uppercase;
        "
      >
        Cozy Book Nook
      </p>

      <h1
        style="
          margin:0;
          font-size:27px;
        "
      >
        📚 New ${safeType}
      </h1>

      <p
        style="
          margin:10px 0 0;
          color:#f3dfc8;
          font-size:14px;
          line-height:1.6;
        "
      >
        A new inquiry has been submitted
        through the Cozy Book Nook website.
      </p>

    </div>

    <!-- CONTENT -->

    <div
      style="
        padding:32px;
      "
    >

      <h2
        style="
          margin-top:0;
          color:#3B2314;
        "
      >
        Inquiry Details
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
            Inquiry Type
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
            "
          >
            ${safeType}
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
            Subject
          </td>

          <td
            style="
              border-bottom:1px solid #eeeeee;
            "
          >
            ${safeSubject}
          </td>

        </tr>

      </table>

      ${bookInformationHtml}

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
          href="mailto:${escapeHtml(cleanEmail)}"
          style="
            display:inline-block;
            background:#4A1F0E;
            color:#ffffff;
            text-decoration:none;
            padding:13px 25px;
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
        Submitted through the Cozy Book Nook website.
      </p>

    </div>

  </div>

</body>

</html>
          `,

          text: `
Cozy Book Nook - New ${normalizedType}

Name: ${cleanName}

Email: ${cleanEmail}

Phone: ${cleanPhone}

Inquiry Type: ${normalizedType}

Subject: ${cleanSubject}

Book: ${cleanBookTitle}

Author: ${cleanBookAuthor}

Book ID: ${cleanBookId}

Message:

${cleanMessage}
          `,
        });

      /* ====================================================================
         HANDLE ADMIN EMAIL ERROR
      ==================================================================== */

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

      /* ====================================================================
         CUSTOMER CONFIRMATION EMAIL
      ==================================================================== */

      console.log("");
      console.log(
        `📧 Sending customer confirmation to ${cleanEmail}`
      );

      const customerBookHtml =
        normalizedType === "Book Inquiry"
          ? `
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
                📚 Your Book Request
              </h2>

              <p>
                <strong>Book:</strong>
                ${safeBookTitle}
              </p>

              <p>
                <strong>Author:</strong>
                ${safeBookAuthor}
              </p>

            </div>
          `
          : "";

      const customerEmailResult =
        await resend.emails.send({
          from: fromEmail,

          to: [cleanEmail],

          replyTo: adminEmail,

          subject:
            "✅ We received your Cozy Book Nook inquiry",

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
    Cozy Book Nook
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
      max-width:680px;
      margin:30px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 5px 25px rgba(0,0,0,0.08);
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

      <p
        style="
          margin:0 0 8px;
          color:#D4A017;
          font-size:12px;
          font-weight:bold;
          letter-spacing:2px;
          text-transform:uppercase;
        "
      >
        Cozy Book Nook
      </p>

      <h1
        style="
          margin:0;
          font-size:27px;
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
        We have received your inquiry.
      </p>

    </div>

    <!-- CONTENT -->

    <div
      style="
        padding:32px;
      "
    >

      <p
        style="
          font-size:16px;
          line-height:1.8;
          color:#555;
        "
      >
        Thank you for contacting
        <strong>Cozy Book Nook</strong>.
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.8;
          color:#555;
        "
      >
        Your
        <strong>${safeType}</strong>
        has been received successfully.
      </p>

      ${customerBookHtml}

      <!-- INQUIRY SUMMARY -->

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
          Your Inquiry
        </h2>

        <p
          style="
            color:#555;
            line-height:1.6;
          "
        >
          ${safeSubject}
        </p>

      </div>

      <p
        style="
          margin-top:25px;
          font-size:16px;
          line-height:1.8;
          color:#555;
        "
      >
        Our team will review your message
        and contact you shortly with the next steps.
      </p>

      <div
        style="
          margin-top:30px;
          padding:20px;
          background:#fffaf4;
          border-left:4px solid #C08A43;
          border-radius:10px;
        "
      >

        <strong
          style="
            color:#3B2314;
          "
        >
          Thank you for choosing Cozy Book Nook.
        </strong>

      </div>

      <p
        style="
          margin-top:30px;
          font-size:14px;
          color:#777;
        "
      >

        With gratitude,

        <br />

        <strong>
          Cozy Book Nook Team
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
        from the Cozy Book Nook website.
      </p>

    </div>

  </div>

</body>

</html>
          `,

          text: `
Dear ${cleanName},

Thank you for contacting Cozy Book Nook.

We have received your ${normalizedType} successfully.

Subject:
${cleanSubject}

${
  normalizedType === "Book Inquiry"
    ? `
Book:
${cleanBookTitle}

Author:
${cleanBookAuthor}
`
    : ""
}

Our team will review your message and contact you shortly.

With gratitude,

Cozy Book Nook Team
          `,
        });

      /* ====================================================================
         HANDLE CUSTOMER EMAIL ERROR
      ==================================================================== */

      if (customerEmailResult.error) {
        console.error(
          "❌ Resend customer email error:",
          customerEmailResult.error
        );

        /*
         * ADMIN EMAIL WAS ALREADY SENT.
         *
         * Therefore the inquiry itself succeeded.
         */

        return res.status(200).json({
          success: true,

          message:
            "Your inquiry was received successfully, but we could not send the confirmation email.",

          emailNotifications: {
            admin: true,
            customer: false,
          },

          customerEmailError:
            customerEmailResult.error.message ||
            "Resend failed to send the confirmation email.",
        });
      }

      /* ====================================================================
         SUCCESS
      ==================================================================== */

      console.log(
        "✅ Customer confirmation sent."
      );

      console.log(
        "📨 Customer email ID:",
        customerEmailResult.data?.id ||
          "No ID returned"
      );

      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "🎉 INQUIRY COMPLETED SUCCESSFULLY"
      );
      console.log(
        "========================================"
      );

      return res.status(201).json({
        success: true,

        message:
          "Your inquiry has been submitted successfully. A confirmation email has been sent to you.",

        emailNotifications: {
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

        data: {
          participationType:
            normalizedType,

          name:
            cleanName,

          email:
            cleanEmail,

          bookId:
            cleanBookId,

          bookTitle:
            cleanBookTitle,

          bookAuthor:
            cleanBookAuthor,
        },
      });

    } catch (error: any) {
      /* ====================================================================
         GENERAL ERROR
      ==================================================================== */

      console.error("");
      console.error(
        "========================================"
      );
      console.error(
        "❌ INQUIRY SUBMISSION ERROR"
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
          "We could not submit your inquiry at this time. Please try again later.",
      });
    }
  }
);

/* ==========================================================================
   EXPORT
========================================================================== */

export default router;