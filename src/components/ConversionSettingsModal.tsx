import React from 'react';
import { X, Sliders, Check, FileAudio, Info, Tag } from 'lucide-react';
import { ConversionSettings, OpusBitrate } from '../types';

interface ConversionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ConversionSettings;
  onUpdateSettings: (newSettings: Partial<ConversionSettings>) => void;
}

export const ConversionSettingsModal: React.FC<ConversionSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const bitrates: Array<{ id: OpusBitrate; label: string; desc: string }> = [
    { id: '64', label: '64 kbps', desc: 'Sangat Hemat Ukuran (Suara Bagus)' },
    { id: '128', label: '128 kbps', desc: 'Standar Jernih (Disarankan)' },
    { id: '160', label: '160 kbps', desc: 'Asli YouTube Native Opus (Kualitas Tinggi)' },
    { id: '192', label: '192 kbps', desc: 'Kualitas Tinggi' },
    { id: '256', label: '256 kbps', desc: 'Ultra High Fidelity' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">Pengaturan Audio Opus</h3>
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
              Kualitas Bitrate Opus
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

          {/* Container Extension Format */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Ekstensi File Output (Format Audio)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { fmt: 'mp3', label: '.MP3', tag: 'Disarankan (Semua Perangkat)' },
                { fmt: 'm4a', label: '.M4A', tag: 'AAC Jernih (Apple / Android)' },
                { fmt: 'opus', label: '.OPUS', tag: 'Codec Kualitas Tinggi' },
                { fmt: 'ogg', label: '.OGG', tag: 'Format Audio Web' },
                { fmt: 'webm', label: '.WEBM', tag: 'Format Container Web' },
              ].map(({ fmt, label, tag }) => (
                <button
                  key={fmt}
                  onClick={() => onUpdateSettings({ containerFormat: fmt as any })}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    settings.containerFormat === fmt
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-[#141414] border-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <span className="text-xs font-black">{label}</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filename Naming Pattern */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Pola Nama File Output
            </label>
            <div className="space-y-2">
              {[
                { id: '{index} - {title}', label: `01 - Judul Lagu.${settings.containerFormat}` },
                { id: '{artist} - {title}', label: `Artis - Judul Lagu.${settings.containerFormat}` },
                { id: '{title}', label: `Judul Lagu.${settings.containerFormat}` },
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
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
