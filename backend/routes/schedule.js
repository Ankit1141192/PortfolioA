import express from "express";
import { transporter } from "../config/mail.js";

const router = express.Router();

const bookedSlots = {};
const allSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM"
];

function getNextAvailableSlots(date) {
  const booked = bookedSlots[date] || [];
  return allSlots.filter((slot) => !booked.includes(slot)).slice(0, 3);
}

// GET booked slots for a given date
router.get("/booked-slots", (req, res) => {
  const { date } = req.query;
  res.json({ booked: bookedSlots[date] || [] });
});

// POST book and schedule a meeting
router.post("/", async (req, res) => {
  try {
    const { name, email, date, time, timezone, purpose, message } = req.body;

    if (!name || !email || !date || !time || !purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    bookedSlots[date] = bookedSlots[date] || [];

    if (bookedSlots[date].includes(time)) {
      return res.status(400).json({
        error: "Time slot already booked",
        suggestions: getNextAvailableSlots(date),
      });
    }

    bookedSlots[date].push(time);

    const recipientList = [process.env.TO_EMAIL || "ankit2914978@gmail.com"];
    if (email && !recipientList.includes(email)) {
      recipientList.push(email);
    }

    const mailOptions = {
      from: `"Ankit Kumar | Meeting Scheduler" <${process.env.EMAIL_USER || "ankit2914978@gmail.com"}>`,
      to: recipientList,
      subject: `Meeting Scheduled: ${purpose} (${name})`,
      text: `Hello ${name},

Your meeting has been scheduled and confirmed!

Details:
- Date: ${date}
- Time: ${time} (${timezone || "Asia/Kolkata"})
- Purpose: ${purpose}
- Message: ${message || "No additional message"}

Zoom Link: https://us06web.zoom.us/j/86306880372

Best regards,
Ankit Kumar
Full-Stack & Mobile Developer
+91 8707538123 | ankit2914978@gmail.com
`,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: "Meeting scheduled successfully! Confirmation email sent.",
    });
  } catch (error) {
    console.error("Meeting scheduler email error:", error);
    res.status(500).json({ error: "Failed to send confirmation email. Slot was recorded." });
  }
});

export default router;
