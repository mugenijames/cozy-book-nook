// backend/src/routes/book.routes.ts
import { Router } from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { isAdmin } from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

// Public routes
router.get("/", getBooks);
router.get("/:idOrSlug", getBook);

// Admin CRUD
router.post("/", isAdmin, createBook);
router.put("/:id", isAdmin, updateBook);
router.delete("/:id", isAdmin, deleteBook);

// Generate AI preview from existing PDF
router.post("/:id/generate-preview", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.pdfUrl) return res.status(400).json({ error: "No PDF attached to this book" });

    // Fetch the PDF bytes from Cloudinary
    const pdfRes = await fetch(book.pdfUrl);
    if (!pdfRes.ok) throw new Error("Could not fetch PDF from Cloudinary");
    const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());

    // Extract text
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
    const parsed = await pdfParse(pdfBuffer);
    const rawText = parsed.text?.trim();

    if (!rawText || rawText.length < 100) {
      return res.status(400).json({ error: "PDF text too short to generate preview" });
    }

    const excerpt = rawText.slice(0, 4000);
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{
        role: "user",
        content: `You are a book editor. Based on the following excerpt, write a compelling 4-6 paragraph preview summary that:
- Introduces the main themes and purpose of the book
- Highlights key ideas or lessons a reader will learn
- Uses an engaging, warm tone matching the book's style
- Does NOT include spoilers or full conclusions
- Ends with a sentence that makes the reader want to read more

Book excerpt:
"""
${excerpt}
"""

Write only the preview summary, no headings or labels.`,
      }],
    });

    const block = message.content.find(b => b.type === "text");
    if (!block || block.type !== "text") throw new Error("No text response from AI");

    const aiSummary = block.text.trim();

    await prisma.book.update({
      where: { id },
      data: { aiSummary },
    });

    console.log(`✅ AI preview generated for book ${id}`);
    res.json({ success: true, message: "Preview generated", preview: { aiSummary } });
  } catch (error: any) {
    console.error("Generate preview error:", error);
    res.status(500).json({ error: error.message || "Failed to generate preview" });
  }
});

export default router;