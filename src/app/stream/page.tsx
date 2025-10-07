"use client";

import LiveStreamDashboard from "@/components/stream/LiveStreamDashboard";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import MusicPlayer from "@/components/common/MusicPlayer";
import { AppContextProvider } from "@/contexts/AppContext";

export default function StreamPage() {
  return (
    <AppContextProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-24">
          <LiveStreamDashboard />
        </main>
        <Footer />
        <MusicPlayer />
      </div>
    </AppContextProvider>
  );
}
