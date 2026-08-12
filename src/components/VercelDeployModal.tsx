import React, { useState } from 'react';
import { X, Server, Copy, Check, ExternalLink, Terminal, Globe, Code, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose, lang = 'id' }) => {
  const [copiedVercelJson, setCopiedVercelJson] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;
  const t = translations[lang];

  const vercelJsonContent = `{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#0d0d0d] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Server className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">{t.deployGuideTitle}</h3>
              <p className="text-xs text-gray-400">{t.deployDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 pt-5 text-sm text-gray-300">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
            <div className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono">
                1
              </span>
              <span>{t.step1}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pl-8">
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono">
                  2
                </span>
                <span>{t.step2}</span>
              </div>
              <button
                onClick={() => copyToClipboard(vercelJsonContent, setCopiedVercelJson)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-200 transition-colors"
              >
                {copiedVercelJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lang === 'id' ? 'Tersalin' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'id' ? 'Salin' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pl-8 mb-2">
              {t.step2Desc}
            </p>
            <pre className="mt-2 p-3 rounded-lg bg-black font-mono text-[11px] text-indigo-300 overflow-x-auto border border-white/10">
              {vercelJsonContent}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono">
                  3
                </span>
                <span>{t.step3}</span>
              </div>
              <button
                onClick={() => copyToClipboard('npm i -g vercel && vercel --prod', setCopiedCli)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-medium text-gray-200 transition-colors"
              >
                {copiedCli ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lang === 'id' ? 'Tersalin' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy CLI</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2 pl-8">
              <p className="text-xs text-gray-400">
                {t.step3Desc}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
            <div className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono">
                4
              </span>
              <span>{t.step4}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pl-8">
              {t.step4Desc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:underline font-semibold"
          >
            <span>Vercel Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

