import React, { useState, useMemo } from 'react';
import { Download, FileArchive, CheckSquare, Square, Filter, Music2, Sliders, Sparkles, Clock, ListMusic } from 'lucide-react';
import { PlaylistInfo, Track, DownloadQueueItem, ConversionSettings } from '../types';
import { TrackCard } from './TrackCard';
import { formatDuration } from '../lib/youtube';

interface PlaylistViewProps {
  playlist: PlaylistInfo;
  selectedTrackIds: string[];
  onToggleSelectAll: () => void;
  onToggleTrackSelect: (id: string) => void;
  queueMap: Map<string, DownloadQueueItem>;
  settings: ConversionSettings;
  onOpenSettingsModal: () => void;
  onBatchDownloadZip: () => void;
  onDownloadSingleTrack: (track: Track) => void;
  isBatchDownloading: boolean;
  batchProgress: { completed: number; total: number; percent: number };
  playingTrackId: string | null;
  onPlayPreview: (track: Track) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  selectedTrackIds,
  onToggleSelectAll,
  onToggleTrackSelect,
  queueMap,
  settings,
  onOpenSettingsModal,
  onBatchDownloadZip,
  onDownloadSingleTrack,
  isBatchDownloading,
  batchProgress,
  playingTrackId,
  onPlayPreview,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  // Calculate total playlist duration
  const totalSeconds = useMemo(() => {
    return playlist.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  }, [playlist.tracks]);

  // Filter tracks by title or channel
  const filteredTracks = useMemo(() => {
    if (!searchFilter.trim()) return playlist.tracks;
    const lower = searchFilter.toLowerCase();
    return playlist.tracks.filter(
      (t) => t.title.toLowerCase().includes(lower) || t.channel.toLowerCase().includes(lower)
    );
  }, [playlist.tracks, searchFilter]);

  const allFilteredSelected = useMemo(() => {
    if (filteredTracks.length === 0) return false;
    return filteredTracks.every((t) => selectedTrackIds.includes(t.id));
  }, [filteredTracks, selectedTrackIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Playlist Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0d] border border-white/10 p-6 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Thumbnail & Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-black shrink-0 shadow-xl border border-white/10">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono text-indigo-400 font-bold border border-white/10">
                {playlist.trackCount} Trek
              </span>
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
                <ListMusic className="w-3.5 h-3.5" />
                <span>Playlist YouTube</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {playlist.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-2">
                <span>Oleh <strong className="text-gray-200">{playlist.author}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  {formatDuration(totalSeconds)}
                </span>
              </p>
            </div>
          </div>

          {/* Batch Actions Box */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-white/10">
            {/* Format settings button */}
            <button
              onClick={onOpenSettingsModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Pengaturan Format</span>
            </button>

            {/* Batch ZIP / Single Opus download button */}
            <button
              onClick={onBatchDownloadZip}
              disabled={isBatchDownloading || selectedTrackIds.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {selectedTrackIds.length === 1 ? (
                <Download className="w-4 h-4" />
              ) : (
                <FileArchive className="w-4 h-4" />
              )}
              <span>
                {selectedTrackIds.length === 1
                  ? `Download 1 Trek (.${settings.containerFormat.toUpperCase()})`
                  : `Download ${selectedTrackIds.length} Trek (.ZIP ${settings.containerFormat.toUpperCase()})`}
              </span>
            </button>
          </div>
        </div>

        {/* Global Batch Progress Banner */}
        {isBatchDownloading && (
          <div className="mt-6 p-4 rounded-xl bg-[#161616] border border-indigo-500/40 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                Mempersiapkan ZIP Batch Opus ({batchProgress.completed} / {batchProgress.total} Trek)
              </span>
              <span className="font-mono text-sm">{batchProgress.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${batchProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Selection Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-indigo-300 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            {allFilteredSelected ? (
              <>
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Hapus Semua Pilihan</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-gray-500" />
                <span>Pilih Semua ({filteredTracks.length})</span>
              </>
            )}
          </button>

          <span className="text-xs text-gray-400 font-medium">
            Terpilih: <strong className="text-indigo-400">{selectedTrackIds.length}</strong> / {playlist.trackCount}
          </span>
        </div>

        {/* Track Filter Input */}
        <div className="relative max-w-xs w-full">
          <Filter className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari lagu di playlist..."
            className="w-full bg-[#161616] border border-white/10 focus:border-indigo-500/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2.5">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Tidak ada lagu yang cocok dengan pencarian "{searchFilter}".
          </div>
        ) : (
          filteredTracks.map((track) => {
            const queueItem = queueMap.get(track.id);
            return (
              <TrackCard
                key={track.id}
                track={track}
                isSelected={selectedTrackIds.includes(track.id)}
                onToggleSelect={onToggleTrackSelect}
                status={queueItem?.status || 'idle'}
                progress={queueItem?.progress || 0}
                errorMessage={queueItem?.errorMessage}
                isPlaying={playingTrackId === track.id}
                onPlayPreview={onPlayPreview}
                onDownloadSingle={onDownloadSingleTrack}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
