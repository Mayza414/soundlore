import { Link } from '@inertiajs/react';
import { Play } from 'lucide-react';

interface FeaturedArtist {
  id: number;
  name: string;
  bio: string | null;
  image_url: string | null;
  genreLabel: string | null;
  songId: number | null;
}

interface HeroSectionProps {
  featuredArtist?: FeaturedArtist | null;
}

export default function HeroSection({ featuredArtist }: HeroSectionProps) {
  if (!featuredArtist) {
    return (
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-headline-lg text-5xl md:text-7xl text-on-surface mb-4">
            SoundLore
          </h1>
          <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Descubra a história por trás da música
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-end pb-16 md:pb-24 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent opacity-80" />
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950" />
        {featuredArtist.image_url && (
          <img
            src={featuredArtist.image_url}
            alt={featuredArtist.name}
            className="w-full h-full object-cover object-top absolute inset-0 opacity-40"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-label-sm px-3 py-1 bg-primary-container/30 border border-primary-container/30 rounded-full text-xs text-primary uppercase tracking-widest">
            Artista em Destaque
          </span>
          {featuredArtist.genreLabel && (
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
              {featuredArtist.genreLabel}
            </span>
          )}
        </div>

        <h2 className="font-headline-lg text-5xl md:text-7xl text-primary italic text-glow mb-4 leading-tight">
          {featuredArtist.name}
        </h2>

        {featuredArtist.bio && (
          <p className="font-body-lg text-lg md:text-xl text-on-surface-variant mb-8 max-w-2xl leading-relaxed">
            {featuredArtist.bio.length > 200
              ? featuredArtist.bio.substring(0, 200) + '...'
              : featuredArtist.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {featuredArtist.songId && (
            <Link
              href={`/musicas/${featuredArtist.songId}`}
              className="font-label-sm px-8 py-4 bg-primary text-on-primary hover:opacity-90 rounded-full text-sm uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Ouvir Agora
            </Link>
          )}
          <Link
            href={`/artistas/${featuredArtist.id}`}
            className="font-label-sm px-8 py-4 border border-outline-variant text-on-surface rounded-full text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Explorar Perfil
          </Link>
        </div>
      </div>
    </section>
  );
}