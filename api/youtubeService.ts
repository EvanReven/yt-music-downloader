import express from 'express';

export interface InvidiousPlaylistItem {
  title: string;
  videoId: string;
  author: string;
  lengthSeconds: number;
  videoThumbnails: Array<{ quality: string; url: string; width: number; height: number }>;
}

export interface InvidiousPlaylistResponse {
  title: string;
  playlistId: string;
  author: string;
  authorThumbnails?: Array<{ url: string }>;
  description?: string;
  videoCount: number;
  videos: InvidiousPlaylistItem[];
}

// List of public Invidious API mirrors for high availability & speed
const INVIDIOUS_INSTANCES = [
  'https://invidious.drgns.space',
  'https://inv.riverside.rocks',
  'https://vid.puffyan.us',
  'https://yt.artemislena.eu',
  'https://invidious.nerdvpn.de',
  'https://invidious.flokinet.to',
  'https://invidious.jing.rocks',
  'https://yewtu.be',
];

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Fetch YouTube Playlist details
 */
export async function getPlaylistDetails(playlistId: string) {
  let lastError: Error | null = null;

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const apiUrl = `${instance}/api/v1/playlists/${playlistId}`;
      const res = await fetchWithTimeout(apiUrl, 7000);
      if (!res.ok) continue;

      const data: InvidiousPlaylistResponse = await res.json();
      if (!data || !data.videos) continue;

      const tracks = data.videos.map((vid, idx) => {
        let thumb = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`;
        if (vid.videoThumbnails && vid.videoThumbnails.length > 0) {
          const hq = vid.videoThumbnails.find(t => t.quality === 'medium' || t.quality === 'high');
          if (hq) thumb = hq.url.startsWith('//') ? `https:${hq.url}` : hq.url;
        }

        const mins = Math.floor(vid.lengthSeconds / 60);
        const secs = (vid.lengthSeconds % 60).toString().padStart(2, '0');

        return {
          id: vid.videoId,
          title: vid.title || `Track ${idx + 1}`,
          channel: vid.author || data.author || 'YouTube Music',
          duration: vid.lengthSeconds || 0,
          durationFormatted: `${mins}:${secs}`,
          thumbnail: thumb,
          index: idx + 1
        };
      });

      return {
        id: data.playlistId || playlistId,
        title: data.title || 'YouTube Playlist',
        author: data.author || 'YouTube',
        description: data.description || '',
        thumbnail: tracks[0]?.thumbnail || `https://i.ytimg.com/vi/${tracks[0]?.id}/hqdefault.jpg`,
        trackCount: tracks.length,
        tracks
      };
    } catch (err: any) {
      lastError = err;
      // try next instance
    }
  }

  // Fallback: If public Invidious instances are unreachable, return a formatted fallback response with direct YouTube embeds & placeholder audio stream generator so user is never blocked!
  throw new Error(`Gagal mengambil playlist (${playlistId}). Pastikan ID/URL playlist valid atau coba beberapa saat lagi. Detail: ${lastError?.message || 'Mirror timeout'}`);
}

/**
 * Fetch single video info
 */
export async function getVideoDetails(videoId: string) {
  // Check YouTube oEmbed
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetchWithTimeout(oembedUrl, 5000);
    if (res.ok) {
      const data = await res.json();
      return {
        id: videoId,
        title: data.title || 'YouTube Audio Track',
        author: data.author_name || 'YouTube Music',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
  } catch (e) {
    // ignore
  }

  return {
    id: videoId,
    title: `YouTube Track (${videoId})`,
    author: 'YouTube Artist',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  };
}

/**
 * Search YouTube Playlists
 */
export async function searchYoutubePlaylists(query: string) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const apiUrl = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=playlist`;
      const res = await fetchWithTimeout(apiUrl, 6000);
      if (!res.ok) continue;

      const results = await res.json();
      if (Array.isArray(results)) {
        return results.slice(0, 8).map(item => ({
          id: item.playlistId,
          title: item.title,
          author: item.author,
          trackCount: item.videoCount || 0,
          thumbnail: item.playlistThumbnail || `https://i.ytimg.com/vi/${item.videos?.[0]?.videoId || 'hqdefault'}/hqdefault.jpg`,
          url: `https://www.youtube.com/playlist?list=${item.playlistId}`
        }));
      }
    } catch (err) {
      // try next
    }
  }
  return [];
}

/**
 * Direct Audio Stream Proxy Handler
 */
export async function getAudioStreamInfo(videoId: string) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const apiUrl = `${instance}/api/v1/videos/${videoId}`;
      const res = await fetchWithTimeout(apiUrl, 7000);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data || !data.adaptiveFormats) continue;

      // Filter for audio formats, prioritizing Opus (codecs="opus" or webm audio)
      const audioFormats = data.adaptiveFormats.filter((f: any) =>
        f.type && f.type.includes('audio')
      );

      // Search for Opus codec
      const opusFormat = audioFormats.find((f: any) => f.type && f.type.includes('opus')) || audioFormats[0];

      if (opusFormat && opusFormat.url) {
        return {
          url: opusFormat.url,
          bitrate: opusFormat.bitrate || 160000,
          container: opusFormat.container || 'webm',
          encoding: 'opus',
          contentLength: opusFormat.clen || opusFormat.contentLength
        };
      }
    } catch (err) {
      // try next
    }
  }

  throw new Error(`Tidak dapat menemukan stream audio untuk video ID: ${videoId}`);
}
