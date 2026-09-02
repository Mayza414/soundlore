import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const navItems = [
  { label: 'Gêneros', href: '/' },
  { label: 'Artistas', comingSoon: true },
  { label: 'Álbuns', comingSoon: true },
  { label: 'Eventos', comingSoon: true },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const { url } = usePage();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex justify-between items-center px-4 md:px-16 h-20">
        <button
          onClick={onMenuClick}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-10">
          <Link href="/" className="text-center md:text-left">
            <h1 className="font-display-lg text-2xl md:text-headline-lg tracking-tighter text-primary inline-block">
              SOUNDLORE
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.comingSoon ? (
                <span
                  key={item.label}
                  title="Em breve"
                  className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant/30 cursor-not-allowed select-none"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-label-sm text-xs uppercase tracking-widest transition-colors pb-1 ${
                    url === item.href
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}