interface ExtractedCode {
  language: string;
  code: string;
  lineCount: number;
  dependencies?: string[];
}

export function extractCodeFromHTML(html: string): ExtractedCode[] {
  const codeBlocks: ExtractedCode[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract from <code> and <pre> tags
  const codeElements = doc.querySelectorAll('pre code, pre');
  
  codeElements.forEach(element => {
    const classNames = Array.from(element.classList);
    const language = detectLanguage(classNames, element.textContent || '');
    const code = element.textContent || '';
    
    codeBlocks.push({
      language,
      code: cleanCode(code),
      lineCount: code.split('\n').length,
      dependencies: extractDependencies(code, language)
    });
  });

  return codeBlocks;
}

function detectLanguage(classes: string[], content: string): string {
  // Check class-based language indicators
  const languageClass = classes.find(cls => 
    cls.startsWith('language-') || 
    cls.startsWith('lang-')
  );
  
  if (languageClass) {
    return languageClass.replace(/^(language-|lang-)/, '');
  }

  // Content-based detection
  if (content.includes('import React') || content.includes('jsx')) return 'typescript';
  if (content.includes('function') || content.includes('const')) return 'javascript';
  if (content.includes('interface') || content.includes(':')) return 'typescript';
  if (content.includes('class') && content.includes('public')) return 'java';
  if (content.includes('fun') && content.includes('val')) return 'kotlin';
  if (content.includes('def') && content.includes('print')) return 'python';
  
  return 'unknown';
}

function cleanCode(code: string): string {
  return code
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\t/g, '  ')      // Convert tabs to spaces
    .replace(/\r\n/g, '\n')    // Normalize line endings
    .replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
}

function extractDependencies(code: string, language: string): string[] {
  const dependencies: string[] = [];

  switch (language) {
    case 'javascript':
    case 'typescript':
      // Extract npm dependencies
      const importMatches = code.match(/from ['"]([^'"]+)['"]/g);
      if (importMatches) {
        dependencies.push(...importMatches.map(match => 
          match.replace(/from ['"]|['"]/g, '')
        ));
      }
      break;
    
    case 'python':
      // Extract pip dependencies
      const pipMatches = code.match(/import ([^\n]+)/g);
      if (pipMatches) {
        dependencies.push(...pipMatches.map(match => 
          match.replace('import ', '').trim()
        ));
      }
      break;
    
    // Add more language-specific dependency extraction
  }

  return [...new Set(dependencies)]; // Remove duplicates
} 