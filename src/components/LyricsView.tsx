"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useRef, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import PlayerControls from "./PlayerControls";
import { LyricLine, LyricsData } from "@/types";

function isTimedLyrics(lyrics: LyricsData): lyrics is LyricLine[] {
  return Array.isArray(lyrics);
}

function getLyricsLines(lyrics: LyricsData): string[] {
  if (typeof lyrics === "string") {
    return lyrics.split("\n").filter((line) => line.trim().length > 0);
  }
  return lyrics.map((l) => l.text);
}

export default function LyricsView({
  accentColor,
  onClose,
}: {
  accentColor: string;
  onClose: () => void;
}) {
  const { state } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  const lyrics: LyricsData = state.currentSong?.lyrics || "";
  const isSynced = isTimedLyrics(lyrics);
  const currentTime = state.currentTime;

  let currentLine = -1;
  if (isSynced) {
    currentLine = (lyrics as LyricLine[]).findLastIndex(
      (l) => l.time <= currentTime
    );
  }

  const lines = getLyricsLines(lyrics);

  useEffect(() => {
    if (isSynced && activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine, isSynced]);

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col animate-slide-up"
      style={{
        background: `linear-gradient(to bottom, ${accentColor} 0%, #121212 60%)`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white active:scale-90 transition-all duration-150"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-white/80">Letras</h2>
        <div className="w-6" />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-4"
      >
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-full animate-fade-in">
            <p className="text-text-muted text-lg">Sin letras disponibles</p>
          </div>
        ) : isSynced ? (
          <div className="space-y-6">
            {lyrics.map((line: LyricLine, idx: number) => {
              const isActive = idx === currentLine;
              const isPast = idx < currentLine;
              return (
                <p
                  key={idx}
                  ref={isActive ? activeRef : undefined}
                  className={`text-2xl leading-relaxed transition-all duration-500 ${
                    isActive
                      ? "text-white font-bold scale-105"
                      : isPast
                      ? "text-white/30"
                      : "text-white/50"
                  }`}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {lines.map((line, idx) => (
              <p
                key={idx}
                className="text-xl leading-relaxed text-white/70"
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="pb-6 space-y-4 bg-gradient-to-t from-black/40 to-transparent pt-4">
        <ProgressBar accentColor={accentColor} />
        <PlayerControls accentColor={accentColor} />
      </div>
    </div>
  );
}
