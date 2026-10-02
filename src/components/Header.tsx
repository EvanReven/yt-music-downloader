import React from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface HeaderProps {
  onOpenSettingsModal: () => void;
  bitrate: string;
  containerFormat: string;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettingsModal,
  bitrate,
  containerFormat,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0f0f0f]/90 border-b border-white/10 text-gray-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <img src="/favicon.svg" alt="TubeAudio Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Tube<span className="text-indigo-400">Audio</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
                .{containerFormat.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              {t.headerSub}
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title={lang === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Audio Bitrate Badge */}
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title={t.settingsTitle}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.formatLabel}: <strong className="text-indigo-300">{bitrate} kbps .{containerFormat.toUpperCase()}</strong></span>
          </button>
        </div>
      </div>
    </header>
  );
};

