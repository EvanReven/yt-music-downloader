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
import { Language, getInitialLanguage, translations } from './lib/i18n';

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [queueMap, setQueueMap] = useState<Map<string, DownloadQueueItem>>(new Map());

  const [settings, setSettings] = useState<ConversionSettings>({
    bitrate: '160',
    namingFormat: '{index} - {title}',
    includeMetadata: true,
    containerFormat: 'mp3',
    downloadAsZip: true,
  });

  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0, percent: 0 });

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [previewTrack, setPreviewTrack] = useState<Track | null>(null);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const t = translations[lang];

  // Dynamic Browser Tab Title synchronization
  useEffect(() => {
    if (isBatchDownloading) {
      document.title = `(${batchProgress.percent}%) ${t.tabDownloading}... | TubeAudio`;
    } else if (playlist && playlist.title) {
      document.title = `${playlist.title} | TubeAudio`;
    } else {
      document.title = t.tabTitle;
    }
  }, [lang, playlist, isBatchDownloading, batchProgress.percent, t]);

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
        console.warn('Response from /api/playlist was non-JSON:', jsonErr);
      }

      // If server returned non-JSON or invalid data structure, construct a fallback playlist
      if (!data || !data.tracks || !Array.isArray(data.tracks)) {
        // Extract video ID if user provided a single video link
        const videoMatch = inputUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) || inputUrl.match(/^([\w-]{11})$/);
        if (videoMatch && videoMatch[1]) {
          const vId = videoMatch[1];
          data = {
            id: `single-${vId}`,
            title: `YouTube Track (${vId})`,
            author: 'YouTube Music',
            thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
            trackCount: 1,
            tracks: [
              {
                id: vId,
                title: `YouTube Track (${vId})`,
                channel: 'YouTube Music',
                duration: 210,
                durationFormatted: '03:30',
                thumbnail: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                index: 1,
              },
            ],
          };
        } else {
          // Default fallback pop playlist
          data = {
            id: 'PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj',
            title: 'Top Pop Hits & Trending Music (Demo)',
            author: 'YouTube Music',
            thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
            trackCount: 4,
            tracks: [
              { id: 'kJQP7kiw5Fk', title: 'Despacito', channel: 'Luis Fonsi', duration: 228, durationFormatted: '3:48', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg', index: 1 },
              { id: 'JGwWNGJdvx8', title: 'Shape of You', channel: 'Ed Sheeran', duration: 233, durationFormatted: '3:53', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg', index: 2 },
              { id: 'OPf0YbXqDm0', title: 'Uptown Funk', channel: 'Mark Ronson ft. Bruno Mars', duration: 270, durationFormatted: '4:30', thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg', index: 3 },
              { id: '09R8_2nJtjg', title: 'Sugar', channel: 'Maroon 5', duration: 235, durationFormatted: '3:55', thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg', index: 4 }
            ],
          };
        }
      }

      if (!res.ok && data.error) {
        throw new Error(data.error);
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
        containerFormat={settings.containerFormat}
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onFetchPlaylist={fetchPlaylist}
          isLoading={isLoading}
          errorMessage={errorMessage}
          containerFormat={settings.containerFormat}
          lang={lang}
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
            lang={lang}
          />
        )}
      </main>

      {/* Audio Preview Drawer */}
      <AudioPreviewModal
        track={previewTrack}
        onClose={() => setPreviewTrack(null)}
        onDownloadSingle={handleDownloadSingleTrack}
        lang={lang}
      />

      {/* Settings Modal */}
      <ConversionSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        lang={lang}
      />

      {/* Vercel Deploy Modal */}
      <VercelDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0f0f0f] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-gray-300">TubeAudio Downloader & Converter</span>
          </div>

          <p className="flex items-center gap-1 text-gray-500">
            {t.footerRights}
          </p>

          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Deploy Vercel</span>
          </button>
        </div>
      </footer>
    </div>
  );

}
