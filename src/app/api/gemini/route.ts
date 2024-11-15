import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { content, targetLanguage } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Convert and enhance the following code to ${targetLanguage}.
      Make it production-ready, well-documented, and optimized.
      Add proper error handling, types, and best practices.
      Original code:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to process with Gemini" },
      { status: 500 }
    );
  }
} 