import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";

const TOTAL_RAISED = 24847;
const TOTAL_DONATED = 18230;

const ALLOCATIONS = [
  { emoji: "🍲", category: "Meals", allocated: 8200, goal: 10000 },
  { emoji: "🧴", category: "Toiletry Kits", allocated: 2800, goal: 4000 },
];

const INITIAL_FEED = [
  { id: 1, type: "donation", amount: 150, note: "Anonymous from Dallas", ts: Date.now() - 2 * 60 * 1000 },
  { id: 2, type: "allocation", amount: 500, note: "50 meals funded — Oak Cliff pop-up", ts: Date.now() - 18 * 60 * 1000 },
  { id: 3, type: "donation", amount: 75, note: "Jordan T.", ts: Date.now() - 42 * 60 * 1000 },
  { id: 4, type: "donation", amount: 1000, note: "Anonymous", ts: Date.now() - 63 * 60 * 1000 },
  { id: 5, type: "allocation", amount: 200, note: "Toiletry kits — shelter run", ts: Date.now() - 3 * 60 * 60 * 1000 },
  { id: 6, type: "donation", amount: 50, note: "Maria G. from Houston", ts: Date.now() - 5 * 60 * 60 * 1000 },
  { id: 7, type: "allocation", amount: 300, note: "Print run — FTH stickers & flyers", ts: Date.now() - 27 * 60 * 60 * 1000 },
  { id: 8, type: "donation", amount: 250, note: "Community First Church", ts: Date.now() - 32 * 60 * 60 * 1000 },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function PulsingNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 3);
      if (delta > 0) {
        setDisplay((v) => v + delta);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "inline-block",
        transition: "transform 0.3s ease, color 0.3s ease",
        transform: pulse ? "scale(1.018)" : "scale(1)",
        color: pulse ? "#00ffee" : "#F2E8D5",
        textShadow: pulse ? "0 0 30px rgba(0,255,238,0.4)" : "none",
      }}
    >
      ${fmt(display)}
    </span>
  );
}

interface FeedItem {
  id: number;
  type: string;
  amount: number;
  note: string;
  ts: number;
}

function SpeakerBlock({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div style={{
      width: 48, height: 140, flexShrink: 0,
      background: "linear-gradient(180deg, #00c8b8 0%, #008f83 35%, #005e57 70%, #003a35 100%)",
      borderRadius: isLeft ? "12px 5px 5px 12px" : "5px 12px 12px 5px",
      boxShadow: isLeft
        ? "inset 3px 0 10px rgba(0,0,0,0.4), inset -2px 0 6px rgba(0,255,238,0.1), -4px 0 12px rgba(0,0,0,0.5)"
        : "inset -3px 0 10px rgba(0,0,0,0.4), inset 2px 0 6px rgba(0,255,238,0.1), 4px 0 12px rgba(0,0,0,0.5)",
      position: "relative", overflow: "hidden", alignSelf: "center",
    }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 7, right: 7, top: 18 + i * 11, height: 2, background: "rgba(0,0,0,0.42)", borderRadius: 1 }} />
      ))}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 28, height: 28, borderRadius: "50%",
        background: "radial-gradient(circle, #002e2b 0%, #001a17 60%, #000 100%)",
        boxShadow: "0 0 0 3px #005850, 0 0 0 5px #003a35, inset 0 0 8px rgba(0,0,0,0.9)",
      }} />
    </div>
  );
}

function PhysicalBtn({
  children, onClick, "aria-label": ariaLabel,
}: {
  children: React.ReactNode; onClick: () => void; "aria-label": string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: 38, height: 22,
        background: pressed ? "#003a35" : "linear-gradient(180deg, #00c8b8 0%, #008f83 100%)",
        border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: pressed
          ? "inset 2px 2px 4px rgba(0,0,0,0.6)"
          : "0 3px 0 #003a35, 0 4px 0 #002e2b, inset 0 1px 0 rgba(255,255,255,0.2)",
        transform: pressed ? "translateY(2px)" : "none",
        transition: "transform 0.05s, box-shadow 0.05s",
        color: pressed ? "#00ffee" : "#001a17",
        fontWeight: "bold", userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}

export default function Transparency() {
  const { tracks, trackIdx, playing, setPlaying, prevTrack, nextTrack, goToTrack } = usePlayer();
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [newEntry, setNewEntry] = useState<number | null>(null);
  const nextId = useRef(100);

  // Simulate live feed updates every 30s
  useEffect(() => {
    const fakeDonations = [
      { type: "donation", amount: 35, note: "Anonymous" },
      { type: "donation", amount: 100, note: "T. Washington from Irving" },
      { type: "allocation", amount: 150, note: "Groceries — weekly family box" },
      { type: "donation", amount: 25, note: "First-time donor 💜" },
      { type: "allocation", amount: 400, note: "40 meals — South Dallas run" },
      { type: "donation", amount: 500, note: "Anonymous from Fort Worth" },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const item = fakeDonations[idx % fakeDonations.length];
      const id = nextId.current++;
      idx++;
      setFeed((prev) => [{ id, ...item, ts: Date.now() }, ...prev.slice(0, 10)]);
      setNewEntry(id);
      setTimeout(() => setNewEntry(null), 1500);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } },
  };

  return (
    <section
      id="mission"
      className="py-32 px-6 md:px-12 relative"
      style={{ background: "#080d18" }}
      data-testid="section-transparency"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,255,238,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-20">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p
            className="font-mono text-xs uppercase tracking-widest mb-3"
            style={{ color: "rgba(0,255,238,0.5)" }}
          >
            // live · updated in real time
          </p>
          <h2
            className="font-orbitron font-black uppercase text-white leading-none"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
          >
            Where Every Dollar Goes
          </h2>
          <p className="font-sans text-sm text-white/40 mt-3 lowercase">
            total radical transparency. no asterisks. no fine print.
          </p>
        </motion.div>

        {/* Hero total */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-center text-center gap-4"
          style={{
            border: "1px solid rgba(0,255,238,0.12)",
            padding: "40px 24px",
            background: "rgba(0,255,238,0.02)",
          }}
        >
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "rgba(0,255,238,0.4)" }}
          >
            total raised
          </p>
          <div
            className="font-orbitron font-black"
            style={{ fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 1 }}
          >
            <PulsingNumber value={TOTAL_RAISED} />
          </div>
          <div className="flex gap-8 mt-2">
            <div className="flex flex-col items-center gap-1">
              <span className="font-orbitron font-bold text-lg" style={{ color: "#C4847A" }}>
                ${fmt(TOTAL_DONATED)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                donated out
              </span>
            </div>
            <div
              style={{
                width: 1,
                background: "rgba(255,255,255,0.08)",
                alignSelf: "stretch",
              }}
            />
            <div className="flex flex-col items-center gap-1">
              <span className="font-orbitron font-bold text-lg" style={{ color: "#00ffee" }}>
                ${fmt(ALLOCATIONS.reduce((s, a) => s + a.allocated, 0))}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                allocated
              </span>
            </div>
          </div>
        </motion.div>

        {/* Allocation bars */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h3
            className="font-orbitron font-bold uppercase text-white text-sm tracking-widest mb-8"
          >
            Where It Goes
          </h3>
          <div className="flex flex-col gap-7">
            {ALLOCATIONS.map((a, i) => {
              const pct = Math.min((a.allocated / a.goal) * 100, 100);
              return (
                <motion.div
                  key={a.category}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 16 }}>{a.emoji}</span>
                      <span className="font-sans text-sm text-white/80 lowercase">
                        {a.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white/50">
                        ${fmt(a.allocated)}
                      </span>
                      <span className="font-mono text-xs text-white/20">/</span>
                      <span className="font-mono text-xs text-white/30">
                        ${fmt(a.goal)}
                      </span>
                    </div>
                  </div>
                  {/* Track */}
                  <div
                    style={{
                      height: 8,
                      background: "rgba(255,255,255,0.06)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 1, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        background:
                          pct > 85
                            ? "linear-gradient(90deg, #C4847A 0%, #ff6b6b 100%)"
                            : "linear-gradient(90deg, #006655 0%, #00ffee 100%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[9px] text-white/20">
                      {pct.toFixed(0)}% toward goal
                    </span>
                    {pct >= 100 && (
                      <span
                        className="font-mono text-[9px] uppercase tracking-widest"
                        style={{ color: "#C4847A" }}
                      >
                        goal reached ✓
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Live feed */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-orbitron font-bold uppercase text-white text-sm tracking-widest">
              Live Feed
            </h3>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00ffee",
                  display: "inline-block",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: "rgba(0,255,238,0.4)" }}
              >
                live · refreshes every 30s
              </span>
            </div>
          </div>

          <div
            className="flex flex-col gap-0"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <AnimatePresence initial={false}>
              {feed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={item.id === newEntry ? { opacity: 0, y: -8, background: "rgba(0,255,238,0.08)" } : false}
                  animate={{ opacity: 1, y: 0, background: "transparent" }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: item.id === newEntry ? "rgba(0,255,238,0.05)" : "transparent",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span style={{ fontSize: 14, flexShrink: 0 }}>
                      {item.type === "donation" ? "💜" : "📤"}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
                        style={{
                          color:
                            item.type === "donation"
                              ? "#C4847A"
                              : "rgba(0,255,238,0.6)",
                        }}
                      >
                        {item.type}
                      </div>
                      <p className="font-sans text-xs text-white/50 truncate lowercase">
                        {item.note}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className="font-orbitron font-bold text-sm"
                      style={{
                        color:
                          item.type === "donation" ? "#F2E8D5" : "rgba(0,255,238,0.7)",
                      }}
                    >
                      +${fmt(item.amount)}
                    </span>
                    <span
                      className="font-mono text-[9px] text-white/25 w-12 text-right"
                    >
                      {timeAgo(item.ts)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>{/* end max-w-4xl */}

      {/* ── HEAD MUSIC STAGE — full-width breakout ─────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 56, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "3rem" }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>

          {/* ── HEAD + SPEAKERS BLOCK ── */}
          <div style={{ flex: "1 1 300px", maxWidth: 680, minWidth: 260, display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Physical transport buttons — raised 3D style */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, zIndex: 2 }}>
              {([
                { label: "⏮", aria: "Previous track", fn: prevTrack },
                { label: playing ? "⏸" : "▶", aria: playing ? "Pause" : "Play", fn: () => setPlaying(!playing) },
                { label: "⏹", aria: "Stop", fn: () => setPlaying(false) },
                { label: "⏭", aria: "Next track", fn: nextTrack },
              ] as { label: string; aria: string; fn: () => void }[]).map(({ label, aria, fn }) => (
                <PhysicalBtn key={aria} aria-label={aria} onClick={fn}>{label}</PhysicalBtn>
              ))}
            </div>

            {/* Speakers + head row */}
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>

              {/* LEFT SPEAKER */}
              <SpeakerBlock side="left" />

              {/* HEAD — relative positioning container */}
              <div style={{ position: "relative", flex: 1, display: "flex", justifyContent: "center" }}>
                {/* Floating bob */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                  style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%" }}
                >
                  {/* Pulsing ambient glow */}
                  <motion.div
                    aria-hidden="true"
                    animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                    style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "130%", height: "130%", borderRadius: "50%",
                      background: "radial-gradient(ellipse at center, rgba(0,255,238,0.22) 0%, rgba(0,200,200,0.10) 35%, rgba(0,100,140,0.04) 65%, transparent 80%)",
                      filter: "blur(32px)", pointerEvents: "none", zIndex: 0,
                    }}
                  />

                  {/* Blue head image */}
                  <img
                    src="/blue-head.png"
                    alt=""
                    aria-hidden="true"
                    style={{
                      height: "min(68vh, 620px)",
                      width: "auto",
                      maxWidth: "100%",
                      display: "block",
                      filter: "drop-shadow(0 0 80px rgba(0,255,238,0.45))",
                      userSelect: "none",
                      pointerEvents: "none",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />

                  {/* Spotify face screen — sits in the face area like a built-in TV */}
                  <div style={{
                    position: "absolute",
                    top: "29%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "52%",
                    zIndex: 2,
                    background: "#000",
                    borderRadius: 6,
                    boxShadow: [
                      "0 0 0 3px #001a17",
                      "0 0 0 5px #002e2b",
                      "inset 3px 3px 12px rgba(0,0,0,0.95)",
                      "0 0 20px rgba(0,255,238,0.12)",
                    ].join(", "),
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    {/* CRT chrome bar */}
                    <div style={{
                      background: "#001a17",
                      padding: "3px 8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #003322",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 7, color: "rgba(0,255,238,0.45)", letterSpacing: "0.15em" }}>
                        FTH · RADIO
                      </span>
                      <span style={{ fontSize: 8, color: playing ? "#00ff44" : "rgba(255,255,255,0.2)" }}>◉</span>
                    </div>

                    {/* Spotify embed */}
                    <iframe
                      src="https://open.spotify.com/embed/playlist/6jlUN17DYWF20m6oX3Z1Kx?utm_source=generator&theme=0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title="Feed the Homies Playlist"
                      style={{ flex: 1, width: "100%", border: "none", display: "block", minHeight: 152 }}
                    />

                    {/* CRT scanlines */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 3px)",
                      pointerEvents: "none", borderRadius: "inherit",
                    }} />
                  </div>
                </motion.div>
              </div>

              {/* RIGHT SPEAKER */}
              <SpeakerBlock side="right" />
            </div>
          </div>

          {/* PLAYLIST panel */}
          <div style={{
            flex: "0 0 260px",
            background: "#030a10",
            border: "1px solid rgba(0,255,238,0.1)",
            borderLeft: "none",
            fontFamily: "'Courier New', monospace",
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            minHeight: 220,
          }}>
            <div style={{ padding: "9px 14px", borderBottom: "1px solid rgba(0,255,238,0.08)", fontSize: 8, color: "rgba(0,255,238,0.38)", letterSpacing: "0.2em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
              <span>PLAYLIST</span>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>{tracks.length} TRK</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {tracks.map((track, i) => (
                <button
                  key={i}
                  onClick={() => goToTrack(i)}
                  style={{
                    display: "flex", width: "100%", alignItems: "center", gap: 8,
                    padding: "11px 14px",
                    background: i === trackIdx ? "rgba(0,255,68,0.07)" : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    borderTop: "none", borderRight: "none",
                    borderLeft: i === trackIdx ? "2px solid #00ff44" : "2px solid transparent",
                    cursor: "pointer", fontFamily: "'Courier New', monospace", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 9, color: i === trackIdx ? "#00ffee" : "rgba(255,255,255,0.18)", flexShrink: 0, width: 20 }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span style={{ fontSize: 10, color: i === trackIdx ? "#00ff44" : "rgba(255,255,255,0.42)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {track.title}
                  </span>
                  <span style={{ fontSize: 9, color: i === trackIdx ? "rgba(0,255,238,0.5)" : "rgba(255,255,255,0.2)", flexShrink: 0, marginLeft: 4 }}>
                    {track.duration}
                  </span>
                  {i === trackIdx && (
                    <span style={{ fontSize: 8, color: "rgba(0,255,68,0.55)", flexShrink: 0, marginLeft: 3 }}>▶</span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
