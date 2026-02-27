import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:8080", "https://emuriadavid.netlify.app"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("API running 🚀");
});

// Database Health Check (Recommended)
app.get("/health", async (req, res) => {
    try {
        // Simple Prisma query to ensure DB is connected
        // const bookCount = await prisma.book.count(); 
        res.status(200).json({ status: "ok", message: "Database connected" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database connection failed" });
    }
});

// Local Development Logic
const PORT = process.env.PORT || 5000;

// Only run app.listen locally. 
// Vercel will ignore this block and use the export instead.
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Crucial: Vercel needs the default export to handle the serverless function
export default app;