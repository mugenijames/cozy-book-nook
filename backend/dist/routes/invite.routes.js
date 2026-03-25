"use strict";
// backend/src/routes/invite.routes.ts
router.post("/invite-david", async (req, res) => {
    const { name, email, phone, eventType, date, location, message } = req.body;
    // Basic validation
    if (!name || !email || !eventType || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // TODO: Send email to David (use Nodemailer, Resend, SendGrid, etc.)
    // Example with console log for now
    console.log("New speaking invite:", {
        name,
        email,
        phone,
        eventType,
        date,
        location,
        message,
    });
    // In real app: send email or save to DB + notify admin dashboard
    res.status(200).json({ message: "Invite sent successfully" });
});
