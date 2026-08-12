import express, { Request, Response } from 'express';
import { getPlaylistDetails, getVideoDetails, searchYoutubePlaylists, getAudioStreamInfo } from './youtubeService';

const app = express();

app.use(express.json());

// CORS headers for deployment flexibility
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Express',
  });
});

// Playlist fetch endpoint
app.get('/api/playlist', async (req: Request, res: Response) => {
  try {
    const playlistId = (req.query.id || req.query.playlistId || '') as string;
    const url = (req.query.url || '') as string;

    let targetId = playlistId;

    if (!targetId && url) {
      const match = url.match(/[?&]list=([^#&?]+)/);
      if (match && match[1]) {
        targetId = match[1];
      } else {
        // Check if single video URL
        const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (videoMatch && videoMatch[1]) {
          const videoInfo = await getVideoDetails(videoMatch[1]);
          return res.json({
            id: `single-${videoMatch[1]}`,
            title: videoInfo.title,
            author: videoInfo.author,
            thumbnail: videoInfo.thumbnail,
            trackCount: 1,
            tracks: [
              {
                id: videoMatch[1],
                title: videoInfo.title,
                channel: videoInfo.author,
                duration: 210,
                durationFormatted: '03:30',
                thumbnail: videoInfo.thumbnail,
                index: 1,
              },
            ],
          });
        }
      }
    }

    if (!targetId) {
      return res.status(400).json({ error: 'Parameter playlist id atau URL tidak ditemukan' });
    }

    const playlist = await getPlaylistDetails(targetId);
    return res.json(playlist);
  } catch (err: any) {
    console.error('Playlist Fetch Error:', err);
    return res.status(500).json({
      error: err.message || 'Gagal memproses data playlist. Silakan coba ID/URL lain.',
    });
  }
});

// Search playlist endpoint
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q || req.query.query || '') as string;
    if (!q) {
      return res.status(400).json({ error: 'Query pencarian tidak boleh kosong' });
    }

    const results = await searchYoutubePlaylists(q);
    return res.json({ query: q, results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mencari playlist' });
  }
});

// Audio info endpoint
app.get('/api/audio-info', async (req: Request, res: Response) => {
  try {
    const videoId = req.query.v as string;
    if (!videoId) {
      return res.status(400).json({ error: 'Parameter v (Video ID) wajib diisi' });
    }

    const info = await getAudioStreamInfo(videoId);
    return res.json(info);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengambil audio stream' });
  }
});

// Direct Opus Audio Proxy Stream Endpoint
app.get('/api/proxy-audio', async (req: Request, res: Response) => {
  try {
    const videoId = req.query.v as string;
    const title = (req.query.title || 'audio') as string;
    const extension = (req.query.ext || 'opus') as string;

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID wajib diisi' });
    }

    const streamInfo = await getAudioStreamInfo(videoId);
    
    const audioRes = await fetch(streamInfo.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!audioRes.ok || !audioRes.body) {
      return res.status(502).json({ error: 'Gagal mengambil stream dari sumber YouTube' });
    }

    // Set headers for Opus download
    const filename = `${title.replace(/[^a-zA-Z0-9 _-]/g, '')}.${extension}`;
    
    res.setHeader('Content-Type', extension === 'opus' ? 'audio/opus' : 'audio/webm');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    if (streamInfo.contentLength) {
      res.setHeader('Content-Length', streamInfo.contentLength);
    }

    // Stream the response directly to Express output
    const reader = audioRes.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };

    await pump();
  } catch (err: any) {
    console.error('Proxy Audio Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Gagal mengunduh audio stream' });
    }
  }
});

export default app;
