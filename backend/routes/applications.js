import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Application from "../models/Application.js";
import { transporter } from "../config/mail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/applications/send-email (Process job application and send cover letter email)
router.post("/send-email", upload.single("resume"), async (req, res) => {
  const {
    applicantEmail,
    hrEmail,
    hrPhone,
    position,
    message,
    companyName,
    source,
    jobUrl,
    applicationType = "Email",
  } = req.body;

  const resume = req.file;

  if (!position || !message) {
    return res.status(400).json({ error: "Missing required position or message fields." });
  }

  if (applicationType === "Email" && (!applicantEmail || !hrEmail)) {
    return res.status(400).json({ error: "Applicant and HR emails are required for Email applications." });
  }

  if (applicationType === "WhatsApp" && !hrPhone) {
    return res.status(400).json({ error: "HR phone number is required for WhatsApp applications." });
  }

  try {
    let resumeUrl = "https://drive.google.com/uc?export=download&id=1u12VQo7UlR_64m9-lU0Zc4DbgASlWDQS";
    let resumeName = "Ankit Portfolio Resume (Google Drive)";

    if (resume) {
      const fileExt = path.extname(resume.originalname);
      const uniqueFilename = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

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
      hrEmail: applicationType === "Email" ? hrEmail : undefined,
      hrPhone: applicationType === "WhatsApp" ? hrPhone : undefined,
      applicantEmail: applicationType === "Email" ? applicantEmail : undefined,
      position,
      message,
      resumeName,
      resumeUrl,
      applicationType,
      status: "Applied",
    });

    const savedApp = await newApplication.save();

    // 2. If it's Email, send the email via Nodemailer
    if (applicationType === "Email" && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: `"${position} Applicant" <${process.env.EMAIL_USER}>`,
        to: hrEmail,
        replyTo: applicantEmail,
        subject: `Job Application: ${position} - ${applicantEmail}`,
        text: message,
        attachments: [
          {
            filename: resumeName,
            ...(resume ? { content: resume.buffer } : { path: resumeUrl }),
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      message: "Application processed and saved successfully!",
      application: savedApp,
      resumeUrl,
    });
  } catch (error) {
    console.error("Error sending application email:", error);
    res.status(500).json({ error: "Failed to process application. Please check server logs." });
  }
});

// GET /api/applications (Fetch all applications)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedDate: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

// PATCH /api/applications/:id/status (Update application status)
router.patch("/:id/status", async (req, res) => {
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

// DELETE /api/applications/:id (Delete application)
router.delete("/:id", async (req, res) => {
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

export default router;
