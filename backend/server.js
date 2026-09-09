import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import testimonialRoutes from "./routes/testimonials.js";
import contactRoutes from "./routes/contact.js";
import scheduleRoutes from "./routes/schedule.js";
import applicationRoutes from "./routes/applications.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      try {
        const url = new URL(origin);
        const match = allowedOrigins.some((ao) => {
          try {
            return new URL(ao).hostname === url.hostname;
          } catch {
            return ao.includes(url.hostname);
          }
        });
        if (match || url.hostname === "localhost" || url.hostname === "127.0.0.1") {
          return callback(null, true);
        }
      } catch (e) {
        // Fallback
      }
      return callback(null, true); // Permissive fallback for seamless local & deployed usage
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads for resumes/attachments
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Basic abuse protection on write endpoints
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please try again later." },
});

app.use("/api/testimonials", (req, res, next) =>
  req.method === "POST" ? writeLimiter(req, res, next) : next()
);
app.use("/api/contact", writeLimiter);
app.use("/api/schedule", (req, res, next) =>
  req.method === "POST" ? writeLimiter(req, res, next) : next()
);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "ankit-portfolio-api" }));
app.get("/", (req, res) => res.send("Ankit Portfolio MERN API is running."));

// Core API routes
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/applications", applicationRoutes);

// Compatibility aliases for legacy/PortfolioA endpoints
app.use("/schedule", scheduleRoutes);
app.use("/booked-slots", (req, res) => {
  res.redirect(307, `/api/schedule/booked-slots?date=${req.query.date || ""}`);
});
app.use("/api/booked-slots", (req, res) => {
  res.redirect(307, `/api/schedule/booked-slots?date=${req.query.date || ""}`);
});
app.use("/api/send-email", (req, res, next) => {
  req.url = "/send-email";
  applicationRoutes(req, res, next);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
