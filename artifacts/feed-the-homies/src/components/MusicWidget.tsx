import { usePlayer } from "@/context/PlayerContext";

export default function MusicWidget() {
  const { playing, trackIdx, tracks } = usePlayer();
  const track = tracks[trackIdx];

  return (
    <div style={{
      position: "fixed",
      bottom: 40,
      right: 40,
      zIndex: 200,
      background: "rgba(3,8,14,0.9)",
      border: "1px solid rgba(0,180,198,0.35)",
      boxShadow: "0 0 24px rgba(0, 180, 198, 0.18)",
      padding: "8px 12px",
      fontFamily: "'Courier New', monospace",
      color: "#d7f7ff",
      fontSize: 10,
      letterSpacing: "0.08em",
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <span style={{ color: playing ? "#00ffee" : "rgba(0,255,238,0.35)", fontSize: 12 }}>{playing ? "▶" : "■"}</span>
      <span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {track?.artist} — {track?.title}
      </span>
    </div>
  );
}
