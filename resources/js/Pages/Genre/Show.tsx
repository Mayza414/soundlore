import { Head, Link } from '@inertiajs/react';
import Layout from '@/Components/UI/Layout';
import { Play, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { getGenreGradient, getGenreTagline, getGenreDescription } from '@/lib/genreTheme';

interface GenreShowProps {
  genre: { id: number; name: string; slug: string };
  songs: {
    id: number;
    title: string;
    release_year: number;
    image_url: string | null;
    artist: { id: number; name: string };
  }[];
  genres: { id: number; name: string; slug: string }[];
}

export default function Show({ genre, songs, genres }: GenreShowProps) {
  const gradient = getGenreGradient(genre.name, genre.id);

  return (
    <Layout genres={genres}>
      <Head title={`${genre.name} - SoundLore`} />

      <div className="-mt-20">
        {/* Hero */}
        <section className="relative min-h-[90vh] w-full flex items-end pb-24 md:pb-32 px-4 md:px-16">
          <div className="absolute inset-0 z-0">
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-block px-3 py-1 mb-6 rounded-full glass-panel border border-primary/30">
              <span className="font-label-sm text-primary text-xs uppercase tracking-widest">
                Catálogo {genre.name}
              </span>
            </div>
            <h1 className="font-display-lg text-5xl md:text-7xl text-on-surface mb-6 drop-shadow-2xl">
              {getGenreTagline(genre.name)}
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed border-l-2 border-primary/50 pl-6">
              {getGenreDescription(genre.name)}
            </p>
            <div className="flex flex-wrap gap-4">
              {songs.length > 0 && (
                <Link
                  href={`/musicas/${songs[0].id}`}
                  className="font-label-sm bg-primary text-on-primary px-8 py-4 rounded flex items-center gap-2 text-sm uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:opacity-90 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Ouvir Agora
                </Link>
              )}
              <button className="font-label-sm glass-panel text-on-surface px-8 py-4 rounded flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:bg-white/10 transition-colors">
                <Heart className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        </section>

        {/* Explorar Vertentes (estático por enquanto) */}
        <section className="py-24 px-4 md:px-16 bg-surface-dim">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-2">Explorar Vertentes</h2>
              <p className="font-body-md text-on-surface-variant">Ramificações rítmicas e culturais.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['Clássicos', 'Vertente Moderna'].map((label, i) => (
              <div key={label} className="group relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer">
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 glass-panel border-x-0 border-b-0 rounded-b-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-label-sm text-primary text-xs uppercase tracking-widest mb-2 block">
                        {i === 0 ? 'Raízes' : 'Hoje'}
                      </span>
                      <h4 className="font-headline-md text-xl md:text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {genre.name} {label}
                      </h4>
                      <p className="font-body-md text-on-surface-variant max-w-md text-sm">
                        Uma curadoria em breve dedicada a essa vertente do {genre.name}.
                      </p>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 flex-shrink-0">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Músicas do gênero (dados reais) */}
        <section className="py-24 px-4 md:px-16 bg-background">
          <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-12">
            Faixas de {genre.name}
          </h2>

          {songs.length === 0 ? (
            <p className="font-body-md text-on-surface-variant">
              Nenhuma música cadastrada nesse gênero ainda.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {songs.map((song) => (
                <Link key={song.id} href={`/musicas/${song.id}`} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 shadow-xl">
                    {song.image_url ? (
                      <img
                        src={song.image_url}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <span className="text-4xl text-white/30">🎵</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 text-on-primary flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-headline-md text-lg text-on-surface group-hover:text-primary transition-colors">
                    {song.title}
                  </h4>
                  <p className="font-body-md text-on-surface-variant text-sm mt-1">
                    {song.artist?.name} · {song.release_year}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}