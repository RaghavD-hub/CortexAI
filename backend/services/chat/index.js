import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
dotenv.config();
import router from "./routes/chat.routes.js";

const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json());

app.use("/", router);
app.get("/", (req, res) => {
  res.send({ message: "Hello from chat" });
});

app.listen(PORT, () => {
  console.log(`Chat is running on port ${PORT}`);
  connectDb();
});
