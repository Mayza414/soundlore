import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface LyricsSectionProps {
  lyrics: string;
  title: string;
}

export default function LyricsSection({ lyrics, title }: LyricsSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLyrics = (text: string) => {
    if (!text) {
      return <p className="text-on-surface-variant italic text-center py-8">Letra não disponível</p>;
    }
    return text.split('\n').map((line, index) => (
      <p
        key={index}
        className="text-on-surface/60 hover:text-on-surface transition-colors cursor-default"
      >
        {line || '\u00A0'}
      </p>
    ));
  };

  return (
    <div className="pr-0 md:pr-4">
      <div className="flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-md py-4 z-10 border-b border-surface-container mb-8">
        <div>
          <h2 className="font-label-sm text-primary uppercase tracking-widest text-xs">Letra</h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">{title}</p>
        </div>
        <button
          onClick={handleCopy}
          className="font-label-sm flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-primary">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="font-lyrics-display text-2xl md:text-[32px] leading-[44px] tracking-tight space-y-6 max-w-2xl max-h-[700px] overflow-y-auto pb-32">
        {formatLyrics(lyrics)}
      </div>
    </div>
  );
}