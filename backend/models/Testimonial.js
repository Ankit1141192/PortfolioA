import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    role: { type: String, trim: true, maxlength: 80, default: "" },
    company: { type: String, trim: true, maxlength: 80, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 600 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    relationship: {
      type: String,
      enum: ["client", "collaborator", "recruiter", "mentor", "other"],
      default: "client",
    },
    // Feedback is held for approval before it appears publicly, so the wall
    // can't be spammed. Ankit approves it from the database / an admin flag.
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
