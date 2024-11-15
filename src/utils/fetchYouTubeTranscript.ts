import { fetchTranscriptEdge } from './edgeTranscriptFetcher';

const MAX_RETRIES = 2;
const INITIAL_DELAY = 300;
const MAX_TIMEOUT = 5000;

export default async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  if (!videoId?.trim()) {
    throw new Error('Valid video ID is required');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Timeout reached, aborting request');
      }, MAX_TIMEOUT - (attempt * 1000));

      try {
        console.log(`Fetching transcript attempt ${attempt + 1}/${MAX_RETRIES} for video ${videoId}`);
        
        const transcript = await fetchTranscriptEdge(videoId.trim());
        clearTimeout(timeoutId);

        if (!transcript) {
          throw new Error('Empty transcript received');
        }

        if (transcript.length < 50) {
          throw new Error('Retrieved transcript is too short');
        }

        return transcript;

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.error(`Transcript fetch attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        videoId,
        timestamp: new Date().toISOString()
      });

      if (attempt === MAX_RETRIES - 1) {
        break;
      }

      const delay = Math.min(INITIAL_DELAY * Math.pow(1.5, attempt), 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Failed to fetch transcript: ${lastError?.message || 'Unknown error'}`);
} 