// backend/src/routes/invite.routes.ts
import { Router } from 'express';

const router = Router();

router.post("/invite-david", async (req, res) => {
  const { name, email, phone, eventType, date, location, message } = req.body;

  // Basic validation
  if (!name || !email || !eventType || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // TODO: Send email to David (use Nodemailer, Resend, SendGrid, etc.)
  // Example with console log for now
  console.log("📧 New speaking invite:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`👤 Name: ${name}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📞 Phone: ${phone || 'Not provided'}`);
  console.log(`🎯 Event Type: ${eventType}`);
  console.log(`📅 Date: ${date}`);
  console.log(`📍 Location: ${location || 'Not provided'}`);
  console.log(`💬 Message: ${message || 'Not provided'}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // In real app: send email or save to DB + notify admin dashboard

  res.status(200).json({ message: "Invite sent successfully" });
});

export default router;