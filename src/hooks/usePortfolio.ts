"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { photos } from "@/data/photos";

const STORAGE_KEY = "portfolio-progress";

interface PortfolioProgress {
  order: number[];
  unlocked: number[];
}

function shuffleArray(arr: number[]): number[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function loadProgress(): PortfolioProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveProgress(progress: PortfolioProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage not available
  }
}

export function usePortfolio() {
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set());
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.order.length === photos.length) {
      setShuffledOrder(saved.order);
      setUnlocked(new Set(saved.unlocked));
    } else {
      const indices = photos.map((_, i) => i);
      const order = shuffleArray(indices);
      setShuffledOrder(order);
      setUnlocked(new Set());
      saveProgress({ order, unlocked: [] });
    }
    setInitialized(true);
  }, []);

  const persist = useCallback((order: number[], unlockedSet: Set<number>) => {
    saveProgress({ order, unlocked: Array.from(unlockedSet) });
  }, []);

  const getNextIndex = useCallback((): number => {
    for (let i = 0; i < shuffledOrder.length; i++) {
      if (!unlocked.has(shuffledOrder[i])) return shuffledOrder[i];
    }
    return -1;
  }, [shuffledOrder, unlocked]);

  const tryUnlock = useCallback(
    (clickedIndex: number): boolean => {
      if (unlocked.has(clickedIndex)) return true;

      const nextIndex = getNextIndex();
      if (clickedIndex === nextIndex) {
        const newUnlocked = new Set(unlocked);
        newUnlocked.add(clickedIndex);
        setUnlocked(newUnlocked);
        persist(shuffledOrder, newUnlocked);
        return true;
      }

      setShakingIndex(clickedIndex);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakingIndex(null), 600);
      return false;
    },
    [unlocked, getNextIndex, shuffledOrder, persist]
  );

  const isUnlocked = useCallback(
    (index: number) => unlocked.has(index),
    [unlocked]
  );

  const isNext = useCallback(
    (index: number) => {
      const nextIndex = getNextIndex();
      return nextIndex === index;
    },
    [getNextIndex]
  );

  const isComplete = unlocked.size === photos.length;

  const unlockedCount = unlocked.size;

  const getOrderPosition = useCallback(
    (index: number): number => {
      return shuffledOrder.indexOf(index) + 1;
    },
    [shuffledOrder]
  );

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  return {
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
    totalPhotos: photos.length,
  };
}
