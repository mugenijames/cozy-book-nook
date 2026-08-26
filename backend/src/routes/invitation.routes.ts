// backend/src/routes/invitation.routes.ts

import { Router, Request, Response } from "express";

import {
  sendInviteNotification,
  sendConfirmationEmail,
  isEmailConfigured,
} from "../services/email.service";

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

  // Compatibility with older frontend field names
  program?: string;
  preferredDate?: string;
}

/* ==========================================================================
   HEALTH CHECK
   GET /api/invite/health
========================================================================== */

router.get(
  "/health",
  async (_req: Request, res: Response) => {
    try {
      return res.json({
        success: true,

        service:
          "David Emuria Speaking Invitation",

        emailConfigured:
          isEmailConfigured(),

        provider: "Resend",

        smtpUsed: false,

        message:
          isEmailConfigured()
            ? "Email service is configured."
            : "Email service is not configured.",
      });
    } catch (error) {
      console.error(
        "❌ Invitation health check error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Unable to check email service.",
      });
    }
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
        program,
        preferredDate,
      } = req.body;

      /* ======================================================================
         NORMALIZE OLD + NEW FIELD NAMES
      ====================================================================== */

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
        String(name || "").trim();

      const finalEmail =
        String(email || "")
          .trim()
          .toLowerCase();

      const finalPhone =
        typeof phone === "string"
          ? phone.trim()
          : "";

      const finalLocation =
        typeof location === "string"
          ? location.trim()
          : "";

      const finalMessage =
        typeof message === "string"
          ? message.trim()
          : "";

      /* ======================================================================
         VALIDATION
      ====================================================================== */

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

      if (!emailRegex.test(finalEmail)) {
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

      /* ======================================================================
         CHECK EMAIL CONFIGURATION
      ====================================================================== */

      if (!isEmailConfigured()) {
        console.error(
          "❌ Email service is not configured."
        );

        return res.status(500).json({
          success: false,
          error:
            "Email service is not configured correctly. Please contact the administrator.",
        });
      }

      /* ======================================================================
         NORMALIZED DATA
      ====================================================================== */

      const invitationData = {
        name: finalName,

        email: finalEmail,

        phone:
          finalPhone || undefined,

        eventType:
          finalEventType,

        program:
          finalEventType,

        date:
          finalDate,

        preferredDate:
          finalDate,

        location:
          finalLocation || undefined,

        message:
          finalMessage || undefined,
      };

      /* ======================================================================
         SEND ADMIN EMAIL
      ====================================================================== */

      let adminEmailSent = false;

      try {
        console.log(
          "📧 Sending invitation notification to administrator..."
        );

        await sendInviteNotification(
          invitationData
        );

        adminEmailSent = true;

        console.log(
          "✅ Administrator notification sent."
        );
      } catch (adminError) {
        console.error(
          "❌ Failed to send administrator notification:",
          adminError
        );

        return res.status(500).json({
          success: false,

          error:
            "Your invitation was received, but we could not notify the administrator. Please try again.",

          emailNotification: {
            admin: false,
            customer: false,
          },
        });
      }

      /* ======================================================================
         SEND CUSTOMER CONFIRMATION
      ====================================================================== */

      let customerEmailSent = false;

      try {
        console.log(
          `📧 Sending confirmation to ${finalEmail}...`
        );

        await sendConfirmationEmail(
          invitationData
        );

        customerEmailSent = true;

        console.log(
          "✅ Customer confirmation sent."
        );
      } catch (customerError) {
        console.error(
          "❌ Failed to send customer confirmation:",
          customerError
        );

        /*
         * Admin already received the invitation.
         *
         * Therefore we return success rather than telling
         * the customer that the entire request failed.
         */

        return res.status(200).json({
          success: true,

          message:
            "Your speaking invitation was received successfully. However, the confirmation email could not be sent.",

          emailNotification: {
            admin: adminEmailSent,
            customer: false,
          },
        });
      }

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
          admin: adminEmailSent,

          customer:
            customerEmailSent,
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
          "Failed to submit speaking invitation. Please try again later.",
      });
    }
  }
);

/* ==========================================================================
   EXPORT
========================================================================== */

export default router;