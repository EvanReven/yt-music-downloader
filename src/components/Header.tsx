import React from 'react';
import { Music, Server, Sparkles, HelpCircle, FileText } from 'lucide-react';

interface HeaderProps {
  onOpenDeployModal: () => void;
  onOpenSettingsModal: () => void;
  bitrate: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeployModal,
  onOpenSettingsModal,
  bitrate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0f0f0f]/90 border-b border-white/10 text-gray-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Tube<span className="text-indigo-500">Opus</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
                Opus v1.0
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              YouTube Playlist to Opus Converter & Downloader
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Bitrate Badge */}
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title="Pengaturan Format Opus"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Format: <strong className="text-indigo-300">{bitrate} kbps Opus</strong></span>
          </button>

          {/* Vercel Deploy Guide Button */}
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hosting di Vercel</span>
            <span className="sm:hidden">Vercel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
