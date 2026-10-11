import { httpServerHandler } from "cloudflare:node";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

// Attempt database connection on worker cold start
connectDB().catch((err) => {
  console.warn("Cloudflare Worker DB connection warning:", err.message);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
app.listen(PORT);

export default httpServerHandler({ port: PORT });
