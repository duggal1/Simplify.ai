export class YouTubeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'YouTubeError';
  }
}

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
} 
