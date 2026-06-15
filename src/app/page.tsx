"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { playlist } from "@/data/playlist";
import SongItem from "@/components/SongItem";
import MiniPlayer from "@/components/MiniPlayer";
import { usePlayer } from "@/context/PlayerContext";

export default function HomePage() {
  const { state } = usePlayer();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const filteredSongs =
    filter === "favorites"
      ? playlist.filter((s) => state.likedSongs.has(s.id))
      : playlist;

  const bgStyle = state.currentSong?.accentColor
    ? { backgroundImage: `linear-gradient(to bottom, ${state.currentSong.accentColor}22 0%, #121212 400px)` }
    : { backgroundImage: `linear-gradient(to bottom, #FF69B415 0%, #121212 400px)` };

  return (
    <div 
      className="min-h-[100dvh] bg-surface text-white transition-colors duration-700 animate-fade-in"
      style={bgStyle}
    >
      <div className="pb-8">
      <header className="px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-6">
        <div className="flex items-center gap-4 mb-2">
          <img
            src="/media/fotos/3.jpg"
            alt="Perlita"
            className="w-14 h-14 rounded-full object-cover shadow-lg flex-shrink-0"
          />
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">
              Playlist especial
            </p>
            <h1 className="text-2xl font-bold text-white">
              Feliz Cumple Perlita!!!
            </h1>
            <p className="text-xs text-text-secondary">
              {filteredSongs.length} canciones para celebrar
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              filter === "all"
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              filter === "favorites"
                ? "bg-white text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            Favoritas
          </button>
        </div>
      </header>

      <main className="px-2">
        <div className="space-y-0.5">
          {filteredSongs.map((song) => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>

        <div className="px-3 mt-6 mb-4">
          <button
            onClick={() => router.push("/portfolio")}
            className="w-full group flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 text-white/80 font-medium hover:from-white/10 hover:to-white/5 hover:border-white/20 active:scale-[0.98] transition-all duration-200 shadow-[0_0_0px_rgba(255,255,255,0)] hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
          >
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            Mi Porfolio
          </button>
        </div>
      </main>

      {state.currentSong && (
        <div className="h-20" />
      )}
      </div>
      <MiniPlayer />
    </div>
  );
}
