export interface Track {
  id: string;
  title: string;
  channel: string;
  duration: number; // in seconds
  durationFormatted: string;
  thumbnail: string;
  index: number;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  author: string;
  description?: string;
  thumbnail: string;
  trackCount: number;
  tracks: Track[];
}

export type OpusBitrate = '64' | '128' | '160' | '192' | '256';

export interface ConversionSettings {
  bitrate: OpusBitrate;
  namingFormat: '{index} - {title}' | '{artist} - {title}' | '{title}';
  includeMetadata: boolean;
  containerFormat: 'mp3' | 'm4a' | 'opus' | 'ogg' | 'webm';
  downloadAsZip: boolean;
}

export type DownloadStatus = 'idle' | 'pending' | 'fetching' | 'converting' | 'completed' | 'error';

export interface DownloadQueueItem {
  track: Track;
  status: DownloadStatus;
  progress: number; // 0 to 100
  downloadUrl?: string;
  blob?: Blob;
  errorMessage?: string;
  sizeFormatted?: string;
}

export interface DemoPlaylist {
  id: string;
  title: string;
  author: string;
  count: number;
  thumbnail: string;
  url: string;
  tag: string;
}
