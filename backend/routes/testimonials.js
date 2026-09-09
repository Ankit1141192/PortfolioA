import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// GET /api/testimonials — public feedback wall (newest first)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({
      createdAt: -1,
    });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Could not load testimonials." });
  }
});

// POST /api/testimonials — visitor submits feedback
router.post("/", async (req, res) => {
  try {
    const { name, role, company, message, rating, relationship } = req.body;

    if (!name || !message || !rating) {
      return res
        .status(400)
        .json({ error: "Name, message, and rating are required." });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      company,
      message,
      rating,
      relationship,
    });

    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ error: "Could not save your feedback." });
  }
});

export default router;
