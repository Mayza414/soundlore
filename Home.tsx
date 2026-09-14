import { Head } from '@inertiajs/react';
import Layout from '@/Components/UI/Layout';
import HeroSection from '@/Components/Home/HeroSection';
import NewArrivals from '@/Components/Home/NewArrivals';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  genres: { name: string }[];
  youtube_video_id: string;
}

interface FeaturedArtist {
  name: string;
  bio: string | null;
  image_url: string | null;
  genreLabel: string | null;
  songId: number | null;
}

interface HomeProps {
  featuredSongs: Song[];
  genres: Genre[];
  featuredArtist?: FeaturedArtist | null;
}

export default function Home({ featuredSongs, genres, featuredArtist }: HomeProps) {
  return (
    <Layout genres={genres}>
      <Head title="Início" />
      <HeroSection featuredArtist={featuredArtist} />
      <NewArrivals songs={featuredSongs} />
    </Layout>
  );
}