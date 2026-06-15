"use client";

import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

const VIDEO_SRC =
  "/media/fotos/Secretos/WhatsApp Video 2026-06-15 at 12.00.16 AM.mp4";

export default function RewardModal() {
  const { state, dispatch } = usePlayer();
  const [showVideo, setShowVideo] = useState(false);

  if (!state.showReward) return null;

  const handleDismiss = () => {
    dispatch({ type: "DISMISS_REWARD" });
  };

  const handleWatch = () => {
    setShowVideo(true);
  };

  if (showVideo) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <video
          src={VIDEO_SRC}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
          onEnded={handleDismiss}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="text-center px-6 max-w-sm">
        <p className="text-2xl mb-3">🎉</p>
        <h2 className="text-2xl font-bold text-white mb-3">
          Felicitaciones!
        </h2>
        <p className="text-base text-white/70 leading-relaxed mb-8">
          Por soportar tanta cultura musical,
          <br />
          <span className="text-accent font-semibold">Perli</span> te regala un
          video...
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDismiss}
            className="px-6 py-3 rounded-full text-white/50 hover:text-white border border-white/20 hover:bg-white/10 transition-all duration-200 text-sm"
          >
            No ahora
          </button>
          <button
            onClick={handleWatch}
            className="px-8 py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent/80 active:scale-95 transition-all duration-200 text-sm"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}
