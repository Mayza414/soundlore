import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Play, User } from 'lucide-react';
import Layout from '@/Components/UI/Layout';
import { getGenreGradient } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface SongSummary {
  id: number;
  title: string;
  release_year: number | null;
  image_url: string | null;
  genres: Genre[];
}

interface AlbumSummary {
  id: number;
  title: string;
  cover_image_url: string | null;
  release_year: number | null;
  songs_count: number;
}

interface Artist {
  id: number;
  name: string;
  bio: string | null;
  image_url: string | null;
  songs: SongSummary[];
  albums: AlbumSummary[];
}

interface ArtistShowProps {
  artist: Artist;
  genres: Genre[];
}

export default function Show({ artist, genres }: ArtistShowProps) {
  const [heroImageError, setHeroImageError] = useState(false);

  const genreCounts = new Map<string, number>();
  artist.songs.forEach((song) =>
    (song.genres ?? []).forEach((g) => genreCounts.set(g.name, (genreCounts.get(g.name) ?? 0) + 1))
  );
  const primaryGenreName = [...genreCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const primaryGenre = genres.find((g) => g.name === primaryGenreName);
  const gradient = getGenreGradient(primaryGenreName ?? artist.name, artist.id);

  const uniqueGenres = [
    ...new Map(artist.songs.flatMap((s) => s.genres ?? []).map((g) => [g.id, g])).values(),
  ];

  const showHeroImage = artist.image_url && !heroImageError;

  return (
    <Layout genres={genres} activeGenreSlug={primaryGenre?.slug}>
      <Head title={`${artist.name} - SoundLore`} />

      <div className="-mt-20">
        {/* Hero do artista */}
        <section className="relative w-full h-[80vh] min-h-[560px] flex items-end px-4 md:px-16 lg:px-20 pb-16">
          <div className="absolute inset-0 z-0">
            {showHeroImage ? (
              <img
                src={artist.image_url ?? undefined}
                alt={artist.name}
                onError={() => setHeroImageError(true)}
                className="w-full h-full object-cover object-top grayscale-[30%]"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <User className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary mb-2 block">
              Artista
            </span>
            <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface drop-shadow-2xl">
              {artist.name}
            </h1>

            {uniqueGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {uniqueGenres.map((g) => (
                  <Link
                    key={g.id}
                    href={`/generos/${g.slug}`}
                    className="font-label-sm text-[11px] uppercase tracking-widest px-3 py-1 rounded-full glass-panel border border-primary/30 text-on-surface-variant hover:text-primary hover:border-primary/60 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Biografia */}
        <section className="bg-background py-20 px-4 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <h2 className="font-headline-md text-primary mb-4 uppercase tracking-widest text-sm">
              Sobre
            </h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
              {artist.bio || 'Biografia em breve...'}
            </p>
          </div>
        </section>

        {/* Álbuns do artista */}
        {artist.albums && artist.albums.length > 0 && (
          <section className="bg-background pb-20 px-4 md:px-16 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-8">
                Álbuns
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {artist.albums.map((album) => (
                  <Link key={album.id} href={`/albuns/${album.id}`} className="group block">
                    <div className="aspect-square rounded-lg overflow-hidden bg-surface-container mb-3 shadow-md">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getGenreGradient(
                            album.title,
                            album.id
                          )} flex items-center justify-center`}
                        >
                          <span className="text-3xl text-white/30">💿</span>
                        </div>
                      )}
                    </div>
                    <p className="font-headline-md text-base text-on-surface group-hover:text-primary transition-colors truncate">
                      {album.title}
                    </p>
                    {album.release_year && (
                      <p className="font-label-sm text-xs text-on-surface-variant/60 mt-1">
                        {album.release_year}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grade de músicas do artista */}
        <section className="bg-surface-container-low py-24 px-4 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-12">
              Músicas
            </h2>

            {artist.songs.length === 0 ? (
              <p className="font-body-md text-on-surface-variant">
                Nenhuma música cadastrada ainda.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-12">
                {artist.songs.map((song) => (
                  <Link key={song.id} href={`/musicas/${song.id}`} className="group block">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-xl">
                      {song.image_url ? (
                        <img
                          src={song.image_url}
                          alt={song.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getGenreGradient(
                            song.genres?.[0]?.name ?? '',
                            song.id
                          )} flex items-center justify-center`}
                        >
                          <span className="text-4xl text-white/30">🎵</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/90 text-on-primary flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-all duration-300">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <p className="font-headline-md text-base text-on-surface group-hover:text-primary transition-colors truncate">
                      {song.title}
                    </p>
                    {song.release_year && (
                      <p className="font-label-sm text-xs text-on-surface-variant/60 mt-1">
                        {song.release_year}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}