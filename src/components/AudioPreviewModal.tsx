import React, { useState } from 'react';
import { X, Music, Download, Play, ExternalLink } from 'lucide-react';
import { Track } from '../types';

interface AudioPreviewModalProps {
  track: Track | null;
  onClose: () => void;
  onDownloadSingle: (track: Track) => void;
}

export const AudioPreviewModal: React.FC<AudioPreviewModalProps> = ({
  track,
  onClose,
  onDownloadSingle,
}) => {
  const [useDirectAudio, setUseDirectAudio] = useState(false);

  if (!track) return null;

  const embedUrl = `https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&rel=0`;
  const directAudioSrc = `/api/proxy-audio?v=${track.id}&title=${encodeURIComponent(track.title)}&ext=mp3`;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-50 animate-slideUp">
      <div className="rounded-2xl bg-[#0d0d0d]/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl p-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Pratinjau Instan
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Box */}
        {!useDirectAudio ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg mb-3">
            <iframe
              src={embedUrl}
              title={track.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3 text-center">
            <p className="text-xs text-indigo-300 font-medium mb-2">Memutar dari Server Audio Proxy Stream...</p>
            <audio
              src={directAudioSrc}
              controls
              autoPlay
              className="w-full h-10 accent-indigo-500"
            />
          </div>
        )}

        {/* Track Info & Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
            <p className="text-[11px] text-gray-400 truncate">{track.channel}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setUseDirectAudio(!useDirectAudio)}
              className="px-2 py-1 rounded-md text-[10px] font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title={useDirectAudio ? "Gunakan Pemutar Instan" : "Gunakan Stream Proxy"}
            >
              {useDirectAudio ? "Mode Instan" : "Stream Proxy"}
            </button>

            <button
              onClick={() => onDownloadSingle(track)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Audio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

