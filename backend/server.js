const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// In-memory booked slots: { "2025-10-12": ["09:00 AM", "09:30 AM"] }
const bookedSlots = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to get booked slots for a date
app.get("/booked-slots", (req, res) => {
  const { date } = req.query;
  res.json({ booked: bookedSlots[date] || [] });
});

app.post("/schedule", async (req, res) => {
  try {
    const { name, email, date, time, timezone, purpose, message } = req.body;

    if (!name || !email || !date || !time || !purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the slot is already booked
    bookedSlots[date] = bookedSlots[date] || [];
    if (bookedSlots[date].includes(time)) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // Mark slot as booked
    bookedSlots[date].push(time);

    // Send email to both Ankit and user
    const mailOptions = {
      from: `"Ankit | Meeting Scheduler" <${process.env.EMAIL_USER}>`,
      to: `${process.env.TO_EMAIL}, ${email}`,
      subject: `Meeting Scheduled - ${purpose}`,
      text: `
Hello ${name},

You’ve scheduled a meeting successfully.

-----------------------------------
👤 Name: ${name}
📧 Email: ${email}
📅 Date: ${date}
⏰ Time: ${time} (${timezone})
🎯 Purpose: ${purpose}
💬 Message: ${message || "No additional message provided."}
-----------------------------------

Ankit will also receive this notification.  

Zoom Meeting Link: https://us06web.zoom.us/j/86306880372

Thank you for scheduling a meeting.

Best regards,  
Ankit
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to both:", process.env.TO_EMAIL, email);

    res.json({ success: true, message: "Meeting scheduled successfully!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
