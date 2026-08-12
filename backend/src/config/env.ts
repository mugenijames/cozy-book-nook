import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

console.log(
  "🔑 OpenAI Key Loaded:",
  process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌"
);