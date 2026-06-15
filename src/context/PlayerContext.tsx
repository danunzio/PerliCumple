"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Song, PlayerState, PlayerAction, RepeatMode } from "@/types";

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isShuffled: false,
  repeatMode: "off",
  queue: [],
  queueIndex: -1,
  showSplash: true,
  showLyrics: false,
  likedSongs: new Set(),
  showQueue: false,
  completedSongs: new Set<string>(),
  rewardShown: false,
  showReward: false,
  rewardPending: false,
};

const TOTAL_SONGS = 16;
const SONG_THRESHOLD = 0.9;
const TOTAL_THRESHOLD = 0.8;
const MIN_COMPLETED = Math.ceil(TOTAL_SONGS * TOTAL_THRESHOLD); // 13

function loadPersistedState(): Partial<PlayerState> {
  try {
    const completedRaw = localStorage.getItem("perli-completed");
    const rewardShownRaw = localStorage.getItem("perli-reward-shown");
    return {
      completedSongs: completedRaw
        ? new Set<string>(JSON.parse(completedRaw))
        : new Set<string>(),
      rewardShown: rewardShownRaw === "true",
    };
  } catch {
    return {};
  }
}

function getNextIndex(
  queueIndex: number,
  queueLength: number,
  repeatMode: RepeatMode,
  isShuffled: boolean
): number {
  if (repeatMode === "one") return queueIndex;
  const next = queueIndex + 1;
  if (next >= queueLength) {
    if (repeatMode === "all") return 0;
    return -1;
  }
  return next;
}

function getPrevIndex(queueIndex: number, queueLength: number): number {
  const prev = queueIndex - 1;
  if (prev < 0) return queueLength > 1 ? queueLength - 1 : 0;
  return prev;
}

function shuffleQueue(queue: Song[], currentId: string): Song[] {
  const shuffled = [...queue.filter((s) => s.id !== currentId)];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [queue.find((s) => s.id === currentId)!, ...shuffled];
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY_SONG": {
      const idx = action.queue.findIndex((s) => s.id === action.song.id);
      return {
        ...state,
        currentSong: action.song,
        isPlaying: true,
        currentTime: 0,
        queue: action.queue,
        queueIndex: idx >= 0 ? idx : 0,
        showLyrics: false,
        showQueue: false,
      };
    }
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_PROGRESS": {
      const update: Partial<PlayerState> = { currentTime: action.currentTime };

      if (state.currentSong && state.duration > 0) {
        const progress = action.currentTime / state.duration;
        if (progress >= SONG_THRESHOLD && !state.completedSongs.has(state.currentSong.id)) {
          const newCompleted = new Set(state.completedSongs);
          newCompleted.add(state.currentSong.id);
          update.completedSongs = newCompleted;

          if (newCompleted.size >= MIN_COMPLETED && !state.rewardShown && !state.rewardPending) {
            update.rewardPending = true;
          }
        }
      }

      return { ...state, ...update };
    }
    case "SET_DURATION":
      return { ...state, duration: action.duration };
    case "SEEK":
      return { ...state, currentTime: action.time };
    case "NEXT": {
      if (state.rewardPending) {
        return {
          ...state,
          showReward: true,
          isPlaying: false,
          rewardPending: false,
        };
      }

      const nextIdx = getNextIndex(
        state.queueIndex,
        state.queue.length,
        state.repeatMode,
        state.isShuffled
      );
      if (nextIdx < 0) {
        return { ...state, isPlaying: false, currentTime: 0 };
      }
      return {
        ...state,
        queueIndex: nextIdx,
        currentSong: state.queue[nextIdx],
        isPlaying: true,
        currentTime: 0,
      };
    }
    case "PREV": {
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      const prevIdx = getPrevIndex(state.queueIndex, state.queue.length);
      return {
        ...state,
        queueIndex: prevIdx,
        currentSong: state.queue[prevIdx],
        isPlaying: true,
        currentTime: 0,
      };
    }
    case "TOGGLE_SHUFFLE": {
      const newShuffled = !state.isShuffled;
      if (newShuffled && state.currentSong) {
        return {
          ...state,
          isShuffled: newShuffled,
          queue: shuffleQueue(state.queue, state.currentSong.id),
          queueIndex: 0,
        };
      }
      return { ...state, isShuffled: newShuffled };
    }
    case "TOGGLE_REPEAT": {
      const modes: RepeatMode[] = ["off", "all", "one"];
      const currentIdx = modes.indexOf(state.repeatMode);
      return { ...state, repeatMode: modes[(currentIdx + 1) % modes.length] };
    }
    case "DISMISS_SPLASH":
      return { ...state, showSplash: false };
    case "DISMISS_REWARD":
      return { ...state, showReward: false, rewardShown: true };
    case "TOGGLE_LYRICS":
      return { ...state, showLyrics: !state.showLyrics };
    case "TOGGLE_QUEUE":
      return { ...state, showQueue: !state.showQueue };
    case "TOGGLE_LIKE": {
      const newLiked = new Set(state.likedSongs);
      if (newLiked.has(action.songId)) {
        newLiked.delete(action.songId);
      } else {
        newLiked.add(action.songId);
      }
      return { ...state, likedSongs: newLiked };
    }
    default:
      return state;
  }
}

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playSong: (song: Song, queue: Song[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  next: () => void;
  prev: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    playerReducer,
    initialState,
    (initial) => ({ ...initial, ...loadPersistedState() })
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSong = useCallback(
    (song: Song, queue: Song[]) => {
      dispatch({ type: "PLAY_SONG", song, queue });
    },
    []
  );

  const togglePlay = useCallback(() => {
    dispatch({ type: "TOGGLE_PLAY" });
  }, []);

  const seek = useCallback((time: number) => {
    dispatch({ type: "SEEK", time });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const prev = useCallback(() => {
    dispatch({ type: "PREV" });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlaying, state.currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    audio.volume = state.volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.volume, state.currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      dispatch({ type: "SET_PROGRESS", currentTime: audio.currentTime });
    };
    const onLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", duration: audio.duration });
    };
    const onEnded = () => {
      dispatch({ type: "NEXT" });
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [state.currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    const targetTime = state.currentTime;
    if (Math.abs(audio.currentTime - targetTime) > 0.5) {
      audio.currentTime = targetTime;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTime, state.currentSong?.id]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "perli-completed",
        JSON.stringify(Array.from(state.completedSongs))
      );
    } catch {
      /* localStorage not available */
    }
  }, [state.completedSongs]);

  useEffect(() => {
    if (state.rewardShown) {
      try {
        localStorage.setItem("perli-reward-shown", "true");
      } catch {
        /* localStorage not available */
      }
    }
  }, [state.rewardShown]);

  return (
    <PlayerContext.Provider
      value={{ state, dispatch, audioRef, playSong, togglePlay, seek, next, prev }}
    >
      {children}
      {state.currentSong && (
        <audio
          ref={audioRef}
          src={state.currentSong.audioSrc}
          preload="auto"
        />
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
