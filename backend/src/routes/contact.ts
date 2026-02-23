router.post("/contact", async (req, res) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: req.body.email,
    to: process.env.EMAIL,
    subject: "Website Inquiry",
    text: req.body.message,
  });

  res.json({ message: "Email sent" });
});