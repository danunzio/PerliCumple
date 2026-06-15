"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { secretPhotos } from "@/data/secretPhotos";

export function useSecretPhotos(songId: string) {
  const [currentSecret, setCurrentSecret] = useState<string | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const shownRef = useRef<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSongIdRef = useRef(songId);

  const TAPS_NEEDED = 5;

  const playSecretSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // AudioContext not available
    }
  }, []);

  const reveal = useCallback(() => {
    if (currentSecret) return;

    const newCount = tapCount + 1;

    if (newCount < TAPS_NEEDED) {
      setTapCount(newCount);
      return;
    }

    setTapCount(0);

    const available = secretPhotos
      .map((_, i) => i)
      .filter((i) => !shownRef.current.has(i));

    let pickIndex: number;
    if (available.length === 0) {
      shownRef.current = new Set();
      pickIndex = Math.floor(Math.random() * secretPhotos.length);
    } else {
      pickIndex = available[Math.floor(Math.random() * available.length)];
    }

    shownRef.current.add(pickIndex);
    setCurrentSecret(secretPhotos[pickIndex]);
    playSecretSound();

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentSecret(null);
    }, 5000);
  }, [currentSecret, tapCount, playSecretSound]);

  useEffect(() => {
    if (prevSongIdRef.current !== songId) {
      setTapCount(0);
      prevSongIdRef.current = songId;
    }
  }, [songId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { currentSecret, tapCount, reveal };
}
