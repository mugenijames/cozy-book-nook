import OpenAI from "openai";
import axios from "axios";
import { PDFParse } from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BookAIResult {
  summary: string;
  shortSummary: string;
  keyThemes: string[];
  keywords: string[];
  readingTime: string;
  targetAudience: string;
}

// Maximum characters sent to OpenAI per section.
// The entire book is still processed; it is simply divided
// into smaller sections first.
const CHUNK_SIZE = 30000;

/**
 * Download the PDF and extract ALL text.
 */
async function extractPdfText(
  pdfUrl: string
): Promise<string> {
  console.log("📥 Downloading PDF...");

  const response = await axios.get<ArrayBuffer>(
    pdfUrl,
    {
      responseType: "arraybuffer",
      timeout: 120000,
    }
  );

  const pdfBuffer = Buffer.from(
    response.data
  );

  console.log(
    "📖 Extracting complete PDF text..."
  );

  // pdf-parse v2.x API
  const parser = new PDFParse({
    data: pdfBuffer,
  });

  const result = await parser.getText();

  // Clean up parser resources
  await parser.destroy();

  const text = result.text
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    throw new Error(
      "No readable text found in the PDF. The PDF may be scanned/image-based."
    );
  }

  console.log(
    `📄 Extracted ${text.length.toLocaleString()} characters from ${result.total} pages`
  );

  return text;
}

/**
 * Split the complete book into manageable sections.
 */
function splitIntoChunks(
  text: string
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    let end = Math.min(
      start + CHUNK_SIZE,
      text.length
    );

    // Try to end at a sentence boundary.
    if (end < text.length) {
      const sentenceEnd =
        text.lastIndexOf(". ", end);

      if (
        sentenceEnd >
        start + CHUNK_SIZE * 0.7
      ) {
        end = sentenceEnd + 1;
      }
    }

    const chunk = text
      .substring(start, end)
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }

    start = end;
  }

  return chunks;
}

/**
 * Analyze one section of the book.
 */
async function summarizeChunk(
  chunk: string,
  index: number,
  total: number
): Promise<string> {
  console.log(
    `🤖 Processing section ${index + 1}/${total}...`
  );

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.3,

      messages: [
        {
          role: "system",

          content:
            "You are an expert literary analyst helping an online bookstore understand books accurately. Analyze the provided section carefully. Do not invent information that is not present in the text.",
        },

        {
          role: "user",

          content: `
Analyze this section of a book.

This is section ${index + 1} of ${total}.

Extract the important information needed to understand the entire book:

- Main ideas
- Important arguments
- Major events or developments
- Important characters or people
- Important lessons
- Important concepts
- Practical applications
- Themes
- Conclusions or insights

Do not give a superficial summary.

SECTION:

${chunk}
`,
        },
      ],
    });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    ""
  );
}

/**
 * Create the final book analysis from
 * ALL processed sections.
 */
async function generateFinalAnalysis(
  sectionSummaries: string[]
): Promise<BookAIResult> {
  console.log(
    "🧠 Creating final analysis from all sections..."
  );

  const combined =
    sectionSummaries
      .map(
        (summary, index) =>
          `SECTION ${index + 1} SUMMARY:\n${summary}`
      )
      .join("\n\n");

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      temperature: 0.4,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content: `
You are a professional book editor and literary analyst for an online bookstore.

You have been given summaries of ALL sections of a book.

Use them together to create an accurate overall analysis.

Do not invent facts.

Return ONLY valid JSON using this structure:

{
  "summary": "200-300 word engaging professional summary",
  "shortSummary": "2-3 sentence concise description",
  "keyThemes": [
    "theme 1",
    "theme 2",
    "theme 3",
    "theme 4",
    "theme 5"
  ],
  "keywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3",
    "keyword 4",
    "keyword 5",
    "keyword 6",
    "keyword 7",
    "keyword 8"
  ],
  "readingTime": "X hours",
  "targetAudience": "A concise description of who should read this book"
}

The summary should help a customer understand:

1. What the book is about.
2. The major ideas in the book.
3. Why the book is valuable.
4. What readers can learn from it.

The keyThemes should represent the major themes
found throughout the ENTIRE book.

The keywords should be useful for bookstore
search and categorization.

Estimate reading time based on the apparent
length of the book.
`,
        },

        {
          role: "user",

          content: combined,
        },
      ],
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "OpenAI returned an empty final analysis."
    );
  }

  try {
    const parsed = JSON.parse(content);

    return {
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary
          : "Summary unavailable.",

      shortSummary:
        typeof parsed.shortSummary === "string"
          ? parsed.shortSummary
          : typeof parsed.summary === "string"
          ? parsed.summary
          : "Summary unavailable.",

      keyThemes:
        Array.isArray(parsed.keyThemes)
          ? parsed.keyThemes.map(String)
          : [],

      keywords:
        Array.isArray(parsed.keywords)
          ? parsed.keywords.map(String)
          : [],

      readingTime:
        typeof parsed.readingTime === "string"
          ? parsed.readingTime
          : "Unknown",

      targetAudience:
        typeof parsed.targetAudience === "string"
          ? parsed.targetAudience
          : "General readers",
    };
  } catch (error) {
    console.error(
      "❌ Failed to parse OpenAI JSON:",
      error
    );

    throw new Error(
      "AI returned invalid analysis data."
    );
  }
}

/**
 * MAIN FUNCTION
 *
 * Reads and processes the ENTIRE book.
 */
export async function generateBookSummary(
  pdfUrl: string
): Promise<BookAIResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not configured."
      );
    }

    if (!pdfUrl) {
      throw new Error(
        "PDF URL is required."
      );
    }

    console.log(
      "\n========================================"
    );

    console.log(
      "📚 STARTING COMPLETE BOOK AI ANALYSIS"
    );

    console.log(
      "========================================"
    );

    // 1. Download and extract the ENTIRE book.
    const fullText =
      await extractPdfText(pdfUrl);

    // 2. Divide the complete book into sections.
    const chunks =
      splitIntoChunks(fullText);

    console.log(
      `📚 Book divided into ${chunks.length} sections`
    );

    // 3. Process EVERY section.
    const sectionSummaries: string[] = [];

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      const summary =
        await summarizeChunk(
          chunks[i],
          i,
          chunks.length
        );

      sectionSummaries.push(summary);
    }

    console.log(
      "✅ All book sections processed"
    );

    // 4. Create the final analysis from
    // all section summaries.
    const finalAnalysis =
      await generateFinalAnalysis(
        sectionSummaries
      );

    console.log(
      "✅ Complete book analysis generated"
    );

    console.log(
      "========================================\n"
    );

    return finalAnalysis;
  } catch (error) {
    console.error(
      "❌ AI Book Analysis Error:",
      error
    );

    throw error;
  }
}

