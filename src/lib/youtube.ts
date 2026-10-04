import { Track } from '../types';

/**
 * Extracts YouTube Playlist ID or Video ID from user input
 */
export function extractYoutubeId(input: string): { type: 'playlist' | 'video' | 'search'; id: string } {
  const trimmed = input.trim();

  // Check for playlist parameter in URL
  const listMatch = trimmed.match(/[?&]list=([^#&?]+)/);
  if (listMatch && listMatch[1]) {
    return { type: 'playlist', id: listMatch[1] };
  }

  // Check for direct playlist ID (starts with PL, UU, RD, OLAK, etc. or long alphanumeric)
  if (/^(PL|UU|RD|OLAK|FL|LL|TL)[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return { type: 'playlist', id: trimmed };
  }

  // Check for standard YouTube video URLs
  const videoMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (videoMatch && videoMatch[1]) {
    return { type: 'video', id: videoMatch[1] };
  }

  // Check for direct 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  // Otherwise treat as search query
  return { type: 'search', id: trimmed };
}

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${minsStr}:${secsStr}`;
  }
  return `${minsStr}:${secsStr}`;
}

/**
 * Sanitize strings for valid Windows / POSIX file names
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:\*\?"<>\|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build file name according to user format pattern
 */
export function buildFilename(
  track: Track,
  pattern: '{index} - {title}' | '{artist} - {title}' | '{title}',
  extension: string = 'mp3'
): string {
  const indexStr = track.index < 10 ? `0${track.index}` : `${track.index}`;
  const cleanTitle = sanitizeFilename(track.title);
  const cleanArtist = sanitizeFilename(track.channel || 'YouTube Music');

  let base = '';
  switch (pattern) {
    case '{index} - {title}':
      base = `${indexStr} - ${cleanTitle}`;
      break;
    case '{artist} - {title}':
      base = `${cleanArtist} - ${cleanTitle}`;
      break;
    case '{title}':
    default:
      base = cleanTitle;
      break;
  }

  return `${base}.${extension}`;
}

/**
 * Format bytes to readable string (MB, KB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
