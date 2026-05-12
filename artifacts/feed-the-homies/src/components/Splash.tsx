import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashProps {
  onEnter: () => void;
}

const Win95Button = ({
  children,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: "'Arial', 'MS Sans Serif', sans-serif",
      fontSize: 11,
      padding: "3px 14px",
      background: "#d4d0c8",
      color: "#000",
      border: primary
        ? "2px solid #000"
        : "none",
      outline: "none",
      cursor: "default",
      minWidth: 75,
      boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff, inset -2px -2px 0 #aea89e, inset 2px 2px 0 #ddd",
      position: "relative",
      userSelect: "none",
    }}
    onMouseDown={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff, inset 2px 2px 0 #aea89e, inset -2px -2px 0 #ddd";
    }}
    onMouseUp={(e) => {
      (e.currentTarget as HTMLButtonElement).style.boxShadow =
        "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff, inset -2px -2px 0 #aea89e, inset 2px 2px 0 #ddd";
    }}
  >
    {children}
  </button>
);

export default function Splash({ onEnter }: SplashProps) {
  const [minimized, setMinimized] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    setLoading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 6;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => onEnter(), 300);
      }
    }, 80);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#008080",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Arial', 'MS Sans Serif', sans-serif",
        }}
      >
        {/* Desktop icons top-left */}
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { icon: "🖥️", label: "My Computer" },
            { icon: "🗑️", label: "Recycle Bin" },
            { icon: "📁", label: "Feed The Homies" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "default", width: 64 }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span style={{
                fontSize: 10,
                color: "#fff",
                textAlign: "center",
                textShadow: "1px 1px 0 #000",
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main dialog window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: minimized ? 0 : 1, opacity: minimized ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "min(480px, 92vw)",
            background: "#d4d0c8",
            boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff, inset -2px -2px 0 #aea89e, inset 2px 2px 0 #ece9d8, 4px 4px 0 rgba(0,0,0,0.4)",
            position: "relative",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
              padding: "3px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>📁</span>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>
                Feed The Homies — Welcome
              </span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {/* Minimize */}
              <button
                onClick={() => setMinimized(true)}
                style={{
                  width: 16, height: 14, background: "#d4d0c8", border: "none",
                  fontSize: 9, cursor: "default", display: "flex", alignItems: "flex-end",
                  justifyContent: "center", paddingBottom: 2,
                  boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff",
                }}
              >_</button>
              {/* Maximize (disabled) */}
              <button
                style={{
                  width: 16, height: 14, background: "#d4d0c8", border: "none",
                  fontSize: 9, cursor: "default",
                  boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff",
                }}
              >□</button>
              {/* Close */}
              <button
                onClick={handleEnter}
                style={{
                  width: 16, height: 14, background: "#d4d0c8", border: "none",
                  fontSize: 9, fontWeight: "bold", cursor: "default",
                  boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff",
                }}
              >✕</button>
            </div>
          </div>

          {/* Menu bar */}
          <div style={{
            background: "#d4d0c8",
            borderBottom: "1px solid #aea89e",
            padding: "2px 4px",
            display: "flex",
            gap: 8,
          }}>
            {["File", "Edit", "View", "Favorites", "Help"].map((m) => (
              <span key={m} style={{ fontSize: 11, padding: "1px 4px", cursor: "default" }}>{m}</span>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{
            background: "#d4d0c8",
            borderBottom: "1px solid #aea89e",
            padding: "3px 6px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{ fontSize: 10, color: "#808080" }}>◀ Back</span>
            <span style={{ fontSize: 10, color: "#808080" }}>▶ Forward</span>
            <span style={{ fontSize: 10, color: "#808080", marginLeft: 4 }}>⬆ Up</span>
            <div style={{
              flex: 1, marginLeft: 8, display: "flex", alignItems: "center",
              background: "#fff",
              border: "1px solid #808080",
              padding: "1px 4px",
              boxShadow: "inset 1px 1px 0 #aea89e",
            }}>
              <span style={{ fontSize: 10, color: "#000080" }}>C:\FeedTheHomies\Welcome.exe</span>
            </div>
          </div>

          {/* Content area */}
          <div style={{ display: "flex", minHeight: 280 }}>
            {/* Left panel — folder tree */}
            <div style={{
              width: 140,
              background: "#fff",
              borderRight: "2px solid #aea89e",
              padding: "8px 6px",
              fontSize: 10,
              overflow: "hidden",
            }}>
              <div style={{ fontWeight: "bold", marginBottom: 6, color: "#000080", fontSize: 11 }}>
                📂 Feed the Homies
              </div>
              {[
                { icon: "📁", label: "About Us", indent: 1 },
                { icon: "📁", label: "The Mission", indent: 1 },
                { icon: "📁", label: "The Drop", indent: 1 },
                { icon: "📰", label: "Dallas Informant", indent: 1, highlight: true },
                { icon: "📁", label: "Join Us", indent: 1 },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 4px",
                    paddingLeft: item.indent * 12,
                    fontSize: 10,
                    background: item.highlight ? "#000080" : "transparent",
                    color: item.highlight ? "#fff" : "#000",
                    cursor: "default",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Right panel — welcome content */}
            <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 40 }}>🍲</span>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 15, color: "#000080", lineHeight: 1.2 }}>
                    Feed The Homies
                  </div>
                  <div style={{ fontSize: 10, color: "#808080" }}>
                    Version 2025 · Texas · Est. 2020
                  </div>
                </div>
              </div>

              {/* Inset info box */}
              <div style={{
                background: "#fff",
                border: "2px solid #aea89e",
                boxShadow: "inset 1px 1px 0 #808080",
                padding: "8px 10px",
                fontSize: 10,
                lineHeight: 1.7,
                color: "#000",
              }}>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>Welcome to Feed the Homies</div>
                <p>This site contains:</p>
                <ul style={{ paddingLeft: 16, margin: "4px 0" }}>
                  <li>📌 Our mission &amp; story</li>
                  <li>👕 Limited hoodie drops</li>
                  <li>📰 The Dallas Informant</li>
                  <li>🗳️ Voting info &amp; community events</li>
                </ul>
                <p style={{ marginTop: 4, color: "#000080" }}>
                  "food · culture · awareness · action"
                </p>
              </div>

              {/* Progress bar (shown during loading) */}
              {loading && (
                <div>
                  <div style={{ fontSize: 10, marginBottom: 4 }}>Loading Feed the Homies...</div>
                  <div style={{
                    height: 16,
                    background: "#fff",
                    border: "1px solid #808080",
                    boxShadow: "inset 1px 1px 0 #aea89e",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${progress}%`,
                      background: "#000080",
                      transition: "width 0.08s linear",
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            background: "#d4d0c8",
            borderTop: "1px solid #aea89e",
            padding: "2px 6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 10, color: "#000" }}>5 object(s)</span>
            <span style={{ fontSize: 10, color: "#808080" }}>feedthehomies.org</span>
          </div>

          {/* Button row */}
          <div style={{
            padding: "10px 12px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            borderTop: "1px solid #aea89e",
          }}>
            <Win95Button onClick={handleEnter} primary>
              OK — Enter Site
            </Win95Button>
            <Win95Button onClick={() => setMinimized(true)}>
              Cancel
            </Win95Button>
          </div>
        </motion.div>

        {/* Taskbar */}
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 32,
          background: "#d4d0c8",
          borderTop: "2px solid #fff",
          display: "flex",
          alignItems: "center",
          gap: 0,
          boxShadow: "inset 0 1px 0 #fff",
          zIndex: 10,
        }}>
          {/* Start button */}
          <button
            style={{
              height: "100%",
              padding: "0 12px",
              background: "#d4d0c8",
              border: "none",
              borderRight: "1px solid #aea89e",
              fontWeight: "bold",
              fontSize: 11,
              cursor: "default",
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #fff",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>⊞</span> Start
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "#aea89e", margin: "0 4px" }} />

          {/* Open window indicator */}
          <div style={{
            height: 22,
            padding: "0 8px",
            background: "#d4d0c8",
            border: "1px solid #808080",
            boxShadow: "inset 1px 1px 0 #aea89e",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            cursor: "default",
          }}>
            <span>📁</span>
            <span>Feed The Homies — Welcome</span>
          </div>

          {/* Clock */}
          <div style={{ marginLeft: "auto", padding: "0 10px", fontSize: 10, cursor: "default" }}>
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Minimized — click taskbar to restore */}
        {minimized && (
          <div
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, top: 0, zIndex: 9 }}
            onClick={() => setMinimized(false)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
