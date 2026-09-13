import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { User } from 'lucide-react';
import Layout from '@/Components/UI/Layout';
import { getGenreGradient } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface SongMini {
  id: number;
  genres: Genre[];
}

interface ArtistCard {
  id: number;
  name: string;
  bio: string | null;
  image_url: string | null;
  songs_count: number;
  songs: SongMini[];
}

interface ArtistIndexProps {
  artists: ArtistCard[];
  genres: Genre[];
}

function primaryGenreOf(artist: ArtistCard): string | undefined {
  const counts = new Map<string, number>();
  artist.songs.forEach((song) =>
    song.genres.forEach((g) => counts.set(g.name, (counts.get(g.name) ?? 0) + 1))
  );
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function ArtistCardImage({ artist, genreName }: { artist: ArtistCard; genreName?: string }) {
  const [hasError, setHasError] = useState(false);
  const showImage = artist.image_url && !hasError;

  return showImage ? (
    <img
      src={artist.image_url!}
      alt={artist.name}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  ) : (
    <div
      className={`w-full h-full bg-gradient-to-br ${getGenreGradient(
        genreName ?? artist.name,
        artist.id
      )} flex items-center justify-center`}
    >
      <User className="w-12 h-12 text-white/30" />
    </div>
  );
}

export default function Index({ artists, genres }: ArtistIndexProps) {
  return (
    <Layout genres={genres}>
      <Head title="Artistas - SoundLore" />

      <div className="pt-32 pb-16 px-4 md:px-16 lg:px-20">
        <span className="font-label-sm text-xs uppercase tracking-widest text-outline">
          // Acervo Curado
        </span>
        <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface mt-2">Artistas</h1>
        <p className="font-body-lg text-on-surface-variant mt-4 max-w-2xl font-light">
          Vozes e trajetórias reunidas no acervo do SoundLore.
        </p>
      </div>

      <section className="px-4 md:px-16 lg:px-20 pb-24">
        {artists.length === 0 ? (
          <p className="font-body-md text-on-surface-variant">Nenhum artista cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((artist) => {
              const genreName = primaryGenreOf(artist);
              return (
                <Link
                  key={artist.id}
                  href={`/artistas/${artist.id}`}
                  className="group flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <ArtistCardImage artist={artist} genreName={genreName} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent" />
                    {genreName && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-sm text-[10px] uppercase tracking-widest">
                        {genreName}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-md text-lg text-on-surface group-hover:text-primary transition-colors truncate">
                        {artist.name}
                      </h3>
                      <p className="mt-2 text-xs font-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                        {artist.bio || 'Biografia em breve...'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 font-label-sm text-[11px] text-outline uppercase tracking-widest">
                      <span>
                        {artist.songs_count} {artist.songs_count === 1 ? 'música' : 'músicas'}
                      </span>
                      <span className="text-primary">Discografia →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}