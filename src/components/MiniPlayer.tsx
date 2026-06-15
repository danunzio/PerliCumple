"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MiniPlayer() {
  const { state, togglePlay } = usePlayer();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.currentSong) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentSong?.id]);

  if (!state.currentSong) return null;

  const accent = state.currentSong.accentColor || "#FF69B4";

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-350 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ background: `linear-gradient(to top, ${accent}dd, ${accent}88)` }}
    >
      <div className="backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => router.push(`/player/${state.currentSong?.id}`)}
          className="w-full flex items-center gap-3 px-4 py-3 active:scale-[0.98] transition-transform duration-150"
        >
          <img
            src={state.currentSong.coverSrc}
            alt={state.currentSong.title}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">
              {state.currentSong.title}
            </p>
            <p className="text-xs text-white/60 truncate">
              {state.currentSong.artist}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-10 h-10 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform duration-150"
          >
            {state.isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </button>
      </div>
    </div>
  );
}
