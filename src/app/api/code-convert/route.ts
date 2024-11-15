import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from 'cheerio';
import prettier from 'prettier';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Enhanced URL validation with additional checks
function isValidHttpsUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' && 
           url.hostname.length > 0 && 
           !url.hostname.includes('localhost') &&
           !url.hostname.includes('127.0.0.1');
  } catch {
    return false;
  }
}

// Super robust code extraction
async function extractCodeFromUrl(url: string): Promise<string[]> {
  const codeBlocks: Set<string> = new Set();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    // Simplified fetch attempts with better timeouts
    const fetchAttempts = [
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      }
    ];

    let html = '';
    let fetchSuccess = false;

    // Try fetch with timeout
    for (const config of fetchAttempts) {
      try {
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
          cache: 'no-store'
        });

        if (response.ok) {
          html = await response.text();
          fetchSuccess = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    clearTimeout(timeoutId);

    if (!fetchSuccess) {
      throw new Error('Failed to fetch URL');
    }

    const $ = cheerio.load(html);

    // Enhanced code selectors for different platforms
    const codeSelectors = {
      general: [
        'pre code', 'pre', 'code', '.highlight', '.syntax',
        '[class*="language-"]', '[class*="highlight-"]', '.codeblock',
        '.code-sample', '.source-code', 'script[type="text/plain"]',
        '.CodeMirror-code', '.ace_content'
      ],
      github: [
        '.blob-code-inner', '.js-file-line', '.highlight-source-js',
        '.highlight-source-ts', '.highlight-text-html-basic'
      ],
      stackoverflow: [
        '.prettyprint', '.s-code-block', '.highlight-code'
      ],
      documentation: [
        '.example', '.sample-code', '.code-example', '.doc-code',
        '[class*="example-"]', '[class*="demo-"]'
      ],
      markdown: [
        '.markdown-body pre', '.markdown-body code'
      ]
    };

    // Process each selector category
    Object.entries(codeSelectors).forEach(([platform, selectors]) => {
      selectors.forEach(selector => {
        $(selector).each((_, element) => {
          let code = $(element).text().trim();
          
          // Clean the code
          code = code
            .replace(/^\s+|\s+$/g, '')  // Trim whitespace
            .replace(/\t/g, '  ')       // Convert tabs to spaces
            .replace(/\r\n/g, '\n')     // Normalize line endings
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .replace(/[^\x20-\x7E\n]/g, ''); // Remove non-printable characters

          if (code && code.length > 10) { // Minimum length check
            codeBlocks.add(code);
          }
        });
      });
    });

    // Extract from data attributes
    $('[data-code], [data-content], [data-source]').each((_, element) => {
      const code = $(element).attr('data-code') || 
                  $(element).attr('data-content') ||
                  $(element).attr('data-source');
      if (code && code.trim().length > 10) {
        codeBlocks.add(code.trim());
      }
    });

    // Special handling for different platforms
    if (url.includes('github.com')) {
      // GitHub-specific extraction
      $('.blob-code-inner, .js-file-line').each((_, element) => {
        const code = $(element).text().trim();
        if (code) codeBlocks.add(code);
      });
    } else if (url.includes('stackoverflow.com')) {
      // Stack Overflow specific extraction
      $('.answercell pre, .question pre').each((_, element) => {
        const code = $(element).text().trim();
        if (code) codeBlocks.add(code);
      });
    }

    // Extract from inline styles containing code
    $('[style*="content"]').each((_, element) => {
      const style = $(element).attr('style');
      if (style?.includes('content:')) {
        const code = style.match(/content:\s*['"](.+?)['"]/)?.[1];
        if (code && code.trim().length > 10) {
          codeBlocks.add(code.trim());
        }
      }
    });

    // Validate extracted code blocks
    const validatedBlocks = Array.from(codeBlocks).filter(code => {
      // Remove blocks that are too short or look like plain text
      return code.length > 10 && 
             (code.includes('{') || 
              code.includes('function') || 
              code.includes('class') ||
              code.includes('import') ||
              code.includes('const') ||
              code.includes('let') ||
              code.includes('var'));
    });

    if (validatedBlocks.length === 0) {
      throw new Error('No valid code blocks found');
    }

    return validatedBlocks;

  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Add this after the genAI initialization
const LANGUAGE_PROMPTS = {
  typescript: `Convert and enhance this code to enterprise-grade TypeScript with extreme attention to detail.
    Requirements:
    - Add comprehensive TypeScript types, interfaces, and type aliases with detailed JSDoc comments
    - Implement advanced TypeScript features like conditional types, mapped types, template literal types
    - Use discriminated unions and type guards for robust type safety
    - Add thorough error handling with custom error hierarchies and error boundaries
    - Implement detailed logging with proper categorization and error tracking
    - Add comprehensive unit tests with Jest and testing-library
    - Use dependency injection and SOLID principles
    - Implement proper state management patterns
    - Add performance optimizations with memoization and lazy loading
    - Include detailed documentation for all functions, classes and interfaces
    - Add proper null/undefined checks with Maybe/Option types
    - Implement proper validation using Zod/io-ts
    - Use strict TypeScript configuration with all strict flags enabled
    - Add proper debugging configurations
    - Include CI/CD suggestions and deployment considerations
    - Add proper security measures and input validation
    - Implement proper error recovery mechanisms
    - Add proper monitoring and observability
    - Include proper dependency management
    - Add proper configuration management
    - Implement proper caching strategies
    - Add proper rate limiting
    - Include proper API documentation
    - Add proper versioning strategy
    - Implement proper database interactions if needed
    - Add proper authentication/authorization if needed
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide an extensively detailed TypeScript implementation with all the above requirements.
    Include detailed comments explaining the implementation decisions.`,

  react: `Convert and enhance this code to enterprise-level React with TypeScript, focusing on scalability and maintainability.
    Requirements:
    - Implement proper component architecture with atomic design principles
    - Add comprehensive prop types and interfaces for all components
    - Use advanced React patterns (compound components, render props, HOCs)
    - Implement proper state management with Redux Toolkit/Zustand
    - Add proper routing with React Router/TanStack Router
    - Implement proper form handling with React Hook Form
    - Add proper data fetching with React Query/SWR
    - Implement proper error boundaries and fallback UI
    - Add proper loading states and skeleton screens
    - Use proper code splitting and lazy loading
    - Implement proper accessibility features (ARIA, keyboard navigation)
    - Add proper internationalization support
    - Use proper testing with React Testing Library
    - Implement proper performance optimization (virtualization, memo)
    - Add proper SEO optimization
    - Use proper styling with CSS-in-JS/Tailwind
    - Implement proper mobile responsiveness
    - Add proper analytics integration
    - Use proper security measures
    - Implement proper caching strategies
    - Add proper error tracking
    - Use proper CI/CD integration
    - Implement proper documentation
    - Add proper type checking
    - Use proper code quality tools
    - Implement proper debugging tools
    - Add proper monitoring
    - Use proper deployment strategies
    - Implement proper testing strategies
    - Add proper security measures
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide an extensively detailed React/TypeScript implementation with all the above requirements.
    Include detailed comments explaining the implementation decisions.`,

  nextjs: `Convert and enhance this code to enterprise-grade Next.js 14 with TypeScript, focusing on performance and scalability.
    Requirements:
    - Implement proper Next.js 14 app router architecture
    - Add comprehensive server and client components separation
    - Use proper data fetching patterns (Server Components, React Server Components)
    - Implement proper routing with parallel routes and intercepting routes
    - Add proper loading UI and streaming with Suspense
    - Use proper error handling with error.tsx
    - Implement proper layouts and templates
    - Add proper metadata and SEO optimization
    - Use proper image optimization with next/image
    - Implement proper font optimization
    - Add proper static/dynamic rendering strategies
    - Use proper caching strategies (full route cache, data cache)
    - Implement proper middleware for authentication/authorization
    - Add proper API routes with proper validation
    - Use proper database integration with Prisma/Drizzle
    - Implement proper form handling with proper validation
    - Add proper state management with Zustand/Jotai
    - Use proper styling with CSS Modules/Tailwind
    - Implement proper testing with Cypress/Playwright
    - Add proper monitoring with Vercel Analytics
    - Use proper deployment strategies
    - Implement proper CI/CD pipeline
    - Add proper documentation
    - Use proper code quality tools
    - Implement proper security measures
    - Add proper performance monitoring
    - Use proper logging
    - Implement proper error tracking
    - Add proper analytics
    - Use proper A/B testing
    - Implement proper feature flags
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide an extensively detailed Next.js implementation with all the above requirements.
    Include detailed comments explaining the implementation decisions.`,

  javascript: `Convert and enhance this code to modern JavaScript (ES2024+).
    Requirements:
    - Use latest JavaScript features
    - Implement proper error handling
    - Add JSDoc comments for better documentation
    - Use modern patterns (async/await, optional chaining)
    - Implement proper validation
    - Add performance optimizations
    - Use proper error handling patterns
    - Implement proper debugging
    - Add proper logging
    - Use proper design patterns
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide the enhanced JavaScript version with modern features.`,

  python: `Convert and enhance this code to modern Python.
    Requirements:
    - Use Python 3.11+ features
    - Implement proper type hints (using typing module)
    - Add proper error handling with custom exceptions
    - Use proper Python patterns and idioms
    - Implement proper logging
    - Add proper documentation (docstrings)
    - Use proper package structure
    - Implement proper testing
    - Add proper validation
    - Use proper design patterns
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide the enhanced Python version with proper structure.`,

  java: `Convert and enhance this code to modern Java.
    Requirements:
    - Use Java 17+ features
    - Implement proper exception handling
    - Add proper documentation (Javadoc)
    - Use proper design patterns
    - Implement proper logging
    - Add proper unit tests
    - Use proper validation
    - Implement proper error handling
    - Add proper debugging
    - Use proper package structure
    
    Original code:
    \`\`\`
    {{CODE}}
    \`\`\`
    
    Provide the enhanced Java version with proper structure.`
};

// Add these exports for Vercel
export const runtime = 'edge';
export const maxDuration = 15; // Set maximum duration to 15 seconds
export const dynamic = 'force-dynamic';

// Update the POST handler with better error handling and timeouts
export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

  try {
    const body = await request.json();
    const { url, code, targetLanguage } = body;

    let codeToProcess: string[] = [];

    // Handle direct code input with size limit
    if (code) {
      if (code.length > 50000) { // Add size limit
        throw new Error('Code input too large');
      }
      codeToProcess = [code];
    } 
    // Handle URL input
    else if (url) {
      if (!isValidHttpsUrl(url)) {
        throw new Error('Invalid URL provided');
      }

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
          },
          signal: controller.signal,
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        if (html.length > 100000) { // Add size limit
          throw new Error('URL content too large');
        }

        const $ = cheerio.load(html);
        const codeElements = new Set<string>();

        // Simplified extraction logic
        $('pre, code, .highlight').each((_, el) => {
          const text = $(el).text().trim()
            .replace(/^\s+|\s+$/g, '')
            .replace(/\t/g, '  ')
            .replace(/\r\n/g, '\n');
          
          if (text.length > 0 && text.length < 50000) { // Add size limit
            codeElements.add(text);
          }
        });

        codeToProcess = Array.from(codeElements).filter(text => text.length > 0);

        if (codeToProcess.length === 0) {
          throw new Error('No code found in URL');
        }

      } catch (error) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          { success: false, error: `URL processing failed: ${error instanceof Error ? error.message : String(error)}` },
          { status: 400 }
        );
      }
    } else {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, error: 'Either code or URL is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini with timeout
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const codeBlock = codeToProcess[0];
      const prompt = LANGUAGE_PROMPTS[targetLanguage as keyof typeof LANGUAGE_PROMPTS]
        ?.replace('{{CODE}}', codeBlock) || 
        `Convert this code to ${targetLanguage}:\n${codeBlock}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let convertedCode = response.text()
        .replace(/```[\w]*\n/g, '')
        .replace(/```$/g, '')
        .trim();

      clearTimeout(timeoutId);
      return NextResponse.json({
        success: true,
        code: convertedCode,
        language: targetLanguage,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { 
          success: false, 
          error: `Code conversion failed: ${error instanceof Error ? error.message : String(error)}` 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    clearTimeout(timeoutId);
    return NextResponse.json(
      { success: false, error: 'Request processing failed' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );}