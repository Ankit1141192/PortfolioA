const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Application = require("./models/Application");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ==========================================
// Scheduler Routes (Original Portfolio)
// ==========================================

const bookedSlots = {};
const allSlots = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM"
];

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

transporter.verify((err) => {
  if (err) console.log("SMTP Error:", err);
  else console.log("SMTP Connected Successfully");
});

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

    bookedSlots[date] = bookedSlots[date] || [];

    if (bookedSlots[date].includes(time)) {
      return res.status(400).json({
        error: "Time slot already booked",
        suggestions: getNextAvailableSlots(date)
      });
    }

    bookedSlots[date].push(time);

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

// ==========================================
// Job Application Routes (Merged)
// ==========================================

// Route to process application (Email cover letter or WhatsApp metadata generation)
app.post("/api/send-email", upload.single("resume"), async (req, res) => {
  const { 
    applicantEmail, 
    hrEmail, 
    hrPhone, 
    position, 
    message, 
    companyName, 
    source, 
    jobUrl, 
    applicationType = "Email" 
  } = req.body;
  
  const resume = req.file;

  if (!position || !message) {
    return res.status(400).json({ error: "Missing required position or message fields." });
  }

  if (applicationType === 'Email' && (!applicantEmail || !hrEmail || !resume)) {
    return res.status(400).json({ error: "Applicant/HR emails and resume file are required for Email applications." });
  }

  if (applicationType === 'WhatsApp' && !hrPhone) {
    return res.status(400).json({ error: "HR phone number is required for WhatsApp applications." });
  }

  try {
    let resumeUrl = "https://drive.google.com/uc?export=download&id=1u12VQo7UlR_64m9-lU0Zc4DbgASlWDQS";
    let resumeName = "Ankit Portfolio Resume (Google Drive)";

    if (resume) {
      // Save file to static uploads folder
      const fileExt = path.extname(resume.originalname);
      const uniqueFilename = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      
      // Write buffer to uploads folder
      fs.writeFileSync(filePath, resume.buffer);
      
      const serverUrl = `${req.protocol}://${req.get("host")}`;
      resumeUrl = `${serverUrl}/uploads/${uniqueFilename}`;
      resumeName = resume.originalname;
    }

    // 1. Save to MongoDB
    const newApplication = new Application({
      companyName,
      source,
      jobUrl,
      hrEmail: applicationType === 'Email' ? hrEmail : undefined,
      hrPhone: applicationType === 'WhatsApp' ? hrPhone : undefined,
      applicantEmail: applicationType === 'Email' ? applicantEmail : undefined,
      position,
      message,
      resumeName,
      resumeUrl,
      applicationType,
      status: "Applied"
    });
    
    const savedApp = await newApplication.save();

    // 2. If it's Email, send the email
    if (applicationType === "Email") {
      const mailOptions = {
        from: `"${position} Applicant" <${process.env.EMAIL_USER}>`,
        to: hrEmail,
        replyTo: applicantEmail,
        subject: `Job Application: ${position} - ${applicantEmail}`,
        text: message,
        attachments: [
          {
            filename: resume.originalname,
            content: resume.buffer,
          },
        ],
      };

      // Send email
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ 
      message: "Application processed and saved successfully!",
      application: savedApp,
      resumeUrl
    });
  } catch (error) {
    console.error("Error sending application email:", error);
    res.status(500).json({ error: "Failed to send application. Please check server logs." });
  }
});

// Route to fetch all applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedDate: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

// Route to update application status
app.patch("/api/applications/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.status(200).json(updatedApp);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status." });
  }
});

// Route to delete an application
app.delete("/api/applications/:id", async (req, res) => {
  try {
    const deletedApp = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApp) {
      return res.status(404).json({ error: "Application not found." });
    }
    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Failed to delete application." });
  }
});

// Default status endpoint
app.get("/", (req, res) => {
  res.send("Unified Portfolio and Job Application Server is running.");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
