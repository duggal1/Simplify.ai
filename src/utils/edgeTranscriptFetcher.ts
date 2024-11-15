interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
}

export async function fetchTranscriptEdge(videoId: string): Promise<string> {
  const SERVERLESS_TIMEOUT = 4000; // Increased from 3000 to 4000
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SERVERLESS_TIMEOUT);

  try {
    // Optimized method order and reduced methods to most reliable ones
    const methods = [
      () => fetchMethod2(videoId, controller.signal), // Innertube API first (most reliable)
      () => fetchMethod3(videoId, controller.signal), // Direct caption endpoints second
      () => fetchMethod1(videoId, controller.signal), // Direct YouTube API third
    ];

    for (const method of methods) {
      try {
        const result = await method();
        if (result) {
          clearTimeout(timeoutId);
          return result;
        }
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          throw e; // Propagate abort errors
        }
        continue;
      }
    }

    throw new Error('No transcript available');
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Method 1: Direct YouTube API
async function fetchMethod1(videoId: string, signal: AbortSignal): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cookie': 'CONSENT=YES+; PREF=hl=en&gl=US'
        }
      }
    );

    const html = await response.text();
    
    // Try multiple regex patterns
    const patterns = [
      /\{"captionTracks":(\[.*?\])/,
      /"captions":({.*?})}}/,
      /"playerCaptionsTracklistRenderer":({.*?}),/,
      /\[\{"baseUrl":"(.*?)"/
    ];

    for (const pattern of patterns) {
      try {
        const match = html.match(pattern);
        if (match) {
          if (pattern.toString().includes('baseUrl')) {
            const captionUrl = match[1];
            const transcript = await fetchCaptionUrl(captionUrl, signal);
            if (transcript) return transcript;
          } else {
            const data = JSON.parse(match[1].replace(/\\"/g, '"'));
            const captionUrl = extractCaptionUrl(data);
            if (captionUrl) {
              const transcript = await fetchCaptionUrl(captionUrl, signal);
              if (transcript) return transcript;
            }
          }
        }
      } catch (e) {
        continue;
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.log('Request timed out in method 1');
    }
    return '';
  }
  return '';
}

// Method 2: Innertube API
async function fetchMethod2(videoId: string, signal: AbortSignal): Promise<string> {
  try {
    const response = await fetch('https://www.youtube.com/youtubei/v1/get_transcript', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.youtube.com'
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101',
            hl: 'en',
            gl: 'US',
            clientScreen: 'WATCH',
            timeZone: 'UTC'
          }
        },
        params: btoa(`\n\x0b${videoId}`),
        videoId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const transcript = extractTranscriptFromInnertubeResponse(data);
    
    if (!transcript) {
      throw new Error('No transcript in response');
    }

    return transcript;
  } catch (e: unknown) {
    console.error('Method 2 error:', e instanceof Error ? e.message : 'Unknown error');
    return '';
  }
}

// Method 3: Direct caption endpoints
async function fetchMethod3(videoId: string, signal: AbortSignal): Promise<string> {
  const urls = [
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-US&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&kind=asr&lang=en&fmt=json3`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, { signal });
      if (response.ok) {
        const text = await response.text();
        const transcript = parseTranscriptResponse(text);
        if (transcript) return transcript;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        console.log('Request timed out in method 3');
        break;
      }
      continue;
    }
  }
  return '';
}

// Method 4: Auto-generated captions
async function fetchMethod4(videoId: string, signal: AbortSignal): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}&bpctr=9999999999&has_verified=1`,
      { signal }
    );
    
    const html = await response.text();
    
    const match = html.match(/"playerCaptionsTracklistRenderer".*?"adaptiveFormats":/);
    if (match) {
      const captionData = match[0].replace(/"adaptiveFormats":$/, '');
      const parsed = JSON.parse(`{${captionData}}`);
      if (parsed.playerCaptionsTracklistRenderer?.captionTracks) {
        for (const track of parsed.playerCaptionsTracklistRenderer.captionTracks) {
          if (track.baseUrl) {
            const transcript = await fetchCaptionUrl(track.baseUrl, signal);
            if (transcript) return transcript;
          }
        }
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.log('Request timed out in method 4');
    }
    return '';
  }
  return '';
}

// Helper functions
async function fetchCaptionUrl(url: string, signal?: AbortSignal): Promise<string> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return '';
    
    const text = await response.text();
    return parseTranscriptResponse(text);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.log('Caption URL fetch timed out');
    }
    return '';
  }
}

function parseTranscriptResponse(text: string): string {
  try {
    // Try JSON first
    if (text.trim().startsWith('{')) {
      const data = JSON.parse(text);
      return extractTranscriptFromJSON(data);
    }
    
    // Try XML
    if (text.includes('<transcript>') || text.includes('<text')) {
      return extractTranscriptFromXML(text);
    }
    
    return '';
  } catch (e) {
    return '';
  }
}

function extractTranscriptFromJSON(data: any): string {
  try {
    if (data.events) {
      return data.events
        .filter((event: any) => event.segs)
        .map((event: any) => 
          event.segs
            .map((seg: any) => seg.utf8 || '')
            .filter(Boolean)
            .join(' ')
        )
        .filter(Boolean)
        .join(' ')
        .trim();
    }
    return '';
  } catch (e) {
    return '';
  }
}

function extractTranscriptFromXML(xml: string): string {
  try {
    const texts = xml.match(/<text[^>]*>(.*?)<\/text>/g) || [];
    return texts
      .map(text => {
        const content = text
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ');
        return content.trim();
      })
      .filter(Boolean)
      .join(' ')
      .trim();
  } catch (e) {
    return '';
  }
}

function extractCaptionUrl(data: any): string {
  try {
    if (Array.isArray(data)) {
      const track = data.find((t: any) => 
        t.languageCode === 'en' || 
        t.vssId?.includes('.en') || 
        t.kind === 'asr'
      );
      return track?.baseUrl || '';
    }
    return '';
  } catch (e) {
    return '';
  }
}

function extractTranscriptFromInnertubeResponse(data: any): string {
  try {
    const transcriptParts = data?.actions?.[0]?.updateEngagementPanelAction
      ?.content?.transcriptRenderer?.content?.transcriptSearchPanelRenderer
      ?.body?.transcriptSegmentListRenderer?.initialSegments || [];
      
    return transcriptParts
      .map((part: any) => part?.transcriptSegmentRenderer?.snippet?.text || '')
      .filter(Boolean)
      .join(' ')
      .trim();
  } catch (e) {
    return '';
  }
} 