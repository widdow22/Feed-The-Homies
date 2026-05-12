import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Transparency from "@/components/Transparency";
import DrivingScene from "@/components/DrivingScene";

const HERO_WORDS = ["FEED", "THE", "HOMIES"];

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.82,
    filter: "blur(18px)",
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.22,
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function Home() {
  const [swatchEmails, setSwatchEmails] = useState<{ [key: string]: string }>({});
  const [swatchNotified, setSwatchNotified] = useState<{ [key: string]: boolean }>({});
  const [joinEmail, setJoinEmail] = useState("");
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const slideUpFade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const heroStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 2 }
    }
  };

  // Particle flow field — noise-based
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.8 + y * 0.5 + t * 0.25) * 0.50 +
      Math.sin(x * 0.3 - y * 1.0 + t * 0.18) * 0.30 +
      Math.sin(x * 1.3 + y * 0.3 - t * 0.12) * 0.20;

    const NUM = 5000;
    const SPEED = 1.4;
    const MAX_AGE = 280;

    const px = new Float32Array(NUM);
    const py = new Float32Array(NUM);
    const age = new Float32Array(NUM);

    const reset = (i: number, w: number, h: number) => {
      px[i] = Math.random() * w;
      py[i] = Math.random() * h;
      age[i] = Math.random() * MAX_AGE;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "rgb(2, 6, 18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < NUM; i++) reset(i, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "rgba(2, 6, 18, 0.045)";
      ctx.fillRect(0, 0, w, h);

      const scale = 0.0022;
      for (let i = 0; i < NUM; i++) {
        age[i]++;
        if (age[i] > MAX_AGE || px[i] < 0 || px[i] > w || py[i] < 0 || py[i] > h) {
          reset(i, w, h); continue;
        }
        const angle = noise(px[i] * scale, py[i] * scale, t) * Math.PI * 2.5;
        const ox = px[i]; const oy = py[i];
        px[i] += Math.cos(angle) * SPEED;
        py[i] += Math.sin(angle) * SPEED;

        const life = age[i] / MAX_AGE;
        const alpha = Math.min(life * 6, 1) * (1 - life) * 0.75;
        const r = Math.floor(life * 40);
        const g = Math.floor(180 + life * 40);
        const b = Math.floor(220 - life * 80);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px[i], py[i]); ctx.stroke();
      }
      t += 0.004;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const handleSwatchSubmit = (e: React.FormEvent, name: string) => {
    e.preventDefault();
    setSwatchNotified(prev => ({ ...prev, [name]: true }));
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* 1. Hero */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden bg-black" data-testid="section-hero">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(2,6,18,0.7) 100%)" }} />

          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="relative z-10 flex flex-col items-center justify-center text-center gap-6"
          >
            <h1
              className={`${glitchActive ? "glitch" : ""} font-orbitron font-black uppercase tracking-tighter text-white leading-none`}
              style={{ fontSize: "clamp(2.8rem, 10vw, 9rem)", display: "flex", gap: "0.25em", flexWrap: "wrap", justifyContent: "center" }}
              data-text="FEED THE HOMIES"
            >
              {HERO_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="show"
                  style={{ display: "inline-block", whiteSpace: "nowrap" }}
                  onAnimationComplete={
                    i === HERO_WORDS.length - 1
                      ? () => setTimeout(() => setGlitchActive(true), 80)
                      : undefined
                  }
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.7, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              className="flex items-center gap-2 mt-2"
            >
              <span className="font-mono text-sm md:text-base tracking-widest" style={{ color: "#00ffee" }}>
                // you found us.
              </span>
              <span className="blink-cyan w-2 h-4 md:h-5 inline-block" />
            </motion.div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 3.5, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-1 z-10"
            style={{ color: "#00ffee" }}
          >
            <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
            <span className="font-mono text-xs">↓</span>
          </motion.div>
        </section>

        {/* 2. About */}
        <section id="about" className="pb-0 bg-primary text-foreground relative z-10 overflow-hidden" data-testid="section-about">
          <DrivingScene />
        </section>

        {/* 3. Transparency Dashboard */}
        <Transparency />

        {/* 4. About Us */}
        <section className="py-28 px-6 md:px-12 bg-[#000008] relative overflow-hidden" data-testid="section-about-us">
          <div className="absolute inset-0 pointer-events-none opacity-70" style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 15%, rgba(0,255,238,0.6) 0%, transparent 0%),
              radial-gradient(1px 1px at 25% 40%, rgba(255,0,204,0.5) 0%, transparent 0%),
              radial-gradient(1px 1px at 55% 20%, rgba(255,255,0,0.5) 0%, transparent 0%),
              radial-gradient(1px 1px at 70% 60%, rgba(0,255,238,0.4) 0%, transparent 0%),
              radial-gradient(1px 1px at 85% 35%, rgba(255,0,204,0.4) 0%, transparent 0%),
              radial-gradient(1px 1px at 40% 75%, rgba(255,255,255,0.4) 0%, transparent 0%)
            `,
          }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div style={{
              border: "1px solid rgba(0,255,238,0.25)",
              background: "rgba(3,8,14,0.86)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 0 60px rgba(0,255,238,0.12)",
              padding: "24px",
              color: "#d7f7ff",
            }}>
              <div style={{ fontFamily: "'Courier New', monospace", letterSpacing: "0.18em", fontSize: 12, color: "#00ffee", marginBottom: 14 }}>
                SYSTEM ERROR // ABOUT US
              </div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
                <div>about us:</div>
                <div>different people, different backgrounds,</div>
                <div>same collapsing society.</div>
                <div>so we decided to fix it ourselves, texas style.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { name: "Miko", role: "Founding organizer", line: "grew up around block parties, church plates, and hustle" },
                  { name: "Jay", role: "Street-level builder", line: "came from diy spaces, late nights, and making it work" },
                  { name: "T", role: "Community storyteller", line: "built from the south side, with love and a camera" },
                ].map((person, index) => (
                  <div key={person.name} style={{ border: "1px solid rgba(0,255,238,0.16)", background: "rgba(0,0,0,0.42)", padding: 14, minHeight: 132 }}>
                    <div style={{ fontFamily: "'Courier New', monospace", color: "#ff00cc", fontSize: 12, letterSpacing: "0.14em", marginBottom: 10 }}>
                      {String(index + 1).padStart(2, "0")} // {person.name}
                    </div>
                    <div style={{ fontFamily: "'Courier New', monospace", color: "#00ffee", fontSize: 13, marginBottom: 8 }}>{person.role}</div>
                    <div style={{ fontFamily: "'Courier New', monospace", color: "#d7f7ff", fontSize: 12, lineHeight: 1.7 }}>{person.line}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, fontFamily: "'Courier New', monospace", fontSize: 11, color: "rgba(215,247,255,0.72)", lineHeight: 1.8 }}>
                born from different corners, held together by the same need to feed folks, show up, and keep it real.
              </div>
            </div>
          </div>
        </section>

        {/* 5. Art — GeoCities world */}
        <section id="art" data-testid="section-art" style={{
          background: "#000008",
          backgroundImage: `
            radial-gradient(1px 1px at 10% 15%, rgba(0,255,238,0.6) 0%, transparent 0%),
            radial-gradient(1px 1px at 25% 40%, rgba(255,0,204,0.5) 0%, transparent 0%),
            radial-gradient(1px 1px at 55% 20%, rgba(255,255,0,0.5) 0%, transparent 0%),
            radial-gradient(1px 1px at 70% 60%, rgba(0,255,238,0.4) 0%, transparent 0%),
            radial-gradient(1px 1px at 85% 35%, rgba(255,0,204,0.4) 0%, transparent 0%),
            radial-gradient(1px 1px at 40% 75%, rgba(255,255,255,0.4) 0%, transparent 0%),
            radial-gradient(1px 1px at 90% 80%, rgba(0,255,68,0.5) 0%, transparent 0%),
            radial-gradient(1px 1px at 15% 85%, rgba(255,165,0,0.4) 0%, transparent 0%)
          `,
          padding: "60px 0 80px",
          borderTop: "4px ridge #ff00cc",
          borderBottom: "4px ridge #00ffee",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Tiled starfield overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: `radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 0%)`,
            backgroundSize: "24px 24px",
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

            {/* GeoCities header */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #ff00cc, #ffff00, #00ffee, #ff00cc)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
                fontSize: "clamp(2rem, 6vw, 3.8rem)",
                fontWeight: "bold",
                letterSpacing: "0.05em",
                animation: "geo-rainbow 3s linear infinite",
              }}>
                ✦ THE ART GALLERY ✦
              </div>
              <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 13, color: "#00ffee", marginTop: 6, letterSpacing: "0.1em" }}>
                :: cyberpunk edition :: est. 2020 :: feed the homies ::
              </div>

              {/* Blinking under-construction bar */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                marginTop: 18, background: "#000", border: "2px solid #ffff00",
                padding: "4px 18px", fontFamily: "'Comic Sans MS', cursive",
                fontSize: 11, color: "#ffff00", letterSpacing: "0.08em",
                animation: "geo-blink 1.1s step-end infinite",
              }}>
                🚧 UNDER CONSTRUCTION 🚧 &nbsp; NEW PIECES ADDED WEEKLY
              </div>

              {/* Visitor counter */}
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>VISITORS:</span>
                {"002847".split("").map((d, i) => (
                  <span key={i} style={{
                    display: "inline-block", width: 18, height: 24, background: "#000",
                    border: "1px solid #ff00cc", color: "#ff00cc",
                    fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: "bold",
                    lineHeight: "24px", textAlign: "center",
                  }}>{d}</span>
                ))}
              </div>
            </div>

            {/* Marquee banner */}
            <div style={{
              background: "#000080", border: "2px outset #9090ff",
              padding: "5px 0", marginBottom: 36, overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                display: "inline-block", whiteSpace: "nowrap",
                animation: "geo-marquee 18s linear infinite",
                fontFamily: "'Comic Sans MS', cursive", fontSize: 13,
                color: "#fff", letterSpacing: "0.08em",
              }}>
                &nbsp;&nbsp;&nbsp; 🎨 community art · culture · creativity · dallas · texas · feed the homies · open submissions soon · 🌟 best viewed in 800×600 · add us to your favorites! · ⭐ sign our guestbook · 🎨 community art · culture · creativity · dallas ·
              </div>
            </div>

            {/* Art grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
              {[
                {
                  title: "COMMUNION",
                  subtitle: "digital · 2024",
                  bg: "linear-gradient(135deg, #1a0033 0%, #3d0066 40%, #7700cc 70%, #ff00cc 100%)",
                  accent: "#ff00cc",
                  desc: "every plate is a prayer. every table, a shrine.",
                  stars: "★★★★★",
                },
                {
                  title: "DEEP ELLUM NIGHTS",
                  subtitle: "mixed media · 2023",
                  bg: "linear-gradient(135deg, #001a33 0%, #003366 50%, #0066aa 80%, #00ffee 100%)",
                  accent: "#00ffee",
                  desc: "the city breathes cyan after midnight.",
                  stars: "★★★★☆",
                },
                {
                  title: "HUNGER MAP",
                  subtitle: "data art · 2024",
                  bg: "linear-gradient(135deg, #1a0a00 0%, #4d1f00 40%, #994400 70%, #ff6600 100%)",
                  accent: "#ff6600",
                  desc: "visualizing food deserts, block by block.",
                  stars: "★★★★★",
                },
                {
                  title: "THE HOODIE",
                  subtitle: "textile · ongoing",
                  bg: "linear-gradient(135deg, #0a1a0a 0%, #1a3d1a 40%, #2d6b2d 70%, #00ff44 100%)",
                  accent: "#00ff44",
                  desc: "wear the mission. carry the culture.",
                  stars: "★★★★★",
                },
              ].map((piece, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{
                    border: `3px ridge ${piece.accent}`,
                    background: "#000",
                    boxShadow: `0 0 18px ${piece.accent}44, inset 0 0 0 2px #000`,
                  }}
                >
                  {/* Frame title bar */}
                  <div style={{
                    background: `linear-gradient(90deg, #000080 0%, ${piece.accent}44 100%)`,
                    padding: "4px 10px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderBottom: `1px solid ${piece.accent}66`,
                  }}>
                    <span style={{ fontFamily: "'MS Sans Serif', Arial, sans-serif", fontSize: 11, color: "#fff", fontWeight: "bold" }}>
                      {piece.title}.jpg
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: piece.accent }}>
                      🖼
                    </span>
                  </div>

                  {/* Art canvas area */}
                  <div style={{
                    height: 180, background: piece.bg, position: "relative", overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {/* Pixel noise overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
                      backgroundSize: "200px 200px", opacity: 0.4, mixBlendMode: "overlay",
                    }} />
                    <div style={{
                      fontFamily: "'Comic Sans MS', cursive",
                      fontSize: 11, color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.15em", textAlign: "center", lineHeight: 1.6,
                    }}>
                      [ PREVIEW ]<br />click to view
                    </div>
                  </div>

                  {/* Info panel */}
                  <div style={{ padding: "10px 12px", background: "#050505" }}>
                    <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 12, color: piece.accent, marginBottom: 4, fontWeight: "bold" }}>
                      {piece.title}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em" }}>
                      {piece.subtitle}
                    </div>
                    <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: 8 }}>
                      {piece.desc}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#ffff00" }}>{piece.stars}</span>
                      <span style={{
                        fontFamily: "'MS Sans Serif', Arial, sans-serif", fontSize: 9,
                        color: piece.accent, border: `1px outset ${piece.accent}`,
                        padding: "1px 8px", cursor: "default", background: "#000033",
                      }}>
                        view →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Guestbook + web ring row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>

              {/* Guestbook */}
              <div style={{
                border: "2px inset #c0c0c0", background: "#000033",
                padding: "14px 20px", minWidth: 240, flex: "1 1 240px", maxWidth: 340,
              }}>
                <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 14, color: "#ffff00", marginBottom: 10, textAlign: "center" }}>
                  📖 SIGN OUR GUESTBOOK
                </div>
                <input
                  type="text"
                  placeholder="your name..."
                  style={{
                    width: "100%", background: "#fff", border: "2px inset #808080",
                    fontFamily: "'Comic Sans MS', cursive", fontSize: 12,
                    padding: "3px 6px", color: "#000", marginBottom: 6, boxSizing: "border-box",
                  }}
                />
                <textarea
                  placeholder="leave a message for the homies..."
                  rows={3}
                  style={{
                    width: "100%", background: "#fff", border: "2px inset #808080",
                    fontFamily: "'Comic Sans MS', cursive", fontSize: 11,
                    padding: "3px 6px", color: "#000", resize: "none", marginBottom: 8, boxSizing: "border-box",
                  }}
                />
                <button style={{
                  width: "100%", background: "#c0c0c0", border: "2px outset #fff",
                  fontFamily: "'Comic Sans MS', cursive", fontSize: 12, cursor: "pointer", padding: "3px 0",
                }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.border = "2px inset #808080"; }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.border = "2px outset #fff"; }}
                >
                  ✉ Submit Entry
                </button>
              </div>

              {/* Web ring + badges */}
              <div style={{ flex: "1 1 240px", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ border: "2px outset #9090ff", background: "#000080", padding: "10px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 11, color: "#fff", marginBottom: 8 }}>
                    ◄ &nbsp; FTH ART WEBRING &nbsp; ►
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: "#aaaaff", lineHeight: 1.7 }}>
                    [prev] :: you are here :: [next]<br />
                    ring members: 12 · join free
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "Made with ❤ in Texas", bg: "#cc0000", fg: "#fff" },
                    { label: "Best in 800×600", bg: "#000080", fg: "#fff" },
                    { label: "Art Not War", bg: "#006600", fg: "#fff" },
                    { label: "FTH Certified", bg: "#330066", fg: "#ff00cc" },
                  ].map((badge) => (
                    <div key={badge.label} style={{
                      background: badge.bg, color: badge.fg, padding: "2px 8px",
                      fontFamily: "'Comic Sans MS', cursive", fontSize: 9,
                      border: "1px outset #808080", whiteSpace: "nowrap",
                    }}>
                      {badge.label}
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 10, color: "rgba(0,255,238,0.5)", lineHeight: 1.7, textAlign: "center" }}>
                  📧 submit your art → art@feedthehomies.org<br />
                  🌟 open to all community members
                </div>
              </div>
            </div>

          </div>

          {/* CSS keyframes injected inline */}
          <style>{`
            @keyframes geo-rainbow {
              0% { background-position: 0% 50%; }
              100% { background-position: 300% 50%; }
            }
            @keyframes geo-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            @keyframes geo-marquee {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-100%); }
            }
          `}</style>
        </section>

        {/* 6. Join Us */}
        <section id="join" className="py-40 px-6 md:px-12 bg-foreground text-background" data-testid="section-join">
          <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-12">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slideUpFade} className="flex flex-col gap-6 w-full">
              <h2 className="font-hand text-6xl md:text-7xl text-primary">stay close.</h2>
              <p className="font-sans text-sm italic opacity-70 lowercase">
                drop your email. we'll only reach out when it matters.
              </p>

              <div className="mt-8 w-full">
                {joinSubmitted ? (
                  <p className="font-hand text-3xl md:text-4xl text-primary" data-testid="text-join-success">
                    we got you. for real.
                  </p>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setJoinSubmitted(true); }} className="w-full relative">
                    <input
                      type="email"
                      required
                      placeholder="your email, if you want..."
                      className="w-full bg-transparent border-b-2 border-primary/30 text-background text-lg md:text-xl py-4 outline-none focus:border-primary transition-colors font-sans lowercase placeholder:text-background/40 placeholder:italic"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      data-testid="input-join-email"
                    />
                    <button type="submit" className="absolute right-0 bottom-4 text-primary font-sans text-sm uppercase tracking-widest hover:opacity-70 transition-opacity" data-testid="btn-join-submit">
                      send
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="py-16 px-6 md:px-12 bg-background border-t border-foreground/10" data-testid="footer">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl text-foreground">Feed the Homies.</h2>
              <p className="font-sans text-xs tracking-wide text-foreground/50">Texas. For the people. Est. 2020.</p>
              <p className="font-serif italic text-sm text-secondary mt-4">"every plate is a prayer."</p>
            </div>

            <div className="flex gap-8 font-sans text-xs uppercase tracking-widest text-foreground/50">
              <a href="#" className="hover:text-secondary transition-colors" data-testid="link-ig">Instagram</a>
              <a href="#" className="hover:text-secondary transition-colors" data-testid="link-tiktok">TikTok</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
