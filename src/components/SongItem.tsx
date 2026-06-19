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

  const handlePlay = () => {
    playSong(song, playlist);
    router.push(`/player/${song.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handlePlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handlePlay();
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left cursor-pointer active:scale-[0.98] transition-all duration-150 ${
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/player/${song.id}`;
            if (navigator.share) {
              navigator.share({ title: song.title, url });
            } else {
              navigator.clipboard.writeText(url);
            }
          }}
          className="p-1 text-text-muted hover:text-accent transition-colors"
          title="Compartir canción"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
        </button>
        <span className="text-xs text-text-muted">
          {formatDuration(song.duration)}
        </span>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
