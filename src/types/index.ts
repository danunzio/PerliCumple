export interface LyricLine {
  time: number;
  text: string;
}

export type LyricsData = string | LyricLine[];

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  coverType: "image" | "gif";
  coverSrc: string;
  duration: number;
  lyrics: LyricsData;
  dedication: string;
  accentColor: string;
}

export type RepeatMode = "off" | "one" | "all";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  showSplash: boolean;
  showLyrics: boolean;
  likedSongs: Set<string>;
  showQueue: boolean;
  completedSongs: Set<string>;
  rewardShown: boolean;
  showReward: boolean;
  rewardPending: boolean;
}

export type PlayerAction =
  | { type: "PLAY_SONG"; song: Song; queue: Song[] }
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PROGRESS"; currentTime: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SEEK"; time: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "TOGGLE_REPEAT" }
  | { type: "DISMISS_SPLASH" }
  | { type: "TOGGLE_LYRICS" }
  | { type: "TOGGLE_QUEUE" }
  | { type: "TOGGLE_LIKE"; songId: string }
  | { type: "DISMISS_REWARD" };
