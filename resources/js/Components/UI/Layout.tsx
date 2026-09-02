import { useState, type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PersistentPlayerBar from './PersistentPlayerBar';
import { usePlayer } from '@/Contexts/PlayerContext';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface LayoutProps {
  children: ReactNode;
  genres?: Genre[];
  activeGenreSlug?: string;
  hideSidebar?: boolean;
}

export default function Layout({
  children,
  genres = [],
  activeGenreSlug,
  hideSidebar,
}: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { currentTrack } = usePlayer();

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        genres={genres}
        activeGenreSlug={activeGenreSlug}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hidden={hideSidebar}
      />
      <main
        className={`flex-1 transition-all duration-500 ${hideSidebar ? 'md:pl-0' : 'md:pl-72'} ${
          currentTrack ? 'pb-24' : ''
        }`}
      >
        {children}
      </main>
      <Footer />
      <PersistentPlayerBar hideSidebar={hideSidebar} />
    </div>
  );
}