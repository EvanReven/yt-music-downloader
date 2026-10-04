import React from 'react';
import { X, Sliders, Check, FileAudio, Info, Tag } from 'lucide-react';
import { ConversionSettings, OpusBitrate } from '../types';
import { Language, translations } from '../lib/i18n';

interface ConversionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ConversionSettings;
  onUpdateSettings: (newSettings: Partial<ConversionSettings>) => void;
  lang?: Language;
}

export const ConversionSettingsModal: React.FC<ConversionSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lang = 'id',
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const bitrates: Array<{ id: OpusBitrate; label: string; desc: string }> = [
    { id: '64', label: '64 kbps', desc: t.ecoQuality },
    { id: '128', label: '128 kbps', desc: t.standardQuality },
    { id: '160', label: '160 kbps', desc: t.nativeQuality },
    { id: '192', label: '192 kbps', desc: lang === 'id' ? 'Kualitas Tinggi' : 'High Quality' },
    { id: '256', label: '256 kbps', desc: 'Ultra High Fidelity' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">{t.settingsTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-4">
          {/* Bitrate Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {t.bitrateLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bitrates.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onUpdateSettings({ bitrate: b.id })}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    settings.bitrate === b.id
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                      : 'bg-[#141414] hover:bg-[#1a1a1a] border-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm">{b.label}</span>
                    {settings.bitrate === b.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Container Extension Format (MP3 Exclusive) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {t.formatExtLabel}
            </label>
            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-indigo-500/10 border-indigo-500/50 text-indigo-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <FileAudio className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">.MP3</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase border border-indigo-500/30">
                      Audio
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{t.fmtMp3Tag}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'id' ? 'Aktif' : 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Filename Naming Pattern */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {t.namingPatternLabel}
            </label>
            <div className="space-y-2">
              {[
                { id: '{index} - {title}', label: `01 - ${lang === 'id' ? 'Judul Lagu' : 'Song Title'}.${settings.containerFormat}` },
                { id: '{artist} - {title}', label: `${lang === 'id' ? 'Artis - Judul Lagu' : 'Artist - Song Title'}.${settings.containerFormat}` },
                { id: '{title}', label: `${lang === 'id' ? 'Judul Lagu' : 'Song Title'}.${settings.containerFormat}` },
              ].map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => onUpdateSettings({ namingFormat: pattern.id as any })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                    settings.namingFormat === pattern.id
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-[#141414] border-white/5 text-gray-300'
                  }`}
                >
                  <span>{pattern.label}</span>
                  {settings.namingFormat === pattern.id && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            {t.saveClose}
          </button>
        </div>
      </div>
    </div>
  );
};

