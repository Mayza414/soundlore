import { Head, Link } from '@inertiajs/react';
import Layout from '@/Components/UI/Layout';
import { getGenreGradient } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface AlbumCard {
  id: number;
  title: string;
  cover_image_url: string | null;
  release_year: number | null;
  songs_count: number;
  artist: {
    id: number;
    name: string;
  };
}

interface AlbumIndexProps {
  albums: AlbumCard[];
  genres: Genre[];
}

export default function Index({ albums, genres }: AlbumIndexProps) {
  return (
    <Layout genres={genres}>
      <Head title="Álbuns - SoundLore" />

      <div className="pt-32 pb-16 px-4 md:px-16 lg:px-20">
        <span className="font-label-sm text-xs uppercase tracking-widest text-outline">
          // Discografias Selecionadas
        </span>
        <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface mt-2">Álbuns</h1>
        <p className="font-body-lg text-on-surface-variant mt-4 max-w-2xl font-light">
          Obras completas, do vinil ao streaming, catalogadas no SoundLore.
        </p>
      </div>

      <section className="px-4 md:px-16 lg:px-20 pb-24">
        {albums.length === 0 ? (
          <p className="font-body-md text-on-surface-variant">Nenhum álbum cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/albuns/${album.id}`}
                className="group flex flex-col gap-3.5 bg-surface-container-low/60 hover:bg-surface-container p-4 rounded-xl transition-all duration-300"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface-container shadow-md">
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
                  {album.release_year && (
                    <span className="absolute top-2.5 left-2.5 font-label-sm text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container-lowest/80 text-primary backdrop-blur-md">
                      {album.release_year}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-headline-md text-base text-on-surface truncate group-hover:text-primary transition-colors">
                    {album.title}
                  </h3>
                  <span className="font-body-md text-sm text-on-surface-variant truncate">
                    {album.artist.name}
                  </span>
                  <div className="flex items-center justify-between mt-2 pt-2 bg-surface-container-lowest/40 px-2.5 py-1.5 rounded">
                    <span className="font-label-sm text-[11px] text-outline">
                      {album.songs_count} {album.songs_count === 1 ? 'faixa' : 'faixas'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}