import { httpServerHandler } from "cloudflare:node";
import { app } from "./app.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
app.listen(PORT);

export default httpServerHandler({ port: PORT });
