import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

interface BlogPostStructure {
  title: string;
  introduction: string;
  mainContent: string;
  conclusion: string;
}

export async function summarizeWithGemini(transcript: string): Promise<string> {
  if (!transcript || typeof transcript !== 'string') {
    throw new Error('Invalid transcript provided');
  }

  let attempt = 0;
  
  while (attempt < RETRY_ATTEMPTS) {
    try {
      const prompt = `
        Please convert this video transcript into a well-structured blog post.
        
        STRICT FORMATTING REQUIREMENTS:
        - DO NOT use any markdown formatting
        - DO NOT use asterisks (*) for emphasis
        - DO NOT use double asterisks (**) for bold
        - DO NOT use any special characters for formatting
        - Use ONLY plain text
        - Use regular paragraphs and line breaks for structure
        
        Content Requirements:
        1. Create an engaging title (plain text only)
        2. Write a compelling introduction
        3. Organize the main content with clear section headings (plain text)
        4. Add a conclusion
        5. Keep the key points and insights from the video
        6. Make it engaging and easy to read
        7. Use professional tone
        
        IMPORTANT: The output must be completely free of any markdown or special formatting characters.
      
        Transcript:
        ${transcript}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      // Try to parse the response into a structured format
      try {
        const structuredPost = parseIntoStructure(text);
        return formatBlogPost(structuredPost);
      } catch {
        // If parsing fails, return the raw text
        return text;
      }

    } catch (error) {
      attempt++;
      console.error(`Gemini API attempt ${attempt} failed:`, error);
      
      if (attempt === RETRY_ATTEMPTS) {
        throw new Error('Failed to generate blog post after multiple attempts');
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
      );
    }
  }

  throw new Error('Failed to generate blog post');
}

function parseIntoStructure(text: string): BlogPostStructure {
  // Basic parsing logic - can be enhanced based on actual Gemini output format
  const sections = text.split('\n\n');
  
  return {
    title: sections[0]?.replace('#', '').trim() || 'Untitled Post',
    introduction: sections[1] || '',
    mainContent: sections.slice(2, -1).join('\n\n'),
    conclusion: sections[sections.length - 1] || ''
  };
}

function formatBlogPost(structure: BlogPostStructure): string {
  return `
# ${structure.title}

${structure.introduction}

${structure.mainContent}

## Conclusion
${structure.conclusion}
  `.trim();
}

// Helper function to handle API errors
export function isGeminiError(error: unknown): error is Error {
  return error instanceof Error && error.message.includes('Gemini');
} 