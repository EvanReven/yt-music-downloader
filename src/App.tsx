import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PlaylistView } from './components/PlaylistView';
import { ConversionSettingsModal } from './components/ConversionSettingsModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { AudioPreviewModal } from './components/AudioPreviewModal';
import { PlaylistInfo, Track, ConversionSettings, DownloadQueueItem } from './types';
import { triggerSingleDownload, downloadPlaylistAsZip, DEMO_PLAYLISTS } from './lib/opusConverter';
import { Sparkles, Heart, Server } from 'lucide-react';

export default function App() {
  const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [queueMap, setQueueMap] = useState<Map<string, DownloadQueueItem>>(new Map());

  const [settings, setSettings] = useState<ConversionSettings>({
    bitrate: '160',
    namingFormat: '{index} - {title}',
    includeMetadata: true,
    containerFormat: 'opus',
    downloadAsZip: true,
  });

  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0, percent: 0 });

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [previewTrack, setPreviewTrack] = useState<Track | null>(null);

  // Load initial demo playlist on first start
  useEffect(() => {
    fetchPlaylist(DEMO_PLAYLISTS[0].url);
  }, []);

  const fetchPlaylist = async (inputUrl: string) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    try {
      const res = await fetch(`/api/playlist?url=${encodeURIComponent(inputUrl)}`);
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Gagal membaca data server. Silakan coba lagi beberapa saat.');
      }

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}: Gagal memuat playlist`);
      }

      if (!data || !data.tracks || data.tracks.length === 0) {
        throw new Error('Playlist tidak ditemukan atau tidak memiliki trek audio.');
      }

      setPlaylist(data);
      // Default select all tracks
      setSelectedTrackIds(data.tracks.map((t: Track) => t.id));
      setQueueMap(new Map());
    } catch (err: any) {
      console.error('Fetch Playlist Error:', err);
      setErrorMessage(err.message || 'Gagal memproses URL/Playlist YouTube.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTrackSelect = (id: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (!playlist) return;
    if (selectedTrackIds.length === playlist.tracks.length) {
      setSelectedTrackIds([]);
    } else {
      setSelectedTrackIds(playlist.tracks.map((t) => t.id));
    }
  };

  const updateQueueStatus = (
    trackId: string,
    status: DownloadQueueItem['status'],
    progress: number,
    errorMessage?: string
  ) => {
    setQueueMap((prev: Map<string, DownloadQueueItem>) => {
      const next = new Map<string, DownloadQueueItem>(prev);
      const existing = next.get(trackId);
      if (existing) {
        next.set(trackId, {
          track: existing.track,
          status,
          progress,
          errorMessage,
          downloadUrl: existing.downloadUrl,
          blob: existing.blob,
          sizeFormatted: existing.sizeFormatted,
        });
      } else {
        const track = playlist?.tracks.find((t) => t.id === trackId);
        if (track) {
          next.set(trackId, { track, status, progress, errorMessage });
        }
      }
      return next;
    });
  };

  const handleDownloadSingleTrack = async (track: Track) => {
    updateQueueStatus(track.id, 'fetching', 15);
    try {
      await triggerSingleDownload(track, settings, (percent) => {
        updateQueueStatus(track.id, 'converting', percent);
      });
      updateQueueStatus(track.id, 'completed', 100);
    } catch (err: any) {
      updateQueueStatus(track.id, 'error', 0, err.message || 'Gagal mengunduh');
    }
  };

  const handleBatchDownloadZip = async () => {
    if (!playlist || selectedTrackIds.length === 0) return;

    setIsBatchDownloading(true);
    setBatchProgress({ completed: 0, total: selectedTrackIds.length, percent: 0 });

    const tracksToDownload = playlist.tracks.filter((t) => selectedTrackIds.includes(t.id));

    try {
      await downloadPlaylistAsZip(
        playlist.title,
        tracksToDownload,
        settings,
        (trackId, percent, statusText) => {
          updateQueueStatus(trackId, 'converting', percent);
        },
        (completed, total, overallPercent) => {
          setBatchProgress({ completed, total, percent: overallPercent });
        }
      );
    } catch (err) {
      console.error('Batch ZIP Download Error:', err);
    } finally {
      setIsBatchDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        bitrate={settings.bitrate}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onFetchPlaylist={fetchPlaylist}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        {/* Playlist Content View */}
        {playlist && (
          <PlaylistView
            playlist={playlist}
            selectedTrackIds={selectedTrackIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleTrackSelect={handleToggleTrackSelect}
            queueMap={queueMap}
            settings={settings}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onBatchDownloadZip={handleBatchDownloadZip}
            onDownloadSingleTrack={handleDownloadSingleTrack}
            isBatchDownloading={isBatchDownloading}
            batchProgress={batchProgress}
            playingTrackId={previewTrack?.id || null}
            onPlayPreview={(track) => setPreviewTrack(track)}
          />
        )}
      </main>

      {/* Audio Preview Drawer */}
      <AudioPreviewModal
        track={previewTrack}
        onClose={() => setPreviewTrack(null)}
        onDownloadSingle={handleDownloadSingleTrack}
      />

      {/* Settings Modal */}
      <ConversionSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
      />

      {/* Vercel Deploy Modal */}
      <VercelDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-gray-300">TubeOpus Downloader & Converter</span>
          </div>

          <p className="flex items-center gap-1 text-gray-500">
            Dibuat untuk streaming audio efisiensi tinggi dengan format Opus (Ogg/WebM). Siap deploy di Vercel.
          </p>

          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Deploy ke Vercel</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
