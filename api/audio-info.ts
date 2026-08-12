import type { Request, Response } from 'express';
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
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID (v) diperlukan' });
    }
    const streamInfo = await getAudioStreamInfo(videoId);
    return res.json(streamInfo);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengambil info stream audio' });
  }
}
