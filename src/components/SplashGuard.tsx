"use client";

import { usePlayer } from "@/context/PlayerContext";
import { ReactNode } from "react";

export default function SplashGuard({ children }: { children: ReactNode }) {
  const { state } = usePlayer();

  return (
    <div
      className={`transition-opacity duration-500 ease-out ${
        state.showSplash ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
