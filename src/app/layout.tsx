import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "Feliz Cumple Perlita 🎉",
  description:
    "Playlist especial para celebrar los 3 años de Perlita. Hecho con mucho amor.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-surface text-white antialiased">
        <PlayerProvider>
          <SplashScreen />
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
