import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const GR = "#c0c0c0";
const DG = "#808080";
const WH = "#ffffff";
const BEV = `inset -1px -1px 0 ${DG}, inset 1px 1px 0 ${WH}`;
const FONT = "'MS Sans Serif', Arial, sans-serif";

function Win95Field({
  label, type = "text", value, onChange, id,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; id: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label htmlFor={id} style={{ fontFamily: FONT, fontSize: 12, color: "#000" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 22,
          background: "#fff",
          border: "none",
          boxShadow: `inset 1px 1px 0 ${DG}, inset -1px -1px 0 ${WH}`,
          fontFamily: FONT,
          fontSize: 12,
          padding: "0 4px",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          color: "#000",
        }}
      />
    </div>
  );
}

function Win95Btn({
  children, onClick, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit";
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: GR,
        border: "none",
        boxShadow: pressed
          ? `inset 1px 1px 0 ${DG}, inset -1px -1px 0 ${WH}`
          : BEV,
        fontFamily: FONT,
        fontSize: 12,
        color: "#000",
        padding: "4px 20px",
        minWidth: 80,
        cursor: "default",
        userSelect: "none",
        transform: pressed ? "translate(1px, 1px)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"login" | "create">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setError("Authentication coming soon. Stay tuned.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#02060e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 16px 40px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: 360 }}
      >
        <div
          style={{
            background: GR,
            boxShadow: `2px 2px 0 ${DG}, -1px -1px 0 ${WH}, 0 0 0 1px ${DG}, 0 8px 40px rgba(0,0,0,0.7)`,
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
              padding: "3px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>🔑</span>
              <span style={{ fontFamily: FONT, fontSize: 12, color: "#fff", fontWeight: "bold" }}>
                Feed the Homies — Sign In
              </span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  width: 16, height: 14, background: GR, border: "none",
                  boxShadow: BEV, fontSize: 9, fontWeight: "bold",
                  cursor: "default", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          </div>

          <div style={{ display: "flex", borderBottom: `1px solid ${DG}`, padding: "4px 6px 0" }}>
            {(["login", "create"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{
                  fontFamily: FONT, fontSize: 12, color: "#000",
                  background: tab === t ? GR : "#b0b0b0",
                  border: `1px solid ${DG}`,
                  borderBottom: tab === t ? `1px solid ${GR}` : `1px solid ${DG}`,
                  marginBottom: tab === t ? -1 : 0,
                  padding: "2px 14px",
                  cursor: "default",
                  position: "relative",
                  zIndex: tab === t ? 1 : 0,
                  boxShadow: tab === t ? `inset 1px 1px 0 ${WH}` : "none",
                }}
              >
                {t === "login" ? "Log In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ padding: "18px 16px 14px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, background: "#000080", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: `inset 1px 1px 0 ${DG}`,
              }}>
                🍲
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: "#000", fontWeight: "bold", marginBottom: 3 }}>
                  {tab === "login" ? "Welcome back, homie." : "Join the table."}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: DG, lineHeight: 1.5 }}>
                  {tab === "login"
                    ? "Sign in to access your account and the community."
                    : "Create an account to join the Feed the Homies community."}
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${DG}`, borderBottom: `1px solid ${WH}`, marginBottom: 16 }} />

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Win95Field
                id="email"
                label="E-mail address:"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Win95Field
                id="password"
                label="Password:"
                type="password"
                value={password}
                onChange={setPassword}
              />

              {tab === "create" && (
                <Win95Field
                  id="confirm"
                  label="Confirm password:"
                  type="password"
                  value=""
                  onChange={() => {}}
                />
              )}

              {error && (
                <div style={{
                  background: "#fff",
                  border: `1px solid ${DG}`,
                  boxShadow: `inset 1px 1px 0 ${DG}`,
                  padding: "5px 8px",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: "#000", lineHeight: 1.5 }}>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <Win95Btn onClick={() => navigate("/")}>Cancel</Win95Btn>
                <Win95Btn type="submit">
                  {tab === "login" ? "Log In" : "Create"}
                </Win95Btn>
              </div>
            </form>

            <div style={{ borderTop: `1px solid ${DG}`, borderBottom: `1px solid ${WH}`, margin: "14px 0 10px" }} />

            <div style={{ fontFamily: FONT, fontSize: 10, color: DG, textAlign: "center", lineHeight: 1.6 }}>
              {tab === "login"
                ? <>Forgot password? <span style={{ color: "#000080", textDecoration: "underline", cursor: "default" }}>Click here</span></>
                : <>Already have an account? <span onClick={() => setTab("login")} style={{ color: "#000080", textDecoration: "underline", cursor: "default" }}>Log in</span></>
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
