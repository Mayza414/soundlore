import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { User, ArrowRight } from 'lucide-react';

interface ArtistBioProps {
  name: string;
  bio: string;
  imageUrl: string | null;
}

export default function ArtistBio({ name, bio, imageUrl }: ArtistBioProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = imageUrl && !hasError;

  return (
    <section className="py-24 px-4 md:px-16 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-7xl mx-auto">
        <div className="md:col-span-5 relative group">
          <div className="aspect-[4/5] rounded-xl overflow-hidden glass-panel relative z-10">
            {showImage ? (
              <img
                src={imageUrl}
                alt={name}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container">
                <User className="w-16 h-16 text-on-surface-variant/40" />
              </div>
            )}
          </div>
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none" />
        </div>

        <div className="md:col-span-6 md:col-start-7 mt-12 md:mt-0">
          <h2 className="font-headline-md text-primary mb-2 uppercase tracking-widest text-sm">O Artista</h2>
          <h3 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-8">{name}</h3>
          <div className="space-y-6 text-on-surface-variant font-body-lg leading-relaxed font-light">
            <p className="whitespace-pre-line">{bio || 'Biografia em breve...'}</p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 mt-8 text-primary font-label-sm text-xs uppercase tracking-widest hover:text-primary-fixed transition-colors border-b border-primary/30 pb-1"
          >
            Explorar Discografia
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}