import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Track {
  title: string;
  artist: string;
  duration: string;
}

const TRACKS: Track[] = [
  { title: "Pure Love",  artist: "LUCKI", duration: "2:05" },
  { title: "Randomly",   artist: "LUCKI", duration: "2:08" },
  { title: "RIP Act",    artist: "LUCKI", duration: "1:28" },
  { title: "Runnin",     artist: "LUCKI", duration: "2:29" },
  { title: "Tarantino",  artist: "LUCKI", duration: "1:34" },
  { title: "TUNE &",     artist: "LUCKI", duration: "2:18" },
  { title: "Unlimited",  artist: "LUCKI", duration: "2:41" },
];

interface PlayerState {
  open: boolean;
  setOpen: (v: boolean) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  showPlaylist: boolean;
  setShowPlaylist: (v: boolean) => void;
  trackIdx: number;
  minimized: boolean;
  setMinimized: (v: boolean) => void;
  prevTrack: () => void;
  nextTrack: () => void;
  goToTrack: (i: number) => void;
  tracks: Track[];
}

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const prevTrack = useCallback(() => setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length), []);
  const nextTrack = useCallback(() => setTrackIdx((i) => (i + 1) % TRACKS.length), []);
  const goToTrack = useCallback((i: number) => setTrackIdx(Math.max(0, Math.min(TRACKS.length - 1, i))), []);

  return (
    <PlayerContext.Provider value={{
      open, setOpen,
      playing, setPlaying,
      showPlaylist, setShowPlaylist,
      trackIdx,
      minimized, setMinimized,
      prevTrack, nextTrack, goToTrack,
      tracks: TRACKS,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
