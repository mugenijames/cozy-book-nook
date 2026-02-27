import express from "express"
import dotenv from "dotenv"
import bookRoutes from "./routes/book.routes"
import cors from "cors";
dotenv.config()



const app = express()
app.use(cors({
    origin: ["http://localhost:8080", "https://emuriadavid.netlify.app"],
    credentials: true
}))
app.use(express.json())

app.use("/books", bookRoutes)

app.get("/", (req, res) => {
    res.send("API running 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})