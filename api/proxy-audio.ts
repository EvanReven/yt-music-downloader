import type { Request, Response } from 'express';
import { Readable } from 'stream';
import { getAudioStreamInfo } from './youtubeService.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const videoId = req.query.v as string;
    const title = (req.query.title || 'audio') as string;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID (v) diperlukan' });
    }

    const streamInfo = await getAudioStreamInfo(videoId);

    if (!streamInfo.url.startsWith('http')) {
      return res.status(400).json({ error: 'Stream URL tidak valid' });
    }

    const audioRes = await fetch(streamInfo.url);
    if (!audioRes.ok || !audioRes.body) {
      return res.status(502).json({ error: 'Gagal mengambil stream dari server sumber' });
    }

    const safeFilename = title.replace(/[^a-zA-Z0-9_\-\s]/g, '_');
    res.setHeader('Content-Type', 'audio/webm');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.opus"`);

    const nodeStream = Readable.fromWeb(audioRes.body as any);
    return nodeStream.pipe(res);
  } catch (err: any) {
    console.error('Audio Proxy Error:', err);
    return res.status(500).json({ error: 'Gagal melakukan streaming audio' });
  }
}
