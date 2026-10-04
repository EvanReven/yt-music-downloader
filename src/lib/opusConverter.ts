import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Track, ConversionSettings, DemoPlaylist } from '../types';
import { buildFilename, formatBytes } from './youtube';

export const DEMO_PLAYLISTS: DemoPlaylist[] = [
  {
    id: 'PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj',
    title: 'Top Pop Hits & Trending Music',
    author: 'YouTube Music',
    count: 25,
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj',
    tag: 'Pop / Hit'
  },
  {
    id: 'PLOHoVaTp8R7d159t3MylN13QllJ_0S-k7',
    title: 'Lofi Beats to Study / Relax',
    author: 'Lofi Girl',
    count: 18,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/playlist?list=PLOHoVaTp8R7d159t3MylN13QllJ_0S-k7',
    tag: 'Lofi & Chill'
  },
  {
    id: 'PL4fGSI1pDJn6jXS_O_lF8wU2A7y7Y3N8q',
    title: 'Indo Hits & Pop Nusantara',
    author: 'Musik Indonesia',
    count: 20,
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/playlist?list=PL4fGSI1pDJn6jXS_O_lF8wU2A7y7Y3N8q',
    tag: 'Pop Indonesia'
  },
  {
    id: 'PLfP6i5T0-DkL_S1-nO3Jk5-Yg2Xf3GzJ4',
    title: 'Synthwave & Retrowave Essentials',
    author: 'Retro Vibes',
    count: 15,
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/playlist?list=PLfP6i5T0-DkL_S1-nO3Jk5-Yg2Xf3GzJ4',
    tag: 'Synthwave'
  }
];

/**
 * Fetch a single audio track as Blob with progress reporting
 */
export async function downloadTrackAudioBlob(
  track: Track,
  settings: ConversionSettings,
  onProgress?: (percent: number) => void
): Promise<{ blob: Blob; filename: string }> {
  const filename = buildFilename(track, settings.namingFormat, settings.containerFormat);
  const streamUrl = `/api/proxy-audio?v=${track.id}&title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.channel || '')}&ext=${settings.containerFormat}`;

  try {
    if (onProgress) onProgress(15);

    const response = await fetch(streamUrl);
    if (!response.ok) {
      throw new Error(`Gagal mengunduh audio (${response.statusText})`);
    }

    if (onProgress) onProgress(40);

    const contentType = response.headers.get('content-type') || 'audio/ogg';
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    let loaded = 0;
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;

        if (total > 0 && onProgress) {
          const pct = Math.min(95, Math.round(40 + (loaded / total) * 55));
          onProgress(pct);
        }
      }
    } else {
      const arrayBuf = await response.arrayBuffer();
      chunks.push(new Uint8Array(arrayBuf));
    }

    if (onProgress) onProgress(98);

    // Combine chunks into single Blob
    const blob = new Blob(chunks, { type: contentType });

    if (onProgress) onProgress(100);

    return { blob, filename };
  } catch (err: any) {
    console.error(`Error downloading track ${track.title}:`, err);
    throw err;
  }
}

/**
 * Download a single track directly to user disk
 */
export async function triggerSingleDownload(
  track: Track,
  settings: ConversionSettings,
  onProgress?: (percent: number) => void
): Promise<void> {
  const { blob, filename } = await downloadTrackAudioBlob(track, settings, onProgress);
  saveAs(blob, filename);
}

/**
 * Batch Download multiple tracks into a single ZIP file
 */
export async function downloadPlaylistAsZip(
  playlistTitle: string,
  tracks: Track[],
  settings: ConversionSettings,
  onTrackProgress?: (trackId: string, percent: number, status: string) => void,
  onTotalProgress?: (completedCount: number, totalCount: number, overallPercent: number) => void
): Promise<void> {
  // If only 1 track is selected, download directly as .opus file without compression
  if (tracks.length === 1) {
    const track = tracks[0];
    if (onTrackProgress) onTrackProgress(track.id, 10, 'Mengunduh stream...');
    const { blob, filename } = await downloadTrackAudioBlob(
      track,
      settings,
      (pct) => {
        if (onTrackProgress) onTrackProgress(track.id, pct, `Proses ${pct}%`);
      }
    );
    if (onTrackProgress) onTrackProgress(track.id, 100, 'Selesai');
    if (onTotalProgress) onTotalProgress(1, 1, 100);
    saveAs(blob, filename);
    return;
  }

  const zip = new JSZip();
  const folder = zip.folder(playlistTitle.replace(/[^a-zA-Z0-9 _-]/g, '_') || 'MP3_Playlist');

  let completed = 0;
  const total = tracks.length;

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (onTrackProgress) onTrackProgress(track.id, 10, 'Mengunduh stream...');

    try {
      const { blob, filename } = await downloadTrackAudioBlob(
        track,
        settings,
        (pct) => {
          if (onTrackProgress) onTrackProgress(track.id, pct, `Proses ${pct}%`);
        }
      );

      // Add to ZIP
      if (folder) {
        folder.file(filename, blob);
      }

      completed++;
      if (onTrackProgress) onTrackProgress(track.id, 100, 'Selesai disiapkan');

      const overallPct = Math.round((completed / total) * 90);
      if (onTotalProgress) onTotalProgress(completed, total, overallPct);
    } catch (err: any) {
      if (onTrackProgress) onTrackProgress(track.id, 0, `Gagal: ${err.message || 'Error'}`);
    }
  }

  // Generate ZIP file
  if (onTotalProgress) onTotalProgress(completed, total, 92);
  const zipBlob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      const pct = Math.round(92 + (metadata.percent / 100) * 8);
      if (onTotalProgress) onTotalProgress(completed, total, Math.min(100, pct));
    }
  );

  const cleanZipName = `${playlistTitle.replace(/[^a-zA-Z0-9 _-]/g, '_') || 'Playlist'}_MP3.zip`;
  saveAs(zipBlob, cleanZipName);
}
