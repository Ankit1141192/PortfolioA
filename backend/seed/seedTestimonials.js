import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Testimonial from "../models/Testimonial.js";
import mongoose from "mongoose";

dotenv.config();

const sample = [
  {
    name: "Priya Sharma",
    role: "Founder",
    company: "Homorax",
    message:
      "Ankit shipped our e-commerce storefront ahead of schedule and kept explaining trade-offs in plain language. Checkout and search feel instant now.",
    rating: 5,
    relationship: "client",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    company: "Jeevaloop",
    message:
      "Handed him a rough hospital-ops spec and he came back with a role-based dashboard that our clinicians actually enjoy using.",
    rating: 5,
    relationship: "client",
  },
  {
    name: "Meera Nair",
    role: "Hiring Manager",
    company: "Masai School",
    message:
      "Ankit was one of the sharpest debuggers in the cohort — calm under pressure and great at breaking problems into small, testable pieces.",
    rating: 5,
    relationship: "mentor",
  },
];

async function run() {
  await connectDB();
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(sample);
  console.log(`Seeded ${sample.length} testimonials.`);
  await mongoose.disconnect();
}

run();
