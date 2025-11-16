const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const bookedSlots = {};

const allSlots = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM"
];

// Suggest next available time slots
function getNextAvailableSlots(date) {
  const booked = bookedSlots[date] || [];

  return allSlots.filter(slot => !booked.includes(slot)).slice(0, 3);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email login
transporter.verify((err) => {
  if (err) console.log("SMTP Error:", err);
  else console.log("SMTP Connected Successfully");
});

// Fetch bookings for a date
app.get("/booked-slots", (req, res) => {
  const { date } = req.query;
  res.json({ booked: bookedSlots[date] || [] });
});

// Schedule a meeting
app.post("/schedule", async (req, res) => {
  try {
    const { name, email, date, time, timezone, purpose, message } = req.body;

    if (!name || !email || !date || !time || !purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    bookedSlots[date] = bookedSlots[date] || [];

    // If duplicate booking
    if (bookedSlots[date].includes(time)) {
      return res.status(400).json({
        error: "Time slot already booked",
        suggestions: getNextAvailableSlots(date)
      });
    }

    // Store booking
    bookedSlots[date].push(time);

    // Email
    const mailOptions = {
      from: `"Ankit | Meeting Scheduler" <${process.env.EMAIL_USER}>`,
      to: [process.env.TO_EMAIL, email],
      subject: `Meeting Scheduled - ${purpose}`,
      text: `
Hello ${name},

Your meeting is confirmed.

Date: ${date}
Time: ${time} (${timezone})
Purpose: ${purpose}

Message: ${message || "No message"}

Zoom Link: https://us06web.zoom.us/j/86306880372

Regards,
Ankit
`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Meeting scheduled successfully!"
    });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
