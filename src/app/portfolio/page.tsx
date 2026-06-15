"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { photos } from "@/data/photos";

export default function PortfolioPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

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
        <div>
          <h1 className="text-xl font-bold">Mi Porfolio</h1>
          <p className="text-xs text-text-secondary">{photos.length} fotos</p>
        </div>
      </div>

      <main className="px-2 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photos.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(src)}
              className="aspect-square rounded-xl overflow-hidden bg-surface-highlight active:scale-[0.97] transition-all duration-150"
            >
              <img
                src={src}
                alt={`Foto ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-[max(3rem,env(safe-area-inset-top))] right-4 text-white/60 hover:text-white active:scale-90 transition-all z-10 p-3 -mr-3 -mt-3"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <img
            src={selected}
            alt="Foto ampliada"
            className="max-w-full max-h-full object-contain p-4 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
