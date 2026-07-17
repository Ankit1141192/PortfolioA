const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: false,
    trim: true
  },
  source: {
    type: String,
    required: false,
    trim: true
  },
  jobUrl: {
    type: String,
    trim: true
  },
  hrEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },
  hrPhone: {
    type: String,
    required: false,
    trim: true
  },
  applicantEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  resumeName: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  applicationType: {
    type: String,
    default: 'Email' // 'Email' | 'WhatsApp'
  },
  status: {
    type: String,
    default: 'Applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
