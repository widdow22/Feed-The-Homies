import { useRef, useEffect } from "react";

const W = 320, H = 200;
const HORIZON = 82;
const ROAD_BOT = 162;
const VP_X = 160;
const ROAD_L = 48;
const ROAD_R = 272;

// Seeded LCG pseudo-random for consistent layout
function lcg(seed: number) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

// Pre-computed stars
const starRng = lcg(7);
const STARS = Array.from({ length: 65 }, () => ({
  x: Math.floor(starRng() * W),
  y: Math.floor(starRng() * (HORIZON - 4)),
  big: starRng() > 0.82,
}));

// Dallas skyline: [x, heightAboveHorizon, width]
const BLDGS: [number, number, number][] = [
  [0, 20, 14], [15, 33, 11], [27, 24, 16], [44, 42, 12],
  [57, 28, 9], [67, 37, 15], [83, 48, 14], [98, 31, 11],
  [110, 56, 15],  // Bank of America area (tallest left cluster)
  [126, 40, 9],   [136, 46, 8],
  // Reunion Tower mast at x=146-150 (drawn separately)
  [157, 36, 13], [171, 26, 17], [189, 43, 10], [200, 49, 19],
  [220, 30, 13], [234, 38, 20], [255, 25, 14], [270, 33, 17],
  [288, 20, 13], [302, 28, 15], [318, 17, 8],
];

// Pre-computed windows per building
const winRng = lcg(33);
const WINDOWS = BLDGS.flatMap(([bx, bh, bw], bi) => {
  const n = Math.floor(winRng() * 5) + 2;
  return Array.from({ length: n }, () => ({
    bi,
    rx: Math.floor(winRng() * Math.max(1, bw - 4)) + 2,
    ry: Math.floor(winRng() * Math.max(1, bh - 6)) + 2,
  }));
});

function roadLeftX(y: number) { return VP_X - ((y - HORIZON) / (ROAD_BOT - HORIZON)) * (VP_X - ROAD_L); }
function roadRightX(y: number) { return VP_X + ((y - HORIZON) / (ROAD_BOT - HORIZON)) * (ROAD_R - VP_X); }

export default function DrivingScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carXRef = useRef(0.5);   // 0=left, 1=right
  const targetXRef = useRef(0.5);
  const dashOffRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    let animId: number;

    const draw = () => {
      // Lerp car toward target (smooth follow, or return to center)
      carXRef.current += (targetXRef.current - carXRef.current) * 0.12;
      dashOffRef.current = (dashOffRef.current + 0.045) % 1;

      // ── SKY ──────────────────────────────────────────────────────
      ctx.fillStyle = "#000514";
      ctx.fillRect(0, 0, W, HORIZON);

      // Stars
      for (const s of STARS) {
        ctx.fillStyle = s.big ? "#ffffc8" : "#ffffff";
        ctx.fillRect(s.x, s.y, s.big ? 2 : 1, s.big ? 2 : 1);
      }

      // ── SKYLINE ──────────────────────────────────────────────────
      // Building silhouettes
      for (const [bx, bh, bw] of BLDGS) {
        const topY = HORIZON - bh;
        ctx.fillStyle = "#0c0c38";
        ctx.fillRect(bx, topY, bw, bh);
      }

      // Reunion Tower — mast
      ctx.fillStyle = "#14144a";
      ctx.fillRect(146, HORIZON - 64, 5, 64);
      // Ball (Reunion Tower)
      ctx.fillStyle = "#1e1e60";
      const ballCX = 148, ballCY = HORIZON - 66, ballR = 11;
      ctx.beginPath();
      ctx.arc(ballCX, ballCY, ballR, 0, Math.PI * 2);
      ctx.fill();
      // Ball ring / deck rings
      ctx.fillStyle = "#2828aa";
      ctx.fillRect(ballCX - ballR, ballCY - 1, ballR * 2, 2);
      ctx.fillRect(ballCX - ballR + 2, ballCY - 4, (ballR - 2) * 2, 2);
      // Ball top light
      ctx.fillStyle = "#00ffee";
      ctx.fillRect(ballCX - 1, ballCY - ballR - 1, 2, 2);

      // Windows (lit up)
      for (const { bi, rx, ry } of WINDOWS) {
        const [bx, bh] = BLDGS[bi];
        const topY = HORIZON - bh;
        ctx.fillStyle = Math.sin(bi * 5 + ry) > 0 ? "#ffffcc" : "#ffeeaa";
        ctx.fillRect(bx + rx, topY + ry, 2, 2);
      }

      // Reunion Tower ball lights
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + frameRef.current * 0.02;
        const lx = Math.round(ballCX + Math.cos(angle) * (ballR - 3));
        const ly = Math.round(ballCY + Math.sin(angle) * (ballR - 3));
        ctx.fillStyle = i % 2 === 0 ? "#00ffee" : "#ff00cc";
        ctx.fillRect(lx, ly, 1, 1);
      }

      // ── ROAD ─────────────────────────────────────────────────────
      // Road surface trapezoid
      ctx.fillStyle = "#0d0d0d";
      ctx.beginPath();
      ctx.moveTo(VP_X, HORIZON);
      ctx.lineTo(ROAD_R, ROAD_BOT);
      ctx.lineTo(ROAD_L, ROAD_BOT);
      ctx.closePath();
      ctx.fill();

      // Green shoulder stripes (left)
      ctx.fillStyle = "#00ff44";
      ctx.beginPath();
      ctx.moveTo(VP_X, HORIZON);
      ctx.lineTo(VP_X + 1, HORIZON);
      ctx.lineTo(ROAD_L + 5, ROAD_BOT);
      ctx.lineTo(ROAD_L, ROAD_BOT);
      ctx.closePath();
      ctx.fill();

      // Green shoulder stripes (right)
      ctx.beginPath();
      ctx.moveTo(VP_X, HORIZON);
      ctx.lineTo(VP_X - 1, HORIZON);
      ctx.lineTo(ROAD_R - 5, ROAD_BOT);
      ctx.lineTo(ROAD_R, ROAD_BOT);
      ctx.closePath();
      ctx.fill();

      // Sidewalk / median (outer green strips)
      ctx.fillStyle = "#003318";
      ctx.beginPath();
      ctx.moveTo(VP_X + 1, HORIZON);
      ctx.lineTo(VP_X + 3, HORIZON);
      ctx.lineTo(ROAD_R + 10, ROAD_BOT);
      ctx.lineTo(ROAD_R + 5, ROAD_BOT);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(VP_X - 1, HORIZON);
      ctx.lineTo(VP_X - 3, HORIZON);
      ctx.lineTo(ROAD_L - 5, ROAD_BOT);
      ctx.lineTo(ROAD_L - 10, ROAD_BOT);
      ctx.closePath();
      ctx.fill();

      // Center lane dashes (animated)
      ctx.fillStyle = "#00ff44";
      const N = 7;
      for (let i = 0; i < N; i++) {
        const t = ((i + dashOffRef.current) % N) / N;
        if (t < 0.06) continue;
        const y = HORIZON + t * (ROAD_BOT - HORIZON);
        const dw = Math.max(1, Math.round(t * 4));
        const dh = Math.max(2, Math.round(t * 9));
        ctx.fillRect(Math.round(VP_X - dw / 2), Math.round(y - dh / 2), dw, dh);
      }

      // ── CAR ──────────────────────────────────────────────────────
      const carT = (148 - HORIZON) / (ROAD_BOT - HORIZON);
      const carRL = roadLeftX(148);
      const carRR = roadRightX(148);
      const cxRaw = carRL + carXRef.current * (carRR - carRL);
      const cx = Math.round(Math.max(carRL + 16, Math.min(carRR - 16, cxRaw)));
      const cy = 148;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(cx - 12, cy - 1, 24, 3);

      // Lower body
      ctx.fillStyle = "#cc2200";
      ctx.fillRect(cx - 13, cy - 8, 26, 8);
      // Cabin
      ctx.fillStyle = "#bb1e00";
      ctx.fillRect(cx - 9, cy - 18, 18, 10);
      // Roof
      ctx.fillStyle = "#991500";
      ctx.fillRect(cx - 7, cy - 20, 14, 2);
      // Rear window
      ctx.fillStyle = "#223366";
      ctx.fillRect(cx - 6, cy - 16, 12, 6);
      // Rear bumper
      ctx.fillStyle = "#880000";
      ctx.fillRect(cx - 11, cy - 1, 22, 2);
      // Tail lights
      ctx.fillStyle = "#ff5500";
      ctx.fillRect(cx - 14, cy - 7, 3, 5);
      ctx.fillRect(cx + 11, cy - 7, 3, 5);
      // Bright tail light center
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(cx - 13, cy - 6, 1, 3);
      ctx.fillRect(cx + 12, cy - 6, 1, 3);

      // ── DASHBOARD ────────────────────────────────────────────────
      // Purple base
      ctx.fillStyle = "#5500aa";
      ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
      ctx.fillStyle = "#6611bb";
      ctx.fillRect(0, ROAD_BOT + 3, W, H - ROAD_BOT - 3);

      // Display panels
      ctx.fillStyle = "#000000";
      ctx.fillRect(8, ROAD_BOT + 5, 88, H - ROAD_BOT - 8);  // left
      ctx.fillRect(116, ROAD_BOT + 5, 88, H - ROAD_BOT - 8); // center
      ctx.fillRect(224, ROAD_BOT + 5, 88, H - ROAD_BOT - 8); // right

      // Panel text
      ctx.fillStyle = "#00ff44";
      ctx.font = 'bold 7px "Courier New"';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const midY = ROAD_BOT + (H - ROAD_BOT) / 2 + 1;
      ctx.fillText("FEED THE HOMIES", 52, midY);
      ctx.fillStyle = "#00ffee";
      ctx.fillText("DALLAS, TX", 160, midY - 4);
      ctx.fillStyle = "#ff00cc";
      ctx.fillText("2025", 160, midY + 5);
      ctx.fillStyle = "#00ff44";
      ctx.fillText("THE BLOCK", 268, midY);

      frameRef.current++;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  const setTarget = (clientX: number, rect: DOMRect) => {
    targetXRef.current = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  return (
    <div style={{ width: "100%", background: "#000514", lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          imageRendering: "pixelated",
          cursor: "crosshair",
        }}
        onMouseMove={(e) => setTarget(e.clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => { targetXRef.current = 0.5; }}
        onTouchMove={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          setTarget(t.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onTouchEnd={() => { targetXRef.current = 0.5; }}
      />
      <div style={{
        textAlign: "center",
        padding: "6px 0 4px",
        fontFamily: "'Courier New', monospace",
        fontSize: 9,
        color: "rgba(0,255,68,0.45)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        background: "#000514",
      }}>
        move to drive · dallas, texas
      </div>
    </div>
  );
}
