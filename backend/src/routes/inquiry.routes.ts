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
  bookId?: string;
  bookTitle?: string;
  bookAuthor?: string;
}

/* ==========================================================================
   EMAIL CONFIGURATION
   ========================================================================== */

const smtpHost = process.env.SMTP_HOST?.trim();

const smtpPort = Number(process.env.SMTP_PORT || 587);

const smtpUser = process.env.SMTP_USER?.trim();

const smtpPass = process.env.SMTP_PASS?.trim();

const adminEmail =
  process.env.ADMIN_EMAIL?.trim() ||
  smtpUser ||
  "davidemuria9780@gmail.com";

const smtpSecure =
  process.env.SMTP_SECURE === "true" ||
  smtpPort === 465;

/* ==========================================================================
   SMTP TRANSPORTER
   ========================================================================== */

const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
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

/* --------------------------------------------------------------------------
   NORMALIZE PARTICIPATION TYPE
   -------------------------------------------------------------------------- */

const normalizeParticipationType = (value: string): string => {
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

  if (
    normalized === "book inquiry" ||
    normalized === "book"
  ) {
    return "Book Inquiry";
  }

  return value.trim();
};

/* ==========================================================================
   POST /api/inquiries
   ========================================================================== */

router.post(
  "/",
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        phone,
        participationType,
        subject,
        message,
        bookId,
        bookTitle,
        bookAuthor,
      } = req.body as InquiryBody;

      /* ====================================================================
         VALIDATION
         ==================================================================== */

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

      /* ====================================================================
         EMAIL VALIDATION
         ==================================================================== */

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address.",
        });
      }

      /* ====================================================================
         PARTICIPATION TYPE
         ==================================================================== */

      const requestedType =
        participationType?.trim() || "Book Inquiry";

      const normalizedType =
        normalizeParticipationType(requestedType);

      const allowedTypes = [
        "Donate",
        "Sponsor",
        "Partner",
        "Book Inquiry",
      ];

      if (!allowedTypes.includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          error: "Invalid inquiry type.",
        });
      }

      /* ====================================================================
         CLEAN DATA
         ==================================================================== */

      const cleanName = name.trim();

      const cleanEmail =
        email.trim().toLowerCase();

      const cleanPhone =
        phone?.trim() || "Not provided";

      const cleanBookTitle =
        bookTitle?.trim() || "Not specified";

      const cleanBookAuthor =
        bookAuthor?.trim() || "Not specified";

      const cleanBookId =
        bookId?.trim() || "Not specified";

      const cleanSubject =
        subject?.trim() ||
        `${cleanBookTitle} - ${normalizedType}`;

      const cleanMessage =
        message?.trim() ||
        "No additional message provided.";

      /* ====================================================================
         LOG INQUIRY
         ==================================================================== */

      console.log("");
      console.log("========================================");
      console.log("📨 NEW INQUIRY");
      console.log("========================================");

      console.log("Name:", cleanName);
      console.log("Email:", cleanEmail);
      console.log("Phone:", cleanPhone);
      console.log("Type:", normalizedType);
      console.log("Book:", cleanBookTitle);
      console.log("Author:", cleanBookAuthor);
      console.log("Book ID:", cleanBookId);
      console.log("Subject:", cleanSubject);

      console.log("========================================");

      /* ====================================================================
         CHECK EMAIL CONFIGURATION
         ==================================================================== */

      if (!transporter) {
        console.error(
          "❌ SMTP is not configured."
        );

        console.error({
          smtpHost: Boolean(smtpHost),
          smtpUser: Boolean(smtpUser),
          smtpPass: Boolean(smtpPass),
          adminEmail: Boolean(adminEmail),
        });

        return res.status(500).json({
          success: false,
          error:
            "Email service is not configured on the server. Please contact us directly.",
        });
      }

      /* ====================================================================
         BOOK INFORMATION - ADMIN
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
              <p>
                <strong>Book:</strong>
                ${escapeHtml(cleanBookTitle)}
              </p>

              <p>
                <strong>Author:</strong>
                ${escapeHtml(cleanBookAuthor)}
              </p>

              <p>
                <strong>Book ID:</strong>
                ${escapeHtml(cleanBookId)}
              </p>
            </div>
          `
          : "";

      /* ====================================================================
         ADMIN EMAIL HTML
         ==================================================================== */

      const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Cozy Book Nook Inquiry</title>
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

    <!-- HEADER -->

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
        Cozy Book Nook
      </p>

      <h1
        style="
          margin:0;
          font-size:28px;
        "
      >
        New ${escapeHtml(normalizedType)}
      </h1>
    </div>

    <!-- CONTENT -->

    <div style="padding:32px;">

      <p
        style="
          margin-top:0;
          font-size:16px;
          line-height:1.7;
          color:#5c4436;
        "
      >
        A new inquiry has been submitted through the
        Cozy Book Nook website.
      </p>

      <!-- CUSTOMER -->

      <div
        style="
          margin:25px 0;
          padding:22px;
          background:#f8f6f2;
          border-radius:14px;
        "
      >

        <p>
          <strong>Inquiry Type:</strong>
          ${escapeHtml(normalizedType)}
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

      <!-- BOOK -->

      ${bookInformationHtml}

      <!-- MESSAGE -->

      <div style="margin-top:24px;">

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
          ${escapeHtml(cleanMessage)}
        </div>

      </div>

      <!-- FOOTER -->

      <div
        style="
          margin-top:30px;
          padding-top:20px;
          border-top:1px solid #eee;
          font-size:12px;
          color:#777;
        "
      >
        This inquiry was submitted through the
        Cozy Book Nook website.
      </div>

    </div>
  </div>
</body>
</html>
`;

      /* ====================================================================
         PARTICIPANT BOOK HTML
         ==================================================================== */

      const participantBookHtml =
        normalizedType === "Book Inquiry"
          ? `
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
                Book
              </p>

              <p
                style="
                  margin-bottom:0;
                  color:#5c4436;
                "
              >
                ${escapeHtml(cleanBookTitle)}
              </p>

              ${
                cleanBookAuthor !== "Not specified"
                  ? `
                    <p
                      style="
                        margin-bottom:0;
                        color:#777;
                      "
                    >
                      by ${escapeHtml(cleanBookAuthor)}
                    </p>
                  `
                  : ""
              }

            </div>
          `
          : "";

      /* ====================================================================
         PARTICIPANT EMAIL HTML
         ==================================================================== */

      const participantHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Thank You - Cozy Book Nook</title>
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

    <!-- HEADER -->

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
        Cozy Book Nook
      </p>

      <h1
        style="
          margin:0;
          font-size:28px;
        "
      >
        Thank You, ${escapeHtml(cleanName)}!
      </h1>

    </div>

    <!-- CONTENT -->

    <div style="padding:32px;">

      <p
        style="
          font-size:16px;
          line-height:1.8;
          color:#5c4436;
        "
      >
        Thank you for contacting
        <strong>Cozy Book Nook</strong>.
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.8;
          color:#5c4436;
        "
      >
        We have received your
        <strong>${escapeHtml(normalizedType)}</strong>
        successfully.
      </p>

      ${participantBookHtml}

      <!-- INQUIRY -->

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
          ${escapeHtml(cleanSubject)}
        </p>

      </div>

      <p
        style="
          font-size:16px;
          line-height:1.8;
          color:#5c4436;
        "
      >
        Our team will review your message and contact
        you shortly with the next steps.
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
        <strong>Cozy Book Nook Team</strong>
      </p>

    </div>

  </div>

</body>
</html>
`;

      /* ====================================================================
         SEND ADMIN EMAIL
         ==================================================================== */

      const adminMailResult =
        await transporter.sendMail({
          from:
            process.env.SMTP_FROM?.trim() ||
            smtpUser,

          to: adminEmail,

          replyTo: cleanEmail,

          subject:
            `Cozy Book Nook - ${normalizedType} - ${cleanName}`,

          html: adminHtml,

          text: `
Cozy Book Nook - New ${normalizedType}

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}

Book: ${cleanBookTitle}
Author: ${cleanBookAuthor}
Book ID: ${cleanBookId}

Subject: ${cleanSubject}

Message:
${cleanMessage}
          `,
        });

      console.log(
        "✅ Admin email sent:",
        adminMailResult.messageId
      );

      /* ====================================================================
         SEND CUSTOMER CONFIRMATION
         ==================================================================== */

      const participantMailResult =
        await transporter.sendMail({
          from:
            process.env.SMTP_FROM?.trim() ||
            smtpUser,

          to: cleanEmail,

          replyTo: adminEmail,

          subject:
            "Thank You for Contacting Cozy Book Nook",

          html: participantHtml,

          text: `
Dear ${cleanName},

Thank you for contacting Cozy Book Nook.

We have received your ${normalizedType} successfully.

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

      console.log(
        "✅ Customer confirmation email sent:",
        participantMailResult.messageId
      );

      /* ====================================================================
         SUCCESS
         ==================================================================== */

      return res.status(201).json({
        success: true,

        message:
          "Your inquiry has been submitted successfully. A confirmation email has been sent to you.",

        emailNotifications: {
          admin: true,
          customer: true,
        },

        data: {
          participationType: normalizedType,
          name: cleanName,
          email: cleanEmail,
          bookId: cleanBookId,
          bookTitle: cleanBookTitle,
          bookAuthor: cleanBookAuthor,
        },
      });

    } catch (error) {

      /* ====================================================================
         ERROR
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

    return res.json({
      success: true,

      service:
        "Cozy Book Nook Inquiry",

      emailConfigured:
        Boolean(transporter),

      smtpHost:
        Boolean(smtpHost),

      smtpUser:
        Boolean(smtpUser),

      smtpPassword:
        Boolean(smtpPass),

      adminEmail:
        adminEmail,

      smtpPort:
        smtpPort,

      smtpSecure:
        smtpSecure,
    });
  }
);

export default router;