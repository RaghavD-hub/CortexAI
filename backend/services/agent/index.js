import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const PORT = process.env.PORT || 8001;
const app = express();
app.use(express.json());
app.use("/", router);

app.use((err, req, res, next) => {
  console.log(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({ message: `agent error ${error}` });
});

app.get("/", (req, res) => {
  res.send({ message: "Hello from agent" });
});

app.listen(PORT, () => {
  console.log(`Agent is running on port ${PORT}`);
  connectDb();
});
