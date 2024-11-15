import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.8,
    maxOutputTokens: 4096, // Reduced maximum output
  }
});

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

interface BlogPostStructure {
  title: string;
  introduction: string;
  sections: {
    heading: string;
    content: string;
  }[];
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
        Create an extremely detailed, long-form blog post from this video transcript.
        
        CRITICAL REQUIREMENTS:
        1. Length: Minimum 2000 words
        2. Depth: Extremely detailed analysis and expansion of ideas
        3. Structure: Multiple detailed sections with clear transitions
        
        FORMAT REQUIREMENTS:
        - Pure text only, no special characters
        - No markdown or formatting symbols
        - Natural paragraph breaks only
        
        CONTENT STRUCTURE:
        1. Compelling Title (Make it SEO-friendly and engaging)
        
        2. Introduction (3-4 paragraphs):
        - Hook the reader
        - Provide context
        - Preview main points
        - Set expectations
        
        3. Main Content (6-8 major sections):
        - Each section should be 300-400 words
        - Include relevant examples
        - Expand on transcript points
        - Add expert insights
        - Include practical applications
        - Discuss implications
        
        4. Detailed Analysis:
        - Deep dive into key concepts
        - Real-world applications
        - Expert perspectives
        - Industry relevance
        
        5. Extended Discussion:
        - Broader implications
        - Future trends
        - Related concepts
        - Expert opinions
        
        6. Comprehensive Conclusion:
        - Summarize key insights
        - Provide actionable takeaways
        - End with thought-provoking statement
        
        STYLE GUIDELINES:
        - Professional yet engaging tone
        - Use storytelling techniques
        - Include expert perspectives
        - Add relevant statistics when possible
        - Make complex ideas accessible
        - Use clear transitions between sections
        - Maintain reader engagement throughout
        
        IMPORTANT:
        - Expand significantly beyond the transcript
        - Add relevant context and background
        - Include industry insights
        - Make it extremely comprehensive
        - Focus on depth and value
        
        Transform this transcript into a professional, extremely detailed blog post:
        ${transcript}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.length < 2000) {
        throw new Error('Generated content too short');
      }

      try {
        const structuredPost = parseIntoStructure(text);
        return formatBlogPost(structuredPost);
      } catch {
        return text;
      }

    } catch (error) {
      attempt++;
      console.error(`Gemini API attempt ${attempt} failed:`, error);
      
      if (attempt === RETRY_ATTEMPTS) {
        throw new Error('Failed to generate blog post after multiple attempts');
      }
      
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1))
      );
    }
  }

  throw new Error('Failed to generate blog post');
}

function parseIntoStructure(text: string): BlogPostStructure {
  const sections = text.split('\n\n').filter(Boolean);
  
  const cleanText = (text: string) => {
    return text
      .replace(/[#*`]/g, '')
      .replace(/^\s*[-•]\s*/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // Extract sections with headings
  const mainSections = [];
  let currentSection = { heading: '', content: '' };
  
  for (let i = 2; i < sections.length - 1; i++) {
    const section = cleanText(sections[i]);
    if (section.length < 50 && i < sections.length - 2) {
      // This is likely a heading
      if (currentSection.heading) {
        mainSections.push(currentSection);
      }
      currentSection = { heading: section, content: '' };
    } else {
      currentSection.content += (currentSection.content ? '\n\n' : '') + section;
    }
  }
  
  if (currentSection.heading) {
    mainSections.push(currentSection);
  }
  
  return {
    title: cleanText(sections[0] || 'Untitled Post'),
    introduction: cleanText(sections[1] || ''),
    sections: mainSections,
    conclusion: cleanText(sections[sections.length - 1] || '')
  };
}

function formatBlogPost(structure: BlogPostStructure): string {
  const formattedSections = structure.sections
    .map(section => `${section.heading}\n\n${section.content}`)
    .join('\n\n');

  return `
${structure.title}

${structure.introduction}

${formattedSections}

Conclusion

${structure.conclusion}
  `.trim();
}

export function isGeminiError(error: unknown): error is Error {
  return error instanceof Error && error.message.includes('Gemini');
}