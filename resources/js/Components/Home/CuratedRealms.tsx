import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGenreGradient } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface CuratedRealmsProps {
  genres: Genre[];
}

export default function CuratedRealms({ genres }: CuratedRealmsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const target = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const realmDescriptions: Record<string, string> = {
    'MPB': 'MPB / Eletrônica',
    'Rock': 'Rock / Alternativo',
    'Pop': 'Pop / Indie',
    'Samba': 'Samba / Jazz',
    'Jazz': 'Jazz Fusion',
    'Eletrônica': 'Techno / Darkwave',
  };

  return (
    <section className="py-24 px-4 md:px-16 lg:px-20 relative">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
        <div>
          <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-2">
            Reinos Curados
          </h3>
          <p className="font-body-md text-on-surface-variant">
            Paisagens sonoras projetadas para imersão total.
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-4 md:-mx-16 lg:-mx-20 px-4 md:px-16 lg:px-20 scroll-smooth"
      >
        {genres && genres.length > 0 ? (
          genres.map((genre, index) => (
            <Link
              key={genre.id}
              href={`/generos/${genre.slug}`}
              className="min-w-[280px] md:min-w-[320px] aspect-[4/5] rounded-xl relative overflow-hidden group cursor-pointer flex-shrink-0 block"
            >
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getGenreGradient(genre.name, index)} group-hover:scale-105 transition-transform duration-700`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-surface/60 backdrop-blur-xl border border-white/10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 rounded-b-xl">
                <h4 className="font-headline-md text-xl md:text-2xl text-on-surface mb-1">
                  {genre.name}
                </h4>
                <p className="font-label-sm text-primary text-xs uppercase tracking-widest">
                  {realmDescriptions[genre.name] || `${genre.name} / Experimental`}
                </p>
              </div>
            </Link>
          ))
        ) : (
          [1, 2, 3, 4].map((_, index) => (
            <div key={index} className="min-w-[280px] md:min-w-[320px] aspect-[4/5] rounded-xl relative overflow-hidden flex-shrink-0">
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${getGenreGradient('', index)} animate-pulse`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-surface/60 backdrop-blur-xl border border-white/10">
                <h4 className="font-headline-md text-xl md:text-2xl text-on-surface/50 mb-1">
                  Carregando...
                </h4>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}