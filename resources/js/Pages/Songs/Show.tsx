import { useState } from 'react';
import { PageProps } from '@inertiajs/react';
import Layout from '@/Components/UI/Layout';
import HeroSection from '@/Components/Songs/HeroSection';
import ArtistBio from '@/Components/Songs/ArtistBio';
import CuriositiesGrid from '@/Components/Songs/CuriositiesGrid';
import LyricsSection from '@/Components/Songs/LyricsSection';
import CommentsSection from '@/Components/Songs/CommentsSection';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface Song {
  id: number;
  title: string;
  youtube_video_id: string;
  lyrics: string;
  release_year: number;
  image_url: string | null;
  artist: {
    id: number;
    name: string;
    bio: string;
    image_url: string | null;
  };
  genres: { id: number; name: string; slug: string }[];
  curiosities: { id: number; title: string; content: string }[];
  comments: {
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      avatar_url: string | null;
    };
    replies: {
      id: number;
      content: string;
      created_at: string;
      user: {
        id: number;
        name: string;
        avatar_url: string | null;
      };
    }[];
  }[];
}

interface ShowProps {
  song: Song;
  genres: Genre[];
}

export default function Show({ song, genres }: PageProps<ShowProps>) {
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <Layout genres={genres} activeGenreSlug={song.genres?.[0]?.slug} hideSidebar={isImmersive}>
      <div className="-mt-20">
        <HeroSection
          songId={song.id}
          title={song.title}
          artistName={song.artist.name}
          youtubeVideoId={song.youtube_video_id}
          releaseYear={song.release_year}
          genreLabel={song.genres?.[0]?.name}
          imageUrl={song.image_url}
          onImmersiveChange={setIsImmersive}
        />

        <div className="bg-background">
          <ArtistBio
            name={song.artist.name}
            bio={song.artist.bio}
            imageUrl={song.artist.image_url}
          />
        </div>

        <div className="bg-surface-container-low">
          <CuriositiesGrid curiosities={song.curiosities} />
        </div>

        <section className="bg-background py-24 px-4 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto">
            <div className="md:col-span-7">
              <LyricsSection lyrics={song.lyrics} title={song.title} />
            </div>
            <div className="md:col-span-5">
              <CommentsSection songId={song.id} comments={song.comments} />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}