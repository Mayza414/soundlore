import React from 'react';
import { Play } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  genres: { name: string }[];
  youtube_video_id: string;
  image_url: string | null;
}

interface NewArrivalsProps {
  songs: Song[];
}

export default function NewArrivals({ songs }: NewArrivalsProps) {
  return (
    <section className="py-24 px-4 md:px-16 lg:px-20 bg-surface-container-low">
      <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-12 text-center">
        Novos Lançamentos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
        {songs && songs.length > 0 ? (
          songs.map((song, index) => (
            <Link 
              key={song.id}
              href={`/musicas/${song.id}`}
              className="group cursor-pointer"
            >
              <div className={`relative aspect-square overflow-hidden rounded-lg mb-6 shadow-2xl ${index === 1 ? 'lg:translate-y-12' : ''}`}>
                {song.image_url ? (
                  <img
                    src={song.image_url}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-indigo-800/60 via-purple-800/60 to-pink-800/60 flex items-center justify-center ${song.image_url ? 'hidden' : ''}`}>
                  <span className="text-6xl text-white/30">🎵</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 text-on-primary flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-headline-md text-xl text-on-surface group-hover:text-primary transition-colors">
                  {song.title}
                </h4>
                <p className="font-body-md text-on-surface-variant mt-1">
                  {song.artist?.name || 'Artista desconhecido'}
                </p>
              </div>
            </Link>
          ))
        ) : (
          [1, 2, 3].map((_, index) => (
            <div key={index} className="group cursor-pointer">
              <div className={`relative aspect-square overflow-hidden rounded-lg mb-6 shadow-2xl ${index === 1 ? 'lg:translate-y-12' : ''}`}>
                <div className="w-full h-full bg-surface-container-high animate-pulse flex items-center justify-center">
                  <span className="text-4xl text-on-surface/20">🎵</span>
                </div>
              </div>
              <div>
                <h4 className="font-headline-md text-xl text-on-surface/50">Carregando...</h4>
                <p className="font-body-md text-on-surface-variant/50 mt-1">Artista</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}