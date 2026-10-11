import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let _transporter = null;

export function getTransporter() {
  if (!_transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("EMAIL_USER or EMAIL_PASS not set. Emails will not be sent.");
    }
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
}

// Lazy proxy so transporter is only instantiated inside a request handler (not in global scope)
export const transporter = new Proxy(
  {},
  {
    get(target, prop) {
      const instance = getTransporter();
      const val = instance[prop];
      if (typeof val === "function") {
        return val.bind(instance);
      }
      return val;
    },
  }
);
