import React from 'react';
import { Sparkles, Lightbulb, Mic } from 'lucide-react';

interface Curiosity {
  id: number;
  title: string;
  content: string;
}

interface CuriositiesGridProps {
  curiosities: Curiosity[];
}

const icons = [Lightbulb, Mic, Sparkles];

export default function CuriositiesGrid({ curiosities }: CuriositiesGridProps) {
  if (!curiosities || curiosities.length === 0) {
    return (
      <section className="py-24 px-4 md:px-16 lg:px-20 text-center">
        <Sparkles className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-4" />
        <p className="font-body-md text-on-surface-variant">
          Nenhuma curiosidade encontrada para esta faixa.
        </p>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 md:px-16 lg:px-20">
      <div className="mb-16 text-center">
        <h2 className="font-headline-md text-primary mb-2 uppercase tracking-widest text-sm">Curiosidades</h2>
        <h3 className="font-display-lg text-3xl md:text-4xl text-on-surface">Bastidores da Música</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {curiosities.map((curiosity, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={curiosity.id}
              className="glass-panel rounded-2xl p-8 hover:bg-surface-variant/40 transition-colors duration-500 group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 text-[100px] font-display-lg italic text-surface-container-high opacity-50 group-hover:text-primary/10 transition-colors pointer-events-none select-none">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container text-primary border border-white/5">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-headline-md text-xl text-on-surface mb-4">{curiosity.title}</h4>
              <p className="font-body-md text-on-surface-variant leading-relaxed">{curiosity.content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}