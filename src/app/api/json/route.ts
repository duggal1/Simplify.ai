import { GoogleGenerativeAI, GenerateContentResult, GenerativeModel } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Logger } from "@/_lib/logger"
import { cache } from "@/_lib/cache"
import { metrics } from "@/_lib/metrics"
import { parseDocument } from "@/_lib/document-parser"
import { gemini } from "@/lib/gemini"

// Add these exports for Vercel
export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// Update request schema to handle file uploads
const requestSchema = z.object({
  data: z.any(),
  file: z.any().optional(),
  format: z.any().optional(),
  options: z.object({
    maxLines: z.number().default(5000),
    chunkSize: z.number().default(1024 * 1024), // 1MB chunks
    timeout: z.number().default(240000) // 4 minutes
  }).default({})
}).passthrough()

// Enhanced file processing with better chunking
async function processLargeFile(file: File): Promise<string> {
  const chunks: string[] = [];
  let totalSize = 0;
  const maxSize = 100 * 1024 * 1024; // 100MB limit
  const chunkSize = 2 * 1024 * 1024; // 2MB chunks for better memory management
  const reader = file.stream().getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      totalSize += value.length;
      if (totalSize > maxSize) {
        throw new Error('File exceeds maximum size limit of 100MB');
      }
      
      chunks.push(decoder.decode(value, { stream: !done }));
    }
    
    return chunks.join('');
  } finally {
    reader.releaseLock();
  }
}

// Enhanced API handler with maximum resilience
export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID();
  const startTime = performance.now();
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  try {
    const contentType = req.headers.get('content-type') || '';
    let content: string;
    let fileType: string | undefined;

    // Enhanced file handling
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        throw new Error('No file provided');
      }

      fileType = file.name.split('.').pop()?.toLowerCase();
      content = await processLargeFile(file);
    } else {
      const rawBody = await req.text();
      content = rawBody;
    }

    // Set dynamic timeout based on content size
    const timeout = Math.min(
      300000, // Max 5 minutes
      Math.max(60000, Math.floor(content.length / 50)) // Min 1 minute
    );

    timeoutId = setTimeout(() => controller.abort(), timeout);

    // Process in smaller chunks for better memory management
    const chunks = [];
    const chunkSize = 50000; // 50KB chunks
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }

    // Initialize Gemini with optimized settings
    const model = gemini.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 1,
        topK: 40,
        maxOutputTokens: 8000,
      },
    });

    let result = '';
    for (const [index, chunk] of chunks.entries()) {
      const prompt = `Convert this ${fileType || 'text'} chunk (${index + 1}/${chunks.length}) to valid JSON. 
                     Preserve all data structure, types, and formatting:
                     ${chunk}`;

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      result += response.response.text();
    }

    // Clean and parse result
    const cleanedResult = result
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/(\r\n|\n|\r)/gm, '')
      .trim();

    const jsonResult = JSON.parse(cleanedResult);

    if (timeoutId) clearTimeout(timeoutId);

    // Track metrics
    metrics.recordConversion({
      success: true,
      duration: performance.now() - startTime,
      requestId,
      // Remove fileSize as it's not in the type definition
    });

    return NextResponse.json({
      success: true,
      data: jsonResult,
      metadata: {
        requestId,
        processingTime: `${performance.now() - startTime}ms`,
        chunkCount: chunks.length,
        originalSize: content.length,
        fileType
      }
    });

  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error('Conversion error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
//new code