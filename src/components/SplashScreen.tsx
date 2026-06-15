"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const { state, dispatch } = usePlayer();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!state.showSplash) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [state.showSplash]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-end transition-opacity duration-600 ${
        state.showSplash ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/media/covers/Cumpl3.jpg)" }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />

      <div className="relative z-10 w-full flex justify-center pb-16 px-6">
        <button
          onClick={() => dispatch({ type: "DISMISS_SPLASH" })}
          className="bg-black/30 backdrop-blur-md text-white text-lg font-semibold py-4 px-14 rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-black/40 active:scale-95 hover:scale-105 transition-all duration-200 animate-fade-in-up animate-pulse-soft"
        >
          ¡Empezar!
        </button>
      </div>
    </div>
  );
}
