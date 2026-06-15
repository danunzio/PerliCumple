import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import SplashScreen from "@/components/SplashScreen";
import SplashGuard from "@/components/SplashGuard";
import RewardModal from "@/components/RewardModal";

export const metadata: Metadata = {
  title: "Feliz Cumple Perlita 🎉",
  description:
    "Para celebrar los 3 años de Perlita. Hecho con mucho amor.",
  openGraph: {
    title: "Feliz Cumple Perlita 🎉",
    description: "Para celebrar los 3 años de Perlita!. Hecho con mucho amor!.",
    url: "https://perli-cumple.vercel.app",
    siteName: "Perli Cumple",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Perlita Rockera",
      },
    ],
    type: "website",
  },
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
          <RewardModal />
          <SplashGuard>
            {children}
          </SplashGuard>
        </PlayerProvider>
      </body>
    </html>
  );
}
