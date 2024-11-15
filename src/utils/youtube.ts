import { YouTubeMetadata } from "@/types/youtube";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const fetchYouTubeMetadata = async (url: string): Promise<YouTubeMetadata | null> => {
  try {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    if (!data.items || data.items.length === 0) return null;

    const video = data.items[0];
    return {
      thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
      views: new Intl.NumberFormat('en-US', { notation: 'compact' }).format(video.statistics.viewCount),
      likes: new Intl.NumberFormat('en-US', { notation: 'compact' }).format(video.statistics.likeCount),
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}; 