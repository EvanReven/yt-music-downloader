import type { Request, Response } from 'express';
import { searchYoutubePlaylists } from './youtubeService.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const q = (req.query.q || req.query.query || '') as string;
    if (!q) {
      return res.status(400).json({ error: 'Kata kunci pencarian tidak boleh kosong' });
    }
    const results = await searchYoutubePlaylists(q);
    return res.json({ query: q, results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal melakukan pencarian' });
  }
}
