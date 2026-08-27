// backend/src/services/email.service.ts

import { Resend } from "resend";
import nodemailer from "nodemailer";

/* =========================================================
   RESEND CONFIGURATION
========================================================= */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "mugenijames99@gmail.com";

const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "David Emuria Website <onboarding@resend.dev>";

/* =========================================================
   RESEND CLIENT
========================================================= */

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/* =========================================================
   EMAIL CONFIGURATION CHECK
========================================================= */

export const isEmailConfigured = (): boolean => {
  return Boolean(RESEND_API_KEY && ADMIN_EMAIL && RESEND_FROM_EMAIL);
};

/* =========================================================
   EMAIL STATUS
========================================================= */

console.log("");
console.log("========================================");
console.log("📧 EMAIL SERVICE");
console.log("========================================");
console.log("Provider: Resend");
console.log("API Key:", RESEND_API_KEY ? "✓ Loaded" : "✗ Missing");
console.log("From:", RESEND_FROM_EMAIL);
console.log("Admin:", ADMIN_EMAIL);
console.log("Status:", isEmailConfigured() ? "✓ READY" : "✗ NOT CONFIGURED");
console.log("SMTP: ✗ NOT USED");
console.log("========================================");
console.log("");

/* =========================================================
   HELPERS
========================================================= */

const escapeHtml = (value: unknown): string => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* =========================================================
   SEND EMAIL HELPER (with retry)
========================================================= */

const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) => {
  /* ---------- Gmail (testing / any recipient) ---------- */
  if (EMAIL_PROVIDER === "gmail") {
    if (!gmailTransporter) {
      throw new Error(
        "Gmail is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD."
      );
    }

    const info = await gmailTransporter.sendMail({
      from: `"David Emuria" <${GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || GMAIL_USER,
    });

    console.log(
      "✅ Gmail sent successfully:",
      info.messageId,
      `→ ${options.to}`
    );
    return { id: info.messageId };
  }

  /* ---------- Resend (production, after domain verified) ---------- */
  if (!resend) {
    throw new Error(
      "Resend is not configured. Add RESEND_API_KEY or set EMAIL_PROVIDER=gmail."
    );
  }

  const payload = {
    from: RESEND_FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await resend.emails.send(payload);

      if (result.error) {
        console.error(
          `❌ Resend error (attempt ${attempt}/3) → to=${options.to}:`,
          result.error
        );
        lastError = result.error;

        const name = (result.error as { name?: string }).name || "";
        if (name === "validation_error" || name === "invalid_access") {
          break;
        }
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 400 * attempt));
          continue;
        }
      } else {
        console.log(
          "✅ Email sent successfully:",
          result.data?.id || "No ID",
          `→ ${options.to}`
        );
        return result.data;
      }
    } catch (err) {
      console.error(
        `❌ Resend exception (attempt ${attempt}/3) → to=${options.to}:`,
        err
      );
      lastError = err;
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 400 * attempt));
        continue;
      }
    }
  }

  const message =
    lastError &&
    typeof lastError === "object" &&
    "message" in lastError
      ? String((lastError as { message: string }).message)
      : "Failed to send email.";

  throw new Error(message);
};

/* =========================================================
   SPEAKING INVITATION — ADMIN
========================================================= */

export const sendInviteNotification = async (formData: any) => {
  const {
    name,
    email,
    phone,
    program,
    eventType,
    date,
    preferredDate,
    location,
    message,
  } = formData;

  const eventDate = preferredDate || date || "Not provided";
  const programLabel = program || eventType || "Speaking engagement";

  return sendEmail({
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `🎤 New Speaking Invitation from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#3B2314;">
        <div style="background:#4A1F0E;padding:24px;border-radius:12px 12px 0 0;color:white;">
          <h2 style="margin:0;">New Speaking Invitation</h2>
          <p style="margin:8px 0 0;">
            A new speaking request has been submitted from the website.
          </p>
        </div>

        <div style="padding:24px;background:#FAF8F5;border:1px solid #E6DED5;border-top:0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;"><strong>Name:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Email:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Phone:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(phone || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Program:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(programLabel)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Preferred Date:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(eventDate)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Location:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(location || "Not provided")}</td>
            </tr>
          </table>

          <div style="margin-top:24px;">
            <strong>Message:</strong>
            <div style="margin-top:8px;background:white;border:1px solid #E6DED5;padding:16px;border-radius:10px;white-space:pre-wrap;">
              ${escapeHtml(message || "No additional message")}
            </div>
          </div>

          <p style="margin-top:24px;color:#777;font-size:13px;">
            Submitted from the David Emuria website.
          </p>
        </div>
      </div>
    `,
  });
};

/* =========================================================
   SPEAKING INVITATION — CUSTOMER
========================================================= */

export const sendConfirmationEmail = async (formData: any) => {
  const {
    name,
    email,
    program,
    eventType,
    date,
    preferredDate,
  } = formData;

  const eventDate = preferredDate || date || "Not provided";
  const programLabel = program || eventType || "Speaking engagement";

  return sendEmail({
    to: email,
    subject: "✅ We received your speaking invitation",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#3B2314;">
        <div style="background:#4A1F0E;padding:24px;border-radius:12px 12px 0 0;color:white;">
          <h2 style="margin:0;">Thank you, ${escapeHtml(name)}!</h2>
          <p style="margin:8px 0 0;">
            Your speaking invitation has been received successfully.
          </p>
        </div>

        <div style="padding:24px;background:#FAF8F5;border:1px solid #E6DED5;border-top:0;">
          <p>
            Thank you for inviting David Emuria to speak at your event.
          </p>

          <div style="background:#FFF8E1;border:1px solid #D4AF37;padding:16px;border-radius:12px;margin-top:18px;">
            <p><strong>Program:</strong> ${escapeHtml(programLabel)}</p>
            <p><strong>Preferred Date:</strong> ${escapeHtml(eventDate)}</p>
          </div>

          <p style="margin-top:20px;">
            David's team will review your request and get back to you using the contact details you provided.
          </p>

          <p style="margin-top:28px;color:#666;">
            Blessings,<br/>
            <strong>David Emuria's Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};

/* =========================================================
   BOOK INQUIRY — ADMIN
========================================================= */

export const sendInquiryAdminNotification = async (formData: any) => {
  const {
    customerName,
    email,
    phoneNumber,
    bookTitle,
    bookId,
    message,
    notes,
    orderId,
    orderNumber,
  } = formData;

  const inquiryMessage = message || notes || "No message provided";
  const reference = orderNumber || orderId || "Not provided";

  return sendEmail({
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `📚 New Book Inquiry — ${bookTitle || "Book"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#2E1208;">
        <div style="background:#2E1208;color:white;padding:24px;border-radius:12px 12px 0 0;">
          <h2 style="margin:0;">📚 New Book Inquiry</h2>
          <p style="margin:8px 0 0;color:#f5e9df;">
            Someone has submitted a book inquiry from the website.
          </p>
        </div>

        <div style="background:#FAF8F5;padding:24px;border:1px solid #E6DED5;border-top:0;">
          <div style="background:#EEF2F7;padding:16px;border-radius:10px;margin-bottom:20px;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;color:#C17B4F;font-weight:bold;">
              Book
            </p>
            <h3 style="margin:6px 0 0;font-size:20px;">
              ${escapeHtml(bookTitle || "Unknown Book")}
            </h3>
            ${
              bookId
                ? `<p style="margin:6px 0 0;font-size:12px;color:#777;">Book ID: ${escapeHtml(bookId)}</p>`
                : ""
            }
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;"><strong>Customer:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(customerName)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Email:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Phone:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(phoneNumber || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Reference:</strong></td>
              <td style="padding:8px 0;">${escapeHtml(reference)}</td>
            </tr>
          </table>

          <div style="margin-top:20px;">
            <strong>Customer Inquiry:</strong>
            <div style="margin-top:8px;background:white;border:1px solid #E6DED5;border-radius:10px;padding:16px;white-space:pre-wrap;">
              ${escapeHtml(inquiryMessage)}
            </div>
          </div>

          <div style="margin-top:24px;padding:14px;background:#FFF8E1;border-radius:10px;font-size:13px;">
            <strong>Reply to customer:</strong>
            <p style="margin:6px 0 0;">
              Simply reply to this email. The customer's email is configured as the Reply-To address.
            </p>
          </div>

          <p style="margin-top:24px;color:#777;font-size:13px;">
            Submitted from the Cozy Book Nook website.
          </p>
        </div>
      </div>
    `,
  });
};

/* =========================================================
   BOOK INQUIRY — CUSTOMER
========================================================= */

export const sendInquiryCustomerConfirmation = async (formData: any) => {
  const {
    customerName,
    email,
    bookTitle,
    message,
    orderId,
    orderNumber,
  } = formData;

  const inquiryMessage = message || "Your inquiry has been received.";
  const reference = orderNumber || orderId || null;

  return sendEmail({
    to: email,
    subject: `✅ Inquiry Received — ${bookTitle || "Cozy Book Nook"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#2E1208;">
        <div style="background:#2E1208;color:white;padding:24px;border-radius:12px 12px 0 0;">
          <h2 style="margin:0;">Inquiry Received</h2>
          <p style="margin:8px 0 0;color:#f5e9df;">Thank you for contacting us.</p>
        </div>

        <div style="background:#FAF8F5;padding:24px;border:1px solid #E6DED5;border-top:0;">
          <h3>Hello ${escapeHtml(customerName)},</h3>

          <p>We have successfully received your inquiry about:</p>

          <div style="background:#EEF2F7;padding:16px;border-radius:10px;margin:18px 0;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;color:#C17B4F;font-weight:bold;">
              Book
            </p>
            <h3 style="margin:6px 0 0;">${escapeHtml(bookTitle || "Book")}</h3>
          </div>

          <p><strong>Your inquiry:</strong></p>
          <div style="background:white;border:1px solid #E6DED5;border-radius:10px;padding:16px;white-space:pre-wrap;">
            ${escapeHtml(inquiryMessage)}
          </div>

          ${
            reference
              ? `
                <div style="margin-top:20px;background:#F1F5F9;padding:14px;border-radius:10px;">
                  <p style="margin:0;font-size:12px;color:#64748B;">REFERENCE</p>
                  <p style="margin:5px 0 0;font-family:monospace;font-weight:bold;">
                    ${escapeHtml(reference)}
                  </p>
                </div>
              `
              : ""
          }

          <p style="margin-top:24px;line-height:1.6;">
            Our team will review your inquiry and contact you using the details you provided.
          </p>

          <p style="margin-top:24px;color:#666;">
            Thank you for choosing Cozy Book Nook.
          </p>

          <p style="margin-top:20px;color:#666;">
            Kind regards,<br/>
            <strong>Cozy Book Nook Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};

/* =========================================================
   ORDER — ADMIN
========================================================= */

export const sendOrderAdminNotification = async (formData: any) => {
  const {
    customerName,
    email,
    phoneNumber,
    bookTitle,
    amountCents,
    paymentMethod,
    orderType,
    status,
    paymentStatus,
    orderId,
    orderNumber,
    notes,
  } = formData;

  return sendEmail({
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `🛒 New Order — ${bookTitle || "Cozy Book Nook"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;">
        <h2>New Order Received</h2>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phoneNumber || "Not provided")}</p>
        <p><strong>Book:</strong> ${escapeHtml(bookTitle || "Not provided")}</p>
        <p><strong>Order Type:</strong> ${escapeHtml(orderType)}</p>
        <p><strong>Payment Method:</strong> ${escapeHtml(paymentMethod || "Not provided")}</p>
        <p>
          <strong>Amount:</strong>
          ${
            amountCents != null
              ? `KES ${(Number(amountCents) / 100).toFixed(2)}`
              : "Not provided"
          }
        </p>
        <p><strong>Status:</strong> ${escapeHtml(status || "PENDING")}</p>
        <p><strong>Payment Status:</strong> ${escapeHtml(paymentStatus || "UNPAID")}</p>
        <p><strong>Reference:</strong> ${escapeHtml(orderNumber || orderId || "Not provided")}</p>
        ${
          notes
            ? `<p><strong>Notes:</strong><br/>${escapeHtml(notes)}</p>`
            : ""
        }
      </div>
    `,
  });
};

/* =========================================================
   ORDER — CUSTOMER
========================================================= */

export const sendOrderCustomerConfirmation = async (formData: any) => {
  const {
    customerName,
    email,
    bookTitle,
    amountCents,
    orderId,
    orderNumber,
    status,
  } = formData;

  return sendEmail({
    to: email,
    subject: `✅ Order Received — ${bookTitle || "Cozy Book Nook"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;">
        <h2>Thank you, ${escapeHtml(customerName)}!</h2>
        <p>Your order has been received successfully.</p>
        <p><strong>Book:</strong> ${escapeHtml(bookTitle || "Not provided")}</p>
        ${
          amountCents != null
            ? `<p><strong>Amount:</strong> KES ${(Number(amountCents) / 100).toFixed(2)}</p>`
            : ""
        }
        <p><strong>Status:</strong> ${escapeHtml(status || "PENDING")}</p>
        <p><strong>Reference:</strong> ${escapeHtml(orderNumber || orderId || "Not provided")}</p>
        <p>We will process your order and contact you with the next steps.</p>
        <p>
          Kind regards,<br/>
          <strong>Cozy Book Nook Team</strong>
        </p>
      </div>
    `,
  });
};