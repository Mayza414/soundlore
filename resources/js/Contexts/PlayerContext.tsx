import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export interface PlayableTrack {
  songId: number;
  title: string;
  artistName: string;
  youtubeVideoId: string;
  imageUrl: string | null;
}

interface PlayerContextValue {
  currentTrack: PlayableTrack | null;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  play: (track: PlayableTrack) => void;
  toggle: () => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  toggleMute: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const HIDDEN_PLAYER_ID = 'soundlore-global-audio-player';

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayableTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<any>(null);
  const readyRef = useRef(false);
  const pendingVideoIdRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cria o player escondido UMA vez, na inicialização do app.
  // Importante: o contêiner é criado via DOM puro (fora do React) porque a
  // API do YouTube substitui esse elemento por um <iframe> próprio nos
  // bastidores. Se o React continuasse "dono" dessa div no JSX, qualquer
  // re-render (ex: barra do player aparecendo, progresso atualizando)
  // tentaria reconciliar um nó que já não existe mais, causando
  // "NotFoundError: removeChild/insertBefore" e derrubando a árvore inteira.
  useEffect(() => {
    const container = document.createElement('div');
    container.id = HIDDEN_PLAYER_ID;
    container.style.position = 'fixed';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    function createPlayer() {
      playerRef.current = new window.YT.Player(HIDDEN_PLAYER_ID, {
        height: '0',
        width: '0',
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (pendingVideoIdRef.current) {
              playerRef.current.loadVideoById(pendingVideoIdRef.current);
              pendingVideoIdRef.current = null;
            }
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(playerRef.current.getDuration());
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    return () => {
      playerRef.current?.destroy?.();
      container.remove();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 500);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  const play = useCallback((track: PlayableTrack) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);
    if (readyRef.current && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(track.youtubeVideoId);
      playerRef.current.playVideo();
    } else {
      pendingVideoIdRef.current = track.youtubeVideoId;
    }
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const resume = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const seek = useCallback((time: number) => {
    playerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  const skip = useCallback(
    (seconds: number) => {
      if (!playerRef.current) return;
      const target = Math.min(Math.max(currentTime + seconds, 0), duration);
      playerRef.current.seekTo(target, true);
      setCurrentTime(target);
    },
    [currentTime, duration]
  );

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <PlayerContext.Provider
      value={{ currentTrack, isPlaying, isMuted, currentTime, duration, play, toggle, pause, resume, seek, skip, toggleMute }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer deve ser usado dentro de PlayerProvider');
  return ctx;
}