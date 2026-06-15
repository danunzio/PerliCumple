"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePlayer } from "@/context/PlayerContext";

function playOpenSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext not available
  }
}

export default function PortfolioPage() {
  const router = useRouter();
  const { state } = usePlayer();
  const {
    photos,
    shuffledOrder,
    initialized,
    shakingIndex,
    unlockedCount,
    isComplete,
    tryUnlock,
    isUnlocked,
    isNext,
    getOrderPosition,
    totalPhotos,
  } = usePortfolio();

  const noMusic = !state.isPlaying && unlockedCount < totalPhotos;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState<number | null>(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePhotoClick = useCallback(
    (originalIndex: number) => {
      if (!state.isPlaying) return;

      if (isUnlocked(originalIndex)) {
        setSelectedPhoto(photos[originalIndex]);
        setSelectedOriginalIndex(originalIndex);
        setCanClose(false);
        setCountdown(3);
        playOpenSound();
        return;
      }

      const result = tryUnlock(originalIndex);
      if (result) {
        setSelectedPhoto(photos[originalIndex]);
        setSelectedOriginalIndex(originalIndex);
        setCanClose(false);
        setCountdown(3);
        playOpenSound();
      }
    },
    [isUnlocked, tryUnlock, photos, state.isPlaying]
  );

  useEffect(() => {
    if (selectedPhoto) {
      let remaining = 3;
      setCountdown(remaining);
      setCanClose(false);

      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setCanClose(true);
        }
      }, 1000);

      return () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    }
  }, [selectedPhoto]);

  const closeModal = useCallback(() => {
    setSelectedPhoto(null);
    setSelectedOriginalIndex(null);
    setCanClose(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-[100dvh] bg-surface text-white flex items-center justify-center">
        <div className="animate-pulse-soft text-text-secondary text-sm">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-surface text-white">
      <div className="flex items-center gap-4 px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-4">
        <button
          onClick={() => router.back()}
          className="text-white/60 hover:text-white active:scale-90 transition-all duration-150 p-3 -ml-3"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Mi Porfolio</h1>
          <p className="text-xs text-text-secondary">
            {unlockedCount} / {totalPhotos} desbloqueadas
          </p>
        </div>
        {isComplete && (
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium">
            Completo
          </span>
        )}
      </div>

      <div className="px-4 pb-3">
        <div className="w-full bg-surface-highlight rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(unlockedCount / totalPhotos) * 100}%` }}
          />
        </div>
      </div>

      {noMusic && (
        <div className="px-4 pb-3 animate-fade-in">
          <div className="bg-accent/15 border border-accent/30 rounded-xl px-4 py-3 text-center animate-pulse-soft">
            <p className="text-accent font-semibold text-sm">Acá falta música para poder verme!!!</p>
          </div>
        </div>
      )}

      <main className="px-2 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {shuffledOrder.map((originalIndex, position) => {
            const unlocked = isUnlocked(originalIndex);
            const next = isNext(originalIndex);
            const shaking = shakingIndex === originalIndex;
            const orderNum = getOrderPosition(originalIndex);

            return (
              <button
                key={originalIndex}
                onClick={() => handlePhotoClick(originalIndex)}
                className={`aspect-square rounded-xl overflow-hidden bg-surface-highlight active:scale-[0.97] transition-all duration-150 relative ${
                  shaking ? "animate-shake" : ""
                }`}
              >
                <img
                  src={photos[originalIndex]}
                  alt={`Foto ${orderNum}`}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    unlocked ? "" : "blur-xl scale-110"
                  }`}
                  loading="lazy"
                />

                {!unlocked && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                    {next ? (
                      <svg className="w-6 h-6 text-accent animate-pulse-soft" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    )}
                    <span className={`text-sm font-bold ${next ? "text-accent" : "text-white/60"}`}>
                      {orderNum}
                    </span>
                  </div>
                )}

                {unlocked && (
                  <>
                    <div className="absolute top-1.5 left-1.5 bg-accent/90 backdrop-blur-sm text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {orderNum}
                    </div>
                    <div className="absolute bottom-1.5 right-1.5">
                      <svg className="w-4 h-4 text-accent drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {selectedPhoto && selectedOriginalIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-fade-in"
          onClick={canClose ? closeModal : undefined}
        >
          {!canClose && (
            <div className="absolute top-[max(3rem,env(safe-area-inset-top))] left-0 right-0 flex justify-center pt-4 z-10">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <span className="text-sm text-text-secondary font-medium">
                  Habilitando en {countdown}s...
                </span>
              </div>
            </div>
          )}

          {canClose && (
            <button
              onClick={closeModal}
              className="absolute top-[max(3rem,env(safe-area-inset-top))] right-4 text-white/60 hover:text-white active:scale-90 transition-all z-10 p-3 -mr-3 -mt-3"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}

          <img
            src={selectedPhoto}
            alt="Foto ampliada"
            className="max-w-full max-h-[80vh] object-contain p-4 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          />

          {canClose && (
            <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center pb-4">
              <button
                onClick={closeModal}
                className="bg-accent text-white font-medium px-6 py-3 rounded-full active:scale-95 transition-all duration-150"
              >
                Volver al portfolio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
