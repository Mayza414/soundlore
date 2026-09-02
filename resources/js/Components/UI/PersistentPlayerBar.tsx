import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '@/Contexts/PlayerContext';
import { Link } from '@inertiajs/react';

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface PersistentPlayerBarProps {
  hideSidebar?: boolean;
}

export default function PersistentPlayerBar({ hideSidebar }: PersistentPlayerBarProps) {
  const { currentTrack, isPlaying, isMuted, currentTime, duration, toggle, seek, skip, toggleMute } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-24 glass-panel border-t border-white/10 z-40 flex items-center justify-between px-6 transition-all duration-500 ${
        hideSidebar ? 'md:left-0' : 'md:left-72'
      }`}
    >
            <div className="flex items-center gap-4 w-1/3 min-w-0">
        <Link href={`/musicas/${currentTrack.songId}`} className="flex items-center gap-4 min-w-0 group">
          <div className="w-14 h-14 rounded-md overflow-hidden bg-surface-container-high flex-shrink-0 relative">
            {currentTrack.imageUrl ? (
              <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="font-body-md font-semibold text-on-surface text-sm truncate group-hover:text-primary transition-colors">
              {currentTrack.title}
            </h4>
            <p className="font-body-md text-xs text-on-surface-variant truncate">{currentTrack.artistName}</p>
          </div>
        </Link>
        <button className="ml-2 text-on-surface-variant hover:text-tertiary transition-colors flex-shrink-0">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden md:flex flex-col items-center w-1/3 max-w-md">
        <div className="flex items-center gap-5 mb-1">
          <button onClick={() => skip(-10)} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button onClick={() => skip(10)} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="font-label-sm text-[10px] text-on-surface-variant w-9 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-primary bg-white/20"
            style={{
              background: `linear-gradient(to right, #c0c1ff ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
            }}
          />
          <span className="font-label-sm text-[10px] text-on-surface-variant w-9">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-1/3">
        <button onClick={toggle} className="md:hidden text-on-surface hover:text-primary transition-colors">
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        <button onClick={toggleMute} className="hidden md:block text-on-surface-variant hover:text-on-surface transition-colors">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}