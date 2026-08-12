import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles, AlertCircle, ArrowRight, Music2, ListMusic, RefreshCw } from 'lucide-react';
import { DemoPlaylist } from '../types';
import { DEMO_PLAYLISTS } from '../lib/opusConverter';

interface HeroSectionProps {
  onFetchPlaylist: (input: string) => void;
  isLoading: boolean;
  errorMessage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFetchPlaylist,
  isLoading,
  errorMessage,
}) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onFetchPlaylist(inputUrl.trim());
    }
  };

  const handleDemoClick = (demo: DemoPlaylist) => {
    setInputUrl(demo.url);
    onFetchPlaylist(demo.url);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#0a0a0a]">
      {/* Background Subtle Indigo Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Main Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
          <span>Format Opus Audio (RFC 6716) • Efisiensi Tinggi & Suara Jernih</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Download Playlist YouTube ke{' '}
          <span className="text-indigo-500">
            Format Opus
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
          Masukkan link playlist YouTube atau kata kunci pencarian. Konversi audio otomatis ke format <strong className="text-gray-200 font-semibold">.opus</strong> hemat ruang dengan kualitas studio.
        </p>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-2xl shadow-indigo-950/40 rounded-2xl bg-[#161616] border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2">
            <div className="pl-3 pr-2 text-gray-400 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-400" />
            </div>

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Tempel link playlist/video YouTube (cth: https://www.youtube.com/playlist?list=...)"
              className="w-full bg-transparent py-2.5 px-2 text-white text-sm placeholder:text-gray-500 focus:outline-none"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Muat Playlist</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Banner if any */}
        {errorMessage && (
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 text-left animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-red-200">Gagal Memuat Playlist</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Demo Playlists Section */}
        <div className="mt-10 text-left max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
            <ListMusic className="w-4 h-4 text-indigo-400" />
            <span>Atau Coba Contoh Playlist Populer Ini:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_PLAYLISTS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleDemoClick(demo)}
                disabled={isLoading}
                className="group flex items-center gap-3 p-3 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-indigo-500/30 transition-all text-left"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-white/10">
                  <img
                    src={demo.thumbnail}
                    alt={demo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {demo.tag} • {demo.count} Lagu
                  </span>
                  <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-indigo-300 transition-colors">
                    {demo.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">{demo.author}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
