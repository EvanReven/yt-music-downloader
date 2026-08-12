import type { Request, Response } from 'express';
import { getPlaylistDetails, getVideoDetails } from './youtubeService.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const playlistId = (req.query.id || req.query.playlistId || '') as string;
    const url = ((req.query.url || '') as string).trim();

    let targetId = playlistId;

    if (!targetId && url) {
      const listMatch = url.match(/[?&]list=([^#&?]+)/);
      if (listMatch && listMatch[1]) {
        targetId = listMatch[1];
      } else if (/^(PL|UU|RD|OLAK|FL|LL|TL)[a-zA-Z0-9_-]{10,}$/.test(url)) {
        targetId = url;
      } else {
        const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) || url.match(/^([\w-]{11})$/);
        if (videoMatch && videoMatch[1]) {
          const videoId = videoMatch[1];
          const videoInfo = await getVideoDetails(videoId);
          return res.json({
            id: `single-${videoId}`,
            title: videoInfo.title,
            author: videoInfo.author,
            thumbnail: videoInfo.thumbnail,
            trackCount: 1,
            tracks: [
              {
                id: videoId,
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
      targetId = 'PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj';
    }

    const playlist = await getPlaylistDetails(targetId);
    return res.json(playlist);
  } catch (err: any) {
    console.error('Playlist Fetch Error:', err);
    return res.status(200).json({
      id: 'PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj',
      title: 'Top Pop Hits & Trending Music (Fallback)',
      author: 'YouTube Music',
      description: 'Fallback dataset',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
      trackCount: 3,
      tracks: [
        { id: 'kJQP7kiw5Fk', title: 'Despacito', channel: 'Luis Fonsi', duration: 228, durationFormatted: '3:48', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg', index: 1 },
        { id: 'JGwWNGJdvx8', title: 'Shape of You', channel: 'Ed Sheeran', duration: 233, durationFormatted: '3:53', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg', index: 2 },
        { id: 'OPf0YbXqDm0', title: 'Uptown Funk', channel: 'Mark Ronson ft. Bruno Mars', duration: 270, durationFormatted: '4:30', thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg', index: 3 },
      ]
    });
  }
}
