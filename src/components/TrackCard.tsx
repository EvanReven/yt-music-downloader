import React from 'react';
import { Play, Pause, Download, CheckCircle2, AlertCircle, RefreshCw, Music } from 'lucide-react';
import { Track, DownloadStatus } from '../types';
import { Language, translations } from '../lib/i18n';

interface TrackCardProps {
  track: Track;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  status: DownloadStatus;
  progress: number;
  errorMessage?: string;
  isPlaying: boolean;
  onPlayPreview: (track: Track) => void;
  onDownloadSingle: (track: Track) => void;
  containerFormat?: string;
  lang?: Language;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isSelected,
  onToggleSelect,
  status,
  progress,
  errorMessage,
  isPlaying,
  onPlayPreview,
  onDownloadSingle,
  containerFormat = 'mp3',
  lang = 'id',
}) => {
  const t = translations[lang];

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
        isSelected
          ? 'bg-[#181818] border-indigo-500/40 shadow-lg shadow-indigo-950/20'
          : 'bg-[#141414] hover:bg-[#181818] border-white/5 hover:border-white/10'
      }`}
    >
      {/* Checkbox + Thumbnail + Track Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(track.id)}
          className="w-4 h-4 rounded border-white/20 bg-[#0d0d0d] text-indigo-500 accent-indigo-500 cursor-pointer"
        />

        {/* Index */}
        <span className="text-xs font-mono font-bold text-gray-500 w-6 text-center shrink-0">
          {track.index < 10 ? `0${track.index}` : track.index}
        </span>

        {/* Thumbnail with Overlay Play Button */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#0d0d0d] shrink-0 border border-white/10 group/thumb">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover opacity-90 group-hover/thumb:opacity-100"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => onPlayPreview(track)}
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              isPlaying ? 'bg-black/70 opacity-100' : 'bg-black/50 opacity-0 group-hover/thumb:opacity-100'
            }`}
            title={isPlaying ? 'Pause Preview' : t.previewAudio}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-indigo-400 fill-indigo-400" />
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
            {track.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
            <span className="truncate">{track.channel}</span>
            <span>•</span>
            <span className="font-mono">{track.durationFormatted}</span>
          </div>

          {/* Progress Bar for Active Download */}
          {status === 'converting' || status === 'fetching' ? (
            <div className="mt-2 w-full max-w-xs">
              <div className="flex justify-between text-[10px] text-indigo-400 font-mono mb-0.5">
                <span>{t.downloadingAudio}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {errorMessage && (
            <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right Controls: Single Download & Status */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
        {status === 'completed' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETED</span>
          </span>
        )}

        <button
          onClick={() => onDownloadSingle(track)}
          disabled={status === 'converting' || status === 'fetching'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            status === 'completed'
              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
              : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }`}
          title={`${t.downloadTrack} (.${containerFormat.toLowerCase()})`}
        >
          {status === 'converting' || status === 'fetching' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>.{containerFormat.toLowerCase()}</span>
        </button>
      </div>
    </div>
  );
};

