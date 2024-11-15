// Create a new file for metadata fetching
export async function fetchYouTubeMetadata(videoId: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced to 5s

  try {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is missing??');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
      {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
        cache: 'no-store' // Disable caching for serverless
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items?.[0]) {
      throw new Error('Video not found');
    }

    const { snippet, statistics } = data.items[0];
    
    return {
      thumbnail: snippet.thumbnails?.maxres?.url || 
                snippet.thumbnails?.high?.url || 
                snippet.thumbnails?.medium?.url || '',
      views: formatNumber(statistics.viewCount),
      likes: formatNumber(statistics.likeCount),
      title: snippet.title || 'Untitled',
      channelTitle: snippet.channelTitle || 'Unknown Channel',
      publishedAt: new Date(snippet.publishedAt).toLocaleDateString()
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Metadata fetch error:', error);
    return null;
  }
}

function formatNumber(num: string | number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Number(num) || 0);
} 