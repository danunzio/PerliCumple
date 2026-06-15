"use client";

import { useRef, useCallback } from "react";
import { usePlayer } from "@/context/PlayerContext";

export default function ProgressBar({ accentColor }: { accentColor: string }) {
  const { state, seek } = usePlayer();
  const barRef = useRef<HTMLDivElement>(null);

  const progress =
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const handleSeek = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar || state.duration <= 0) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      seek(ratio * state.duration);
    },
    [state.duration, seek]
  );

  return (
    <div className="w-full px-4">
      <div
        ref={barRef}
        className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group pb-2 pt-2 -mt-2"
        onClick={(e) => handleSeek(e.clientX)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) handleSeek(touch.clientX);
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full transition-all duration-150 group-hover:h-2"
          style={{ width: `${progress}%`, backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-lg scale-0 group-hover:scale-100"
          style={{
            left: `calc(${progress}% - 6px)`,
            backgroundColor: accentColor,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-text-muted mt-1">
        <span>{formatTime(state.currentTime)}</span>
        <span>{formatTime(state.duration)}</span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
