"use client";

import { Song } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { playlist } from "@/data/playlist";
import { useRouter } from "next/navigation";

export default function SongItem({ song }: { song: Song }) {
  const { state, playSong } = usePlayer();
  const router = useRouter();
  const isActive = state.currentSong?.id === song.id;
  const isLiked = state.likedSongs.has(song.id);

  return (
    <button
      onClick={() => {
        playSong(song, playlist);
        router.push(`/player/${song.id}`);
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left active:scale-[0.98] transition-all duration-150 ${
        isActive
          ? "bg-white/10"
          : "hover:bg-white/5"
      }`}
    >
      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-surface-highlight">
        <img
          src={song.coverSrc}
          alt={song.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "text-accent" : "text-white"
          }`}
        >
          {song.title}
        </p>
        <p className="text-xs text-text-secondary truncate">{song.artist}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {song.dedication && (
          <span className="text-xs text-accent/60">💝</span>
        )}
        {isLiked && <span className="text-xs text-accent">❤️</span>}
        <span className="text-xs text-text-muted">
          {formatDuration(song.duration)}
        </span>
      </div>
    </button>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
