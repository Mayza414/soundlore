import React from 'react';
import { PageProps } from '@inertiajs/react';
import Layout from '@/Components/UI/Layout';
import HeroSection from '@/Components/Home/HeroSection';
import CuratedRealms from '@/Components/Home/CuratedRealms';
import NewArrivals from '@/Components/Home/NewArrivals';

interface Song {
  id: number;
  title: string;
  artist: { name: string };
  genres: { name: string }[];
  youtube_video_id: string;
  image_url?: string;
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
  genres: { id: number; name: string; slug: string }[];
  featuredArtist?: FeaturedArtist | null;
}

export default function Home({ featuredSongs, genres, featuredArtist }: PageProps<HomeProps>) {
  return (
    <Layout genres={genres}>
      <div className="pt-20">
        <HeroSection featuredArtist={featuredArtist} />
        <CuratedRealms genres={genres} />
        <NewArrivals songs={featuredSongs} />
      </div>
    </Layout>
  );
}
