import { Head, Link } from '@inertiajs/react';
import { Play } from 'lucide-react';
import Layout from '@/Components/UI/Layout';
import { getGenreGradient } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface SongMini {
  id: number;
  title: string;
  release_year: number | null;
  image_url: string | null;
  genres: Genre[];
}

interface Album {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  release_year: number | null;
  artist: {
    id: number;
    name: string;
  };
  songs: SongMini[];
}

interface AlbumShowProps {
  album: Album;
  genres: Genre[];
}

export default function Show({ album, genres }: AlbumShowProps) {
  const firstSongId = album.songs[0]?.id;

  return (
    <Layout genres={genres}>
      <Head title={`${album.title} - SoundLore`} />

      <div className="pt-32 px-4 md:px-16 lg:px-20 pb-16 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-6xl mx-auto items-start">
          <div className="md:col-span-4">
            <div className="aspect-square w-full rounded-xl overflow-hidden shadow-2xl bg-surface-container">
              {album.cover_image_url ? (
                <img
                  src={album.cover_image_url}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${getGenreGradient(
                    album.title,
                    album.id
                  )} flex items-center justify-center`}
                >
                  <span className="text-6xl text-white/30">💿</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-8">
            <span className="font-label-sm text-xs uppercase tracking-widest text-outline">
              Álbum {album.release_year ? `· ${album.release_year}` : ''}
            </span>
            <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface mt-2">
              {album.title}
            </h1>
            <Link
              href={`/artistas/${album.artist.id}`}
              className="inline-block mt-3 font-headline-md text-lg text-primary hover:underline"
            >
              {album.artist.name}
            </Link>

            {album.description && (
              <p className="font-body-lg text-on-surface-variant mt-6 leading-relaxed font-light max-w-2xl whitespace-pre-line">
                {album.description}
              </p>
            )}

            {firstSongId && (
              <Link
                href={`/musicas/${firstSongId}`}
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4 fill-current" />
                Ouvir álbum completo
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="bg-surface-container-low py-20 px-4 md:px-16 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-10">
            Faixas
          </h2>

          {album.songs.length === 0 ? (
            <p className="font-body-md text-on-surface-variant">
              Nenhuma música cadastrada neste álbum ainda.
            </p>
          ) : (
            <ol className="divide-y divide-outline-variant/20">
              {album.songs.map((song, index) => (
                <li key={song.id}>
                  <Link
                    href={`/musicas/${song.id}`}
                    className="group flex items-center gap-4 py-4 hover:bg-surface-container-high/40 -mx-4 px-4 rounded-lg transition-colors"
                  >
                    <span className="font-label-sm text-xs text-outline w-6 text-right flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="w-12 h-12 rounded overflow-hidden bg-surface-container flex-shrink-0">
                      {song.image_url ? (
                        <img
                          src={song.image_url}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          🎵
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-body-lg text-on-surface group-hover:text-primary transition-colors truncate">
                        {song.title}
                      </p>
                      {song.genres[0] && (
                        <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest mt-0.5">
                          {song.genres[0].name}
                        </p>
                      )}
                    </div>

                    <Play className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </Layout>
  );
}