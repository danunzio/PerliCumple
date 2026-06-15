"use client";

import { usePlayer } from "@/context/PlayerContext";

export default function PlayerControls({
  accentColor,
}: {
  accentColor: string;
}) {
  const { state, togglePlay, next, prev } = usePlayer();

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={prev}
        className="text-white/60 hover:text-white active:scale-90 transition-all duration-150 p-4"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        onClick={togglePlay}
        className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 hover:scale-105 transition-all duration-200"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 24px ${accentColor}66`,
        }}
      >
        {state.isPlaying ? (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={next}
        className="text-white/60 hover:text-white active:scale-90 transition-all duration-150 p-4"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
}
