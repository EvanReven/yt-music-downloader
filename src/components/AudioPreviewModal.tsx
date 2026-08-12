import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Music, Download } from 'lucide-react';
import { Track } from '../types';
import { formatDuration } from '../lib/youtube';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (track) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [track]);

  if (!track) return null;

  const audioSrc = `/api/proxy-audio?v=${track.id}&title=${encodeURIComponent(track.title)}&ext=opus`;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slideUp">
      <div className="rounded-2xl bg-[#0d0d0d]/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl p-4 text-white">
        <audio
          ref={audioRef}
          src={audioSrc}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Preview Opus Stream
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track info */}
        <div className="flex items-center gap-3">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
            <p className="text-[11px] text-gray-400 truncate">{track.channel}</p>
          </div>
        </div>

        {/* Scrub Bar */}
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={duration || track.duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/10 accent-indigo-500 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration || track.duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => onDownloadSingle(track)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-indigo-300 transition-colors"
            title="Download Opus"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
