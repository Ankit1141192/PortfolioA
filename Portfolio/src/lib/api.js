import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_BASE });

export async function fetchTestimonials() {
  const { data } = await api.get("/testimonials");
  return data;
}

export async function postTestimonial(payload) {
  const { data } = await api.post("/testimonials", payload);
  return data;
}

export async function postContactMessage(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}

export async function fetchBookedSlots(date) {
  const { data } = await api.get(`/schedule/booked-slots?date=${encodeURIComponent(date)}`);
  return data;
}

export async function postScheduleMeeting(payload) {
  const { data } = await api.post("/schedule", payload);
  return data;
}

export async function fetchApplications() {
  const { data } = await api.get("/applications");
  return data;
}

export async function postJobApplication(formData) {
  const { data } = await api.post("/applications/send-email", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/applications/${id}/status`, { status });
  return data;
}

export async function deleteApplication(id) {
  const { data } = await api.delete(`/applications/${id}`);
  return data;
}
