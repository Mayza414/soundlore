import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/10 md:pl-72">
      <div className="max-w-6xl mx-auto px-4 md:px-16 py-16 text-center">
        <h2 className="font-display-lg text-2xl md:text-3xl text-primary mb-6">
          SOUNDLORE
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 font-body-md text-sm text-on-surface-variant">
          <Link href="/generos/mpb" className="hover:text-primary transition-colors">
            Curadores
          </Link>
          <a href="#" className="hover:text-primary transition-colors">
            Privacidade
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Termos
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Suporte
          </a>
        </div>

        <p className="font-label-sm text-xs text-on-surface-variant/60 uppercase tracking-widest">
          © {new Date().getFullYear()} SoundLore. Além do Áudio.
        </p>
      </div>
    </footer>
  );
}
