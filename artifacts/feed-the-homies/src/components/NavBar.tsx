import { useLocation } from "wouter";

const GR = "#c0c0c0";       // classic Win95 grey
const DG = "#808080";       // dark grey shadow
const WH = "#ffffff";       // white highlight
const BEV = `inset -1px -1px 0 ${DG}, inset 1px 1px 0 ${WH}`;  // raised bevel
const FONT = "'MS Sans Serif', Arial, sans-serif";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Separator() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", height: 22, margin: "0 2px" }}>
      <div style={{ width: 1, background: DG, alignSelf: "stretch" }} />
      <div style={{ width: 1, background: WH, alignSelf: "stretch" }} />
    </div>
  );
}

function ToolBtn({
  children, onClick, disabled = false, wide = false, title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  wide?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{
        background: GR,
        border: "none",
        boxShadow: BEV,
        fontFamily: FONT,
        fontSize: 11,
        color: disabled ? DG : "#000",
        padding: wide ? "1px 10px" : "1px 5px",
        minWidth: wide ? undefined : 26,
        height: 22,
        cursor: disabled ? "default" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        userSelect: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        textShadow: disabled ? "none" : undefined,
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.boxShadow =
          `inset 1px 1px 0 ${DG}, inset -1px -1px 0 ${WH}`;
      }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = BEV; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = BEV; }}
    >
      {children}
    </button>
  );
}

export default function NavBar() {
  const [location, navigate] = useLocation();
  const isDallas = location === "/dallas";
  const path = isDallas ? "C:\\FeedTheHomies\\DallasInformant" : "C:\\FeedTheHomies\\";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: GR,
        fontFamily: FONT,
        userSelect: "none",
        boxShadow: `0 2px 0 ${DG}, 0 3px 0 ${WH}`,
      }}
    >
      {/* ── Menu bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1px 4px",
          height: 20,
          gap: 0,
          borderBottom: `1px solid ${DG}`,
        }}
      >
        {["File", "Edit", "View", "Favorites", "Help"].map((item) => (
          <button
            key={item}
            style={{
              background: "transparent",
              border: "none",
              fontFamily: FONT,
              fontSize: 12,
              color: "#000",
              padding: "0 6px",
              height: 18,
              cursor: "default",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#000080";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2px 4px",
          gap: 2,
          height: 30,
          borderBottom: `1px solid ${DG}`,
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <ToolBtn onClick={() => window.history.back()} title="Back" wide>◄ Back</ToolBtn>
        <ToolBtn disabled title="Forward">►</ToolBtn>
        <ToolBtn onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })} title="Scroll Down">↓</ToolBtn>
        <Separator />
        <ToolBtn onClick={() => navigate("/")} title="Home" wide>🏠 Home</ToolBtn>
        <Separator />

        {isDallas ? (
          <>
            <ToolBtn onClick={() => scrollTo("influencers")} wide>🗂 People</ToolBtn>
            <ToolBtn onClick={() => scrollTo("gives-back")} wide>🏪 Spots</ToolBtn>
            <ToolBtn onClick={() => scrollTo("events")} wide>📅 Events</ToolBtn>
            <ToolBtn onClick={() => scrollTo("vote")} wide>🗳 Vote</ToolBtn>
            <ToolBtn onClick={() => scrollTo("resources")} wide>📚 Help</ToolBtn>
          </>
        ) : (
          <>
            <ToolBtn onClick={() => scrollTo("about")} wide>📂 Story</ToolBtn>
            <ToolBtn onClick={() => scrollTo("mission")} wide>💵 Money</ToolBtn>
            <ToolBtn onClick={() => scrollTo("art")} wide>🎨 Art</ToolBtn>
            <ToolBtn onClick={() => scrollTo("join")} wide>✉ Join</ToolBtn>
            <Separator />
            <ToolBtn onClick={() => navigate("/dallas")} wide>📰 Dallas</ToolBtn>
            <Separator />
            <ToolBtn onClick={() => navigate("/login")} wide>🔑 Log In</ToolBtn>
          </>
        )}
      </div>

      {/* ── Address bar ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2px 6px",
          gap: 6,
          height: 24,
        }}
      >
        <span style={{ fontSize: 12, color: "#000", whiteSpace: "nowrap", flexShrink: 0 }}>
          Address
        </span>
        <div
          style={{
            flex: 1,
            height: 18,
            background: "#fff",
            boxShadow: `inset 1px 1px 0 ${DG}, inset -1px -1px 0 ${WH}`,
            display: "flex",
            alignItems: "center",
            padding: "0 4px",
            overflow: "hidden",
          }}
        >
          <span style={{ fontSize: 11, fontFamily: FONT, color: "#000", whiteSpace: "nowrap" }}>
            📄 {path}
          </span>
        </div>
        <button
          style={{
            background: GR,
            border: "none",
            boxShadow: BEV,
            fontFamily: FONT,
            fontSize: 11,
            color: "#000",
            padding: "1px 10px",
            height: 18,
            cursor: "default",
            flexShrink: 0,
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `inset 1px 1px 0 ${DG}, inset -1px -1px 0 ${WH}`; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = BEV; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = BEV; }}
        >
          Go
        </button>
      </div>
    </div>
  );
}
