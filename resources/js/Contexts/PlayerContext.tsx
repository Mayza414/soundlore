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
  /**
   * Cria um player DE VERDADE, visível, dentro do elemento com o id
   * informado, e faz ele assumir o controle (pausando o player escondido
   * pra não tocar som duas vezes ao mesmo tempo). Retorna uma função de
   * limpeza: chame-a quando o componente for desmontado (ex: saiu da
   * página) — ela devolve o controle pro player escondido, continuando
   * a tocar em segundo plano a partir do mesmo ponto.
   */
  takeOverWithVisiblePlayer: (containerId: string) => () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const HIDDEN_PLAYER_ID = 'soundlore-hidden-audio-player';

function waitForYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const check = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<PlayableTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // O player escondido: sempre existe, é quem toca o áudio em segundo
  // plano sempre que nenhuma página está mostrando o vídeo visivelmente.
  const hiddenPlayerRef = useRef<any>(null);
  const hiddenReadyRef = useRef(false);

  // O player "ativo" no momento — pode ser o escondido, ou um player
  // visível criado por uma página (ex: HeroSection da música).
  const activePlayerRef = useRef<any>(null);

  const pendingVideoIdRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTrackRef = useRef<PlayableTrack | null>(null);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const handleStateChange = useCallback((e: any) => {
    if (e.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(e.target.getDuration());
    } else if (e.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (e.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
    }
  }, []);

  // Cria o player escondido UMA vez, na inicialização do app.
  useEffect(() => {
    const container = document.createElement('div');
    container.id = HIDDEN_PLAYER_ID;
    container.style.position = 'fixed';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    waitForYouTubeApi().then(() => {
      hiddenPlayerRef.current = new window.YT.Player(HIDDEN_PLAYER_ID, {
        height: '0',
        width: '0',
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: () => {
            hiddenReadyRef.current = true;
            activePlayerRef.current = hiddenPlayerRef.current;
            if (pendingVideoIdRef.current) {
              hiddenPlayerRef.current.loadVideoById(pendingVideoIdRef.current);
              pendingVideoIdRef.current = null;
            }
          },
          onStateChange: handleStateChange,
        },
      });
    });

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    return () => {
      hiddenPlayerRef.current?.destroy?.();
      container.remove();
    };
  }, [handleStateChange]);

  // Lê o tempo atual do player que estiver ativo no momento (escondido ou visível).
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (activePlayerRef.current?.getCurrentTime) {
          setCurrentTime(activePlayerRef.current.getCurrentTime());
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
    const player = activePlayerRef.current ?? hiddenPlayerRef.current;
    if (hiddenReadyRef.current && player?.loadVideoById) {
      player.loadVideoById(track.youtubeVideoId);
      player.playVideo();
    } else {
      pendingVideoIdRef.current = track.youtubeVideoId;
    }
  }, []);

  const pause = useCallback(() => {
    activePlayerRef.current?.pauseVideo();
  }, []);

  const resume = useCallback(() => {
    activePlayerRef.current?.playVideo();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const seek = useCallback((time: number) => {
    activePlayerRef.current?.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  const skip = useCallback(
    (seconds: number) => {
      if (!activePlayerRef.current) return;
      const target = Math.min(Math.max(currentTime + seconds, 0), duration);
      activePlayerRef.current.seekTo(target, true);
      setCurrentTime(target);
    },
    [currentTime, duration]
  );

  const toggleMute = useCallback(() => {
    if (!activePlayerRef.current) return;
    if (isMuted) {
      activePlayerRef.current.unMute();
    } else {
      activePlayerRef.current.mute();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const takeOverWithVisiblePlayer = useCallback(
    (containerId: string) => {
      let destroyed = false;
      let localPlayer: any = null;

      const track = currentTrackRef.current;
      if (!track) {
        // Nada tocando ainda — não há o que assumir.
        return () => {};
      }

      // Ponto de partida: de onde o player anteriormente ativo (o
      // escondido, na prática) estava tocando.
      const startSeconds = activePlayerRef.current?.getCurrentTime?.() ?? 0;
      const wasPlaying = activePlayerRef.current?.getPlayerState?.() === 1; // 1 = PLAYING

      waitForYouTubeApi().then(() => {
        if (destroyed) return;

        localPlayer = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          playerVars: { autoplay: wasPlaying ? 1 : 0, controls: 0, modestbranding: 1, rel: 0 },
          events: {
            onReady: () => {
              if (destroyed) return;

              // Pausa o escondido — só o visível vai tocar som agora.
              hiddenPlayerRef.current?.pauseVideo?.();

              localPlayer.loadVideoById({
                videoId: track.youtubeVideoId,
                startSeconds,
              });

              activePlayerRef.current = localPlayer;

              if (wasPlaying) {
                localPlayer.playVideo();
              }
            },
            onStateChange: handleStateChange,
          },
        });
      });

      // Função de limpeza: devolve o controle pro player escondido.
      return () => {
        destroyed = true;

        if (localPlayer) {
          const t = localPlayer.getCurrentTime?.() ?? startSeconds;
          const playing = localPlayer.getPlayerState?.() === 1;

          activePlayerRef.current = hiddenPlayerRef.current;

          if (hiddenPlayerRef.current) {
            hiddenPlayerRef.current.loadVideoById({
              videoId: track.youtubeVideoId,
              startSeconds: t,
            });
            if (!playing) {
              // loadVideoById começa tocando por padrão — se estava
              // pausado, pausa de novo logo em seguida.
              setTimeout(() => hiddenPlayerRef.current?.pauseVideo?.(), 150);
            }
          }

          localPlayer.destroy?.();
        }
      };
    },
    [handleStateChange]
  );

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isMuted,
        currentTime,
        duration,
        play,
        toggle,
        pause,
        resume,
        seek,
        skip,
        toggleMute,
        takeOverWithVisiblePlayer,
      }}
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