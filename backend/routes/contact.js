import express from "express";
import Message from "../models/Message.js";
import { transporter } from "../config/mail.js";

const router = express.Router();

// POST /api/contact — contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // Save to database
    const saved = await Message.create({ name, email, phone, subject, message });

    // Send notification email to Ankit
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.TO_EMAIL || "ankit2914978@gmail.com",
        replyTo: email,
        subject: `New Portfolio Message: ${subject} (${name})`,
        text: `You have received a new contact message from your portfolio:

From: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject}

Message:
${message}

---
Sent from ankit-portfolio MERN application
`,
      };

      transporter.sendMail(mailOptions).catch((mailErr) => {
        console.error("Nodemailer contact notice error:", mailErr.message);
      });
    }

    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ error: "Could not send your message. Try again." });
  }
});

export default router;
