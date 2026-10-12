import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeaders } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxyWithHeaders(process.env.CHAT_SERVICE));
app.use("/api/agent", protect, proxyWithHeaders(process.env.AGENT_SERVICE));
app.use("/api/billing", protect, proxyWithHeaders(process.env.BILLING_SERVICE));
app.get("/api/me", protect, getCurrentUser);
app.get("/", (req, res) => {
  res.send({ message: "Gateway is running" });
});

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
