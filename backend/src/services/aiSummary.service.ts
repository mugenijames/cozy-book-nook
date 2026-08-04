import OpenAI from "openai";
import axios from "axios";
import * as pdfParse from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBookSummary(pdfUrl: string): Promise<string> {
  try {
    console.log("📥 Downloading PDF...");

    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = Buffer.from(response.data);

    console.log("📖 Extracting text...");

    const pdf = await pdfParse(pdfBuffer);

    const text = pdf.text.trim();

    if (!text) {
      return "No readable text found in the uploaded PDF.";
    }

    // Prevent sending excessively large documents
    const limitedText = text.substring(0, 15000);

    console.log("🤖 Generating AI summary...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You summarize books professionally for readers browsing an online bookstore.",
        },
        {
          role: "user",
          content: `
Read the following book content and produce:

1. A short engaging summary (200-300 words).
2. 5 key lessons.
3. Who should read this book.

Book:

${limitedText}
`,
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ??
      "Summary generation failed.";
  } catch (error) {
    console.error("AI Summary Error:", error);

    return "Unable to generate book summary.";
  }
}