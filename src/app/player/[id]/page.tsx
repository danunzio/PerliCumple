"use client";

import { useParams, useRouter } from "next/navigation";
import { playlist } from "@/data/playlist";
import { usePlayer } from "@/context/PlayerContext";
import { useSecretPhotos } from "@/hooks/useSecretPhotos";
import ProgressBar from "@/components/ProgressBar";
import PlayerControls from "@/components/PlayerControls";
import LyricsView from "@/components/LyricsView";

export default function NowPlayingPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = usePlayer();

  const song = state.currentSong || playlist.find((s) => s.id === params.id);
  const { currentSecret, reveal } = useSecretPhotos(song?.id ?? "");

  if (!song) {
    return (
      <div className="min-h-[100dvh] bg-surface flex items-center justify-center">
        <p className="text-text-muted animate-fade-in">Canción no encontrada</p>
      </div>
    );
  }

  const accentColor = song.accentColor || "#FF69B4";
  const isLiked = state.likedSongs.has(song.id);

  if (state.showLyrics) {
    return (
      <LyricsView
        accentColor={accentColor}
        onClose={() => dispatch({ type: "TOGGLE_LYRICS" })}
      />
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background: `linear-gradient(to bottom, ${accentColor}dd 0%, ${accentColor}44 30%, #121212 70%)`,
      }}
    >
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 animate-slide-down">
        <button
          onClick={() => router.back()}
          className="text-white/60 hover:text-white active:scale-90 transition-all duration-150 p-3 -ml-3"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </button>
        <p className="text-xs text-white/60 font-semibold uppercase tracking-wider">
          LO QUE SUENA
        </p>
        <button
          onClick={() => dispatch({ type: "TOGGLE_LIKE", songId: song.id })}
          className="active:scale-90 transition-all duration-150 p-3 -mr-3"
        >
          {isLiked ? (
            <svg className="w-6 h-6 drop-shadow-lg" fill="#E91E63" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white/60 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
            </svg>
          )}
        </button>
      </div>

      <div key={song.id} className="flex-1 flex flex-col items-center justify-center px-6">
        <div
          onClick={reveal}
          className={`w-full max-w-sm aspect-square rounded-2xl overflow-hidden mb-8 transition-all duration-700 ease-out cursor-pointer active:scale-[0.97] ${
            state.isPlaying && !currentSecret ? "animate-float-cover" : ""
          }`}
          style={{
            boxShadow: state.isPlaying 
              ? `0 20px 50px -10px ${accentColor}88, 0 0 40px ${accentColor}44` 
              : `0 10px 30px -10px rgba(0,0,0,0.8)`
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={song.coverSrc}
              alt={song.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                currentSecret ? "opacity-0 scale-95" : "opacity-100"
              } ${state.isPlaying && !currentSecret ? "scale-110" : "scale-100"}`}
            />
            {currentSecret && (
              <img
                src={currentSecret}
                alt="Secreto"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in-scale"
              />
            )}
          </div>
        </div>

        <div className="text-center w-full max-w-sm mb-6 animate-fade-in-up animate-stagger-2">
          <h2 className="text-xl font-bold text-white mb-1">{song.title}</h2>
          <p className="text-sm text-white/60">{song.artist}</p>
          {song.dedication && (
            <p
              className="text-sm mt-2 italic animate-fade-in"
              style={{ color: `${accentColor}cc` }}
            >
              💝 {song.dedication}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6 pb-[max(2rem,env(safe-area-inset-bottom))] animate-fade-in-up animate-stagger-3">
        <ProgressBar accentColor={accentColor} />
        <PlayerControls accentColor={accentColor} />

        {((typeof song.lyrics === "string" && song.lyrics.trim().length > 0) || (Array.isArray(song.lyrics) && song.lyrics.length > 0)) && (
          <div className="flex justify-center animate-fade-in-up animate-stagger-4">
            <button
              onClick={() => dispatch({ type: "TOGGLE_LYRICS" })}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white active:scale-95 transition-all duration-150 p-3"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 14.5L4 19l1.5 1.5L9 17h2l-2.5-2.5zM15 1c-1.1 0-2 .9-2 2v13.5c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zm6 2h-2v13.5c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zm-9.09 5.64C10.25 6.09 7.83 5 5 5 3.58 5 2.23 5.27 1 5.75v15.42C2.23 20.23 3.58 20 5 20c2.83 0 5.25 1.09 6.91 2.36.46.36 1.09.09 1.09-.55V7.19c0-.45-.35-.81-.79-.55z" />
              </svg>
              Ver letra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
