import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Music2, Guitar, Mic2, Drum, Disc3, Cpu, User } from 'lucide-react';
import { getGenreAccent } from '@/lib/genreTheme';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

interface SidebarProps {
  genres: Genre[];
  isOpen?: boolean;
  onClose?: () => void;
  activeGenreSlug?: string;
  hidden?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  'MPB': Music2,
  'Rock': Guitar,
  'Pop': Mic2,
  'Samba': Drum,
  'Jazz': Disc3,
  'Eletrônica': Cpu,
};

function getIcon(name: string) {
  return iconMap[name] || Music2;
}

export default function Sidebar({ genres, isOpen, onClose, activeGenreSlug, hidden }: SidebarProps) {
  const { url, props } = usePage();
  const auth = (props as any).auth;
  const user = auth?.user;

  const content = (
    <>
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border border-outline/20 flex items-center justify-center">
          <User className="w-6 h-6 text-on-surface-variant" />
        </div>
        <div>
          <p className="font-body-lg text-primary text-sm">
            {user?.name || 'Visitante'}
          </p>
          <p className="font-label-sm text-on-surface-variant text-xs uppercase tracking-widest">
            {user ? 'Membro Premium' : 'Convidado'}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {genres.map((genre) => {
          const Icon = getIcon(genre.name);
          const isActive = url === `/generos/${genre.slug}` || genre.slug === activeGenreSlug;
          const accent = getGenreAccent(genre.name);
          return (
            <li key={genre.id}>
              <Link
                href={`/generos/${genre.slug}`}
                style={isActive ? { backgroundColor: `${accent}22`, color: accent } : undefined}
                className={`flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 ${
                  isActive
                    ? ''
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-body-md text-sm">{genre.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      <nav
        className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-72 bg-surface-container shadow-2xl flex-col p-8 z-40 hidden md:flex border-r border-surface-container-high overflow-y-auto transition-transform duration-500 ${
          hidden ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {content}
      </nav>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
          <nav className="fixed left-0 top-20 h-[calc(100vh-80px)] w-72 bg-surface-container shadow-2xl flex flex-col p-8 z-50 md:hidden overflow-y-auto">
            {content}
          </nav>
        </>
      )}
    </>
  );
}