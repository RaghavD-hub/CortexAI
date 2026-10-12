import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/auth.route.js"
dotenv.config()

const PORT = process.env.PORT || 8001
const app = express()
app.use(express.json())

app.use("/", router)
app.get("/", (req, res) => {
    res.send({ message: "Hello from auth" })
})


app.listen(PORT, () => {
    console.log(`Auth is running on port ${PORT}`)
    connectDb()
})


