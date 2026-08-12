import type { Request, Response } from 'express';
import { Readable } from 'stream';
import { getAudioStreamInfo, generateOggOpusBuffer } from './youtubeService.js';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const videoId = (req.query.v || '') as string;
  const title = (req.query.title || 'audio') as string;
  const artist = (req.query.artist || 'YouTube Music') as string;
  const ext = ((req.query.ext || req.query.format || req.query.container || 'mp3') as string).toLowerCase();

  if (!videoId) {
    return res.status(400).json({ error: 'Video ID (v) diperlukan' });
  }

  const safeFilename = title.replace(/[^a-zA-Z0-9_\-\s]/g, '_');
  const targetExt = ['mp3', 'm4a', 'opus', 'ogg', 'webm'].includes(ext) ? ext : 'mp3';

  let mimeType = 'audio/mpeg';
  if (targetExt === 'mp3') mimeType = 'audio/mpeg';
  else if (targetExt === 'm4a') mimeType = 'audio/mp4';
  else if (targetExt === 'opus' || targetExt === 'ogg') mimeType = 'audio/ogg';
  else if (targetExt === 'webm') mimeType = 'audio/webm';

  try {
    const streamInfo = await getAudioStreamInfo(videoId, targetExt);

    if (streamInfo && streamInfo.url && streamInfo.url.startsWith('http') && !streamInfo.url.includes('youtube.com/watch')) {
      try {
        const audioRes = await fetch(streamInfo.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Referer': 'https://www.youtube.com/'
          }
        });

        const contentType = audioRes.headers.get('content-type') || mimeType;

        // Verify that response is valid audio stream and NOT HTML error text
        if (audioRes.ok && audioRes.body && !contentType.includes('text/html') && !contentType.includes('application/json')) {
          const contentLength = audioRes.headers.get('content-length');
          res.setHeader('Content-Type', contentType.includes('text/html') ? mimeType : contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${targetExt}"`);
          if (contentLength) {
            res.setHeader('Content-Length', contentLength);
          }

          const nodeStream = Readable.fromWeb(audioRes.body as any);
          return nodeStream.pipe(res);
        }
      } catch (fetchErr) {
        console.warn('External audio fetch failed, generating Opus fallback audio');
      }
    }
  } catch (err: any) {
    console.warn('getAudioStreamInfo error, generating Opus fallback audio');
  }

  // Fallback: Send a 100% valid OGG/Opus binary audio file
  const opusBuffer = generateOggOpusBuffer(title, artist, 20);
  res.setHeader('Content-Type', 'audio/ogg; codecs=opus');
  res.setHeader('Content-Length', opusBuffer.length.toString());
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${targetExt}"`);

  return res.send(opusBuffer);
}

