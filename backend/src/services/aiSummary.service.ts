import OpenAI from "openai";
import axios from "axios";
import { PDFParse } from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BookAIResult {
  aiSummary: string;
  shortSummary: string;
  keyThemes: string[];
  keywords: string[];
  targetAudience: string;
  readingTime: string;
}

/**
 * Downloads a PDF from Cloudinary and extracts its text.
 */
async function extractPdfText(pdfUrl: string): Promise<string> {
  console.log("📥 Downloading PDF...");

  const response = await axios.get<ArrayBuffer>(pdfUrl, {
    responseType: "arraybuffer",
    timeout: 120000,
  });

  const buffer = Buffer.from(response.data);

  console.log("📖 Extracting PDF text...");

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text?.trim() || "";
  } finally {
    await parser.destroy();
  }
}

/**
 * Generates bookstore metadata from a PDF.
 */
export async function generateBookMetadata(
  pdfUrl: string
): Promise<BookAIResult | null> {
  try {
    const text = await extractPdfText(pdfUrl);

    if (!text) {
      console.warn("⚠️ No readable text found in PDF.");
      return null;
    }

    /*
     * We don't send the entire book directly to the AI.
     * Instead, we create a representative sample from the beginning,
     * middle and end of the extracted text.
     */
    const maxCharacters = 45000;

    let bookText = text;

    if (text.length > maxCharacters) {
      const sectionLength = Math.floor(maxCharacters / 3);

      const beginning = text.slice(0, sectionLength);
      const middleStart = Math.floor(text.length / 2) - sectionLength / 2;
      const middle = text.slice(
        middleStart,
        middleStart + sectionLength
      );
      const ending = text.slice(-sectionLength);

      bookText = `
--- BEGINNING OF BOOK ---
${beginning}

--- MIDDLE OF BOOK ---
${middle}

--- END OF BOOK ---
${ending}
`;
    }

    console.log("🤖 Generating AI book metadata...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are an expert bookstore content editor.

Analyze the supplied book text and create accurate, engaging
metadata for an online bookstore.

Do not invent facts that are not supported by the text.

Return ONLY valid JSON using exactly this structure:

{
  "aiSummary": "200-300 word professional summary",
  "shortSummary": "50-80 word engaging summary",
  "keyThemes": ["theme 1", "theme 2", "theme 3", "theme 4", "theme 5"],
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "targetAudience": "Who would benefit most from reading this book",
  "readingTime": "Estimated reading time such as 3-4 hours"
}

The summary should help a potential customer understand
what the book is about without giving away major conclusions.
          `.trim(),
        },
        {
          role: "user",
          content: `
Analyze this book:

${bookText}
          `.trim(),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.warn("⚠️ AI returned no content.");
      return null;
    }

    const parsed = JSON.parse(content) as BookAIResult;

    return {
      aiSummary: parsed.aiSummary || "",
      shortSummary: parsed.shortSummary || "",
      keyThemes: Array.isArray(parsed.keyThemes)
        ? parsed.keyThemes
        : [],
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords
        : [],
      targetAudience: parsed.targetAudience || "",
      readingTime: parsed.readingTime || "",
    };
  } catch (error) {
    console.error("❌ AI book metadata error:", error);

    return null;
  }
}