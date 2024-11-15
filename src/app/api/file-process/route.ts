import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { PDFDocument } from 'pdf-lib';
import { metrics } from "@/_lib/metrics";
//added
// Initialize Gemini with error handling
const initializeAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

const genAI = initializeAI();

// Advanced file processing with error handling and validation
class FileProcessor {
  static async processFile(filename: string, buffer: Buffer) {
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File ${filename} exceeds size limit of 10MB`);
    }

    const extension = filename.split('.').pop()?.toLowerCase();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROCESSING_TIMEOUT);

    try {
      let result;
      switch (extension) {
        case 'xlsx':
        case 'xls':
          result = await this.processExcel(buffer, filename);
          break;
        case 'csv':
          result = await this.processCSV(buffer, filename);
          break;
        case 'pdf':
          result = await this.processPDF(buffer, filename);
          break;
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }

      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  static async processExcel(buffer: Buffer, filename: string) {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const result: Record<string, any[]> = {};

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        result[sheetName] = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
          defval: null,
          blankrows: false
        });
      }

      return {
        type: 'excel',
        filename,
        sheets: result,
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      console.error(`Error processing Excel ${filename}:`, error);
      throw new Error(`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processCSV(buffer: Buffer, filename: string) {
    try {
      const content = buffer.toString('utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return {
        type: 'csv',
        filename,
        data: records
      };
    } catch (error) {
      console.error(`Error processing CSV ${filename}:`, error);
      throw new Error(`Failed to process CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processPDF(buffer: Buffer, filename: string) {
    try {
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();
      const textContent: string[] = [];

      for (const page of pages) {
        // Get text using a more reliable method
        const { width, height } = page.getSize();
        const text = await this.extractTextFromPage(page);
        if (text.trim()) {
          textContent.push(text);
        }
      }

      return {
        type: 'pdf',
        filename,
        content: textContent.join('\n').trim(),
        pageCount: pages.length,
        summary: textContent.length > 0 ? 'Text extracted successfully' : 'No text content found'
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async extractTextFromPage(page: any): Promise<string> {
    try {
      // Get page dimensions
      const { width, height } = page.getSize();
      
      // Extract text content using PDF-lib's lower-level APIs
      const textContent: string[] = [];
      const operators = await page.getOperators();
      
      operators.forEach((op: any) => {
        if (op.operator === 'Tj' || op.operator === 'TJ') {
          const text = Array.isArray(op.args[0])
            ? op.args[0].map((item: any) => 
                typeof item === 'string' ? item : ''
              ).join('')
            : op.args[0];
          
          if (text && typeof text === 'string') {
            textContent.push(text);
          }
        }
      });

      return textContent.join(' ');
    } catch (error) {
      console.error('Error extracting text from PDF page:', error);
      return '';
    }
  }

  static async combineDataSources(results: any[]) {
    // Combine data from different sources
    const combined = {
      spreadsheets: results.filter(r => r.type === 'spreadsheet'),
      csvs: results.filter(r => r.type === 'csv'),
      pdfs: results.filter(r => r.type === 'pdf'),
      totalRecords: 0,
      commonFields: new Set(),
      dateRange: { start: null, end: null },
      numericalColumns: new Set(),
      categoricalColumns: new Set()
    };

    // Analyze common fields and data types
    results.forEach(result => {
      if (result.type === 'spreadsheet' || result.type === 'csv') {
        const data = result.type === 'csv' ? result.data : result.sheets[0].data;
        if (data.length > 0) {
          Object.keys(data[0]).forEach(key => {
            combined.commonFields.add(key);
            // Analyze data types
            const value = data[0][key];
            if (typeof value === 'number') {
              combined.numericalColumns.add(key);
            } else if (typeof value === 'string') {
              combined.categoricalColumns.add(key);
            }
          });
        }
      }
    });

    return combined;
  }
}

// Advanced analytics generation
class AnalyticsGenerator {
  private model: GenerativeModel | null;
  private data: any;
  private readonly maxChunkSize: number = 10000; // Further reduced for serverless
  private readonly maxSampleSize: number = 50;   // Further reduced for serverless
  private readonly timeout: number = 5000;       // Reduced to 5 seconds

  constructor() {
    this.model = null;
    this.data = null;
  }

  setModel(model: GenerativeModel) {
    if (!model) {
      throw new Error('Invalid model provided');
    }
    this.model = model;
  }

  private validateModel() {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
  }

  async generateAnalytics(data: any, section: AnalyticsSection, filename: string): Promise<AnalyticsResponse> {
    try {
      this.validateModel();
      this.data = this.sanitizeData(data);
      const processedData = await this.processLargeData(this.data);
      
      const primaryResults = await this.processPrimaryMetrics(section, processedData);
      const deepResults = await this.processDeepMetrics(section, processedData);

      return {
        primary: primaryResults,
        deep: deepResults
      };
    } catch (error) {
      console.error('Analytics error:', error);
      return this.getFallbackResponse(section);
    }
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const cleaned = { ...data };
      delete cleaned.buffer;
      delete cleaned.raw;
      return cleaned;
    }
    return data;
  }

  private async processLargeData(data: any): Promise<string> {
    try {
      const stringData = typeof data === 'string' 
        ? data 
        : JSON.stringify(data, null, 2);
      return this.truncateData(stringData);
    } catch (error) {
      console.error('Error processing large data:', error);
      return 'Error processing data';
    }
  }

  private truncateData(data: string): string {
    return data.length > this.maxChunkSize 
      ? data.slice(0, this.maxChunkSize) + '...'
      : data;
  }

  private async processPrimaryMetrics(section: AnalyticsSection, data: string): Promise<Record<string, MetricResponse>> {
    try {
      const results = await Promise.race([
        Promise.all(
          section.subsections.primary.map(metric =>
            this.processMetric(metric, 'primary', data)
          )
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Primary analysis timeout')), this.timeout)
        )
      ]) as MetricResponse[];

      return Object.fromEntries(
        results.map((result, index) => [section.subsections.primary[index], result])
      );
    } catch (error) {
      return this.getFallbackPrimaryMetrics(section);
    }
  }

  private async processDeepMetrics(section: AnalyticsSection, data: string): Promise<Record<string, MetricResponse>> {
    if (!section.subsections.deep?.length) return {};

    try {
      const results = await Promise.race([
        Promise.all(
          section.subsections.deep.map(metric =>
            this.processMetric(metric, 'deep', data)
          )
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Deep analysis timeout')), this.timeout)
        )
      ]) as MetricResponse[];

      return Object.fromEntries(
        results.map((result, index) => [section.subsections.deep[index], result])
      );
    } catch (error) {
      return this.getFallbackDeepMetrics(section);
    }
  }

  private async processMetric(metric: string, type: 'primary' | 'deep', data: string): Promise<MetricResponse> {
    try {
      const prompt = this.buildPrompt(data, type, [metric]);
      const response = await this.model!.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 512,
        }
      });

      const result = this.safeParseResponse(response.response.text());
      if (result.analysis?.[metric]) return result.analysis[metric];
      return this.getFallbackMetric(metric);
    } catch (error) {
      return this.getFallbackMetric(metric);
    }
  }

  private buildPrompt(data: string, type: string, metrics: string[]): string {
    return `Analyze this ${type} data and provide insights. Return ONLY a JSON object.
Data: ${data}
Required Metrics: ${metrics.join(', ')}`;
  }

  private getFallbackMetric(metric: string): MetricResponse {
    return {
      summary: `Analysis pending for ${metric}`,
      key_points: [],
      metrics: {},
      recommendations: []
    };
  }

  private getFallbackPrimaryMetrics(section: AnalyticsSection): Record<string, MetricResponse> {
    return Object.fromEntries(
      section.subsections.primary.map(metric => [metric, this.getFallbackMetric(metric)])
    );
  }

  private getFallbackDeepMetrics(section: AnalyticsSection): Record<string, MetricResponse> {
    return Object.fromEntries(
      (section.subsections.deep || []).map(metric => [metric, this.getFallbackMetric(metric)])
    );
  }

  private getFallbackResponse(section: AnalyticsSection): AnalyticsResponse {
    return {
      primary: this.getFallbackPrimaryMetrics(section),
      deep: this.getFallbackDeepMetrics(section)
    };
  }

  private safeParseResponse(text: string): any {
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error parsing response:', error);
      return { analysis: {} };
    }
  }
}
//ai
// Main request handler with proper return type
export async function POST(request: NextRequest): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second total timeout

  try {
    const processPromise = processRequest(request);
    const result = await Promise.race([
      processPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 45000)
      )
    ]);

    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function with proper return type
async function processRequest(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files?.length) {
      return NextResponse.json(
        { success: false, error: 'No files provided' }, 
        { status: 400 }
      );
    }

    // Enhanced file validation
    const validationError = validateFiles(files);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError }, 
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];
    let totalSize = 0;

    // Process files with better error handling
    for (const file of files) {
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        errors.push({
          filename: file.name,
          error: 'Total file size limit exceeded'
        });
        continue;
      }

      try {
        const result = await processFileWithTimeout(file);
        results.push(result);
      } catch (error) {
        errors.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      totalFiles: files.length,
      successfulFiles: results.length,
      failedFiles: errors.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper functions
function validateFiles(files: File[]): string | null {
  if (files.length > 5) {
    return 'Maximum 5 files allowed per request';
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    return 'Total file size exceeds 30MB limit';
  }

  if (files.some(file => file.size > MAX_FILE_SIZE)) {
    return 'Individual file size exceeds 10MB limit';
  }

  const allowedTypes = ['xlsx', 'xls', 'csv', 'pdf'];
  const invalidFile = files.find(file => 
    !allowedTypes.includes(file.name.split('.').pop()?.toLowerCase() || '')
  );
  if (invalidFile) {
    return `Unsupported file type: ${invalidFile.name}`;
  }

  return null;
}

// Add interface for file processing result
interface FileProcessingResult {
  filename: string;
  processedData: any;
  analytics: AnalyticsResponse;
  timestamp: string;
}

// Update processFileWithTimeout with better error handling
async function processFileWithTimeout(file: File): Promise<FileProcessingResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROCESSING_TIMEOUT);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const processedData = await FileProcessor.processFile(file.name, buffer);
    
    const analyticsGenerator = new AnalyticsGenerator();
    analyticsGenerator.setModel(genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 512, // Reduced for better performance
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    }));

    const section = {
      title: "File Analysis",
      subsections: {
        primary: ["Data Overview"],  // Reduced metrics for better performance
        deep: ["Statistical Analysis"]
      }
    };

    const analytics = await analyticsGenerator.generateAnalytics(
      processedData,
      section,
      file.name
    );

    clearTimeout(timeoutId);
    return {
      filename: file.name,
      processedData,
      analytics,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Configuration for Vercel serverless
export const runtime = 'edge';
export const maxDuration = 20; // Increased to 60 seconds for file processing
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

// Add size limits and timeout constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB total
const PROCESSING_TIMEOUT = 20000; // 20 seconds
const ANALYTICS_TIMEOUT = 15000; // 15 seconds

// Add after imports
interface AnalyticsSection {
  title: string;
  subsections: {
    primary: string[];
    deep: string[];
  };
}

interface AnalyticsResponse {
  primary: Record<string, any>;
  deep: Record<string, any>;
}

interface MetricResponse {
  summary: string;
  key_points: string[];
  metrics: Record<string, any>;
  recommendations: string[];
}
