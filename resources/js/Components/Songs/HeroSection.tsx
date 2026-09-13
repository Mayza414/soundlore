import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Heart, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer, type PlayableTrack } from '@/Contexts/PlayerContext';

interface HeroSectionProps {
  songId: number;
  title: string;
  artistName: string;
  youtubeVideoId: string;
  releaseYear: number;
  genreLabel?: string;
  imageUrl: string | null;
  onImmersiveChange?: (isImmersive: boolean) => void;
}

const HIDE_DELAY = 3000;
const SHOW_AFTER_PAUSE_DELAY = 500;

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HeroSection({
  songId,
  title,
  artistName,
  youtubeVideoId,
  releaseYear,
  genreLabel,
  imageUrl,
  onImmersiveChange,
}: HeroSectionProps) {
  const {
    currentTrack,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    play,
    toggle,
    seek,
    skip,
    toggleMute,
    takeOverWithVisiblePlayer,
  } = usePlayer();

  const [showControls, setShowControls] = useState(true);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isThisTrack = currentTrack?.songId === songId;
  const isThisPlaying = isThisTrack && isPlaying;

  const videoContainerId = `hero-video-player-${songId}`;

  // Enquanto esta for a faixa tocando, cria um player DE VERDADE, visível,
  // dentro do elemento com id={videoContainerId}. Ao sair da página (ou
  // trocar de faixa), a função de limpeza devolve o controle pro player
  // escondido — o áudio continua, só o vídeo visível some.
  useEffect(() => {
    if (!isThisTrack) return;
    const cleanup = takeOverWithVisiblePlayer(videoContainerId);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThisTrack]);

  const scheduleHide = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), HIDE_DELAY);
  }, []);

  useEffect(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isThisPlaying) {
      scheduleHide();
    } else {
      hideTimeoutRef.current = setTimeout(() => setShowControls(true), SHOW_AFTER_PAUSE_DELAY);
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isThisPlaying, scheduleHide]);

  useEffect(() => {
    onImmersiveChange?.(!showControls && isThisPlaying);
  }, [showControls, isThisPlaying, onImmersiveChange]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (isThisPlaying) scheduleHide();
  };

  const handlePlayClick = () => {
    if (isThisTrack) {
      toggle();
      return;
    }
    const track: PlayableTrack = { songId, title, artistName, youtubeVideoId, imageUrl };
    play(track);
  };

  const backgroundImage = imageUrl || `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-end pb-24 md:pb-32 px-4 md:px-16"
    >
      <div className="absolute inset-0 z-0 bg-surface-container overflow-hidden">
        {/* Onde o player visível de verdade é criado, quando esta é a
            faixa tocando. Fica vazio (e não atrapalha nada) o resto do tempo. */}
        {isThisTrack && (
          <div id={videoContainerId} className="absolute inset-0 pointer-events-none" />
        )}

        {/* Imagem estática de fallback — some assim que o player visível
            estiver de fato pronto e tocando esta faixa */}
        {!isThisTrack && (
          <div
            className={`w-full h-full bg-cover bg-center transition-transform duration-[3000ms] ${
              isThisPlaying ? 'scale-110' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center 20%' }}
          />
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-background transition-opacity duration-700 ${
            isThisPlaying ? 'via-background/20 to-transparent opacity-70' : 'via-background/60 to-transparent opacity-100'
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r from-background/80 to-transparent w-1/2 transition-opacity duration-700 ${
            isThisPlaying ? 'opacity-40' : 'opacity-100'
          }`}
        />
      </div>

      <div
        className={`relative z-10 max-w-4xl w-full transition-opacity duration-500 ${
          showControls || !isThisPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4 mb-6">
          {genreLabel && (
            <span className="font-label-sm px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary uppercase tracking-widest backdrop-blur-md">
              {genreLabel}
            </span>
          )}
          <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
            {releaseYear}
          </span>
        </div>

        <h1 className="font-display-lg text-5xl md:text-7xl text-on-surface mb-2 leading-tight">
          {title}
        </h1>
        <p className="font-headline-lg text-2xl md:text-4xl text-primary/90 font-light italic mb-8">
          {artistName}
        </p>

        {isThisTrack && duration > 0 && (
          <div className="mb-4 max-w-xl">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer accent-primary bg-white/20"
              style={{
                background: `linear-gradient(to right, #c0c1ff ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
              }}
            />
            <div className="flex justify-between mt-1 font-label-sm text-[10px] text-on-surface-variant">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePlayClick}
            className="font-label-sm bg-primary text-on-primary px-8 py-3 rounded-full text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(192,193,255,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
          >
            {isThisPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isThisPlaying ? 'Pausar' : 'Ouvir Agora'}
          </button>

          {isThisTrack && (
            <>
              <button onClick={() => skip(-10)} className="w-11 h-11 rounded-full glass-panel flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={() => skip(10)} className="w-11 h-11 rounded-full glass-panel flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              <button onClick={toggleMute} className="w-11 h-11 rounded-full glass-panel flex items-center justify-center text-on-surface hover:bg-white/10 transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </>
          )}

          <button className="font-label-sm glass-panel text-on-surface px-8 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-surface-variant transition-colors flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}