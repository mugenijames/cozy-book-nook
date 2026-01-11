import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import booksRoutes from "./routes/books.routes";
import ordersRoutes from "./routes/orders.routes";
import paymentsRoutes from "./routes/payments.routes";
import usersRoutes from "./routes/users.routes";
import aiRoutes from "./routes/ai.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Emuria Book Store Backend 🚀" });
});

export default app;
