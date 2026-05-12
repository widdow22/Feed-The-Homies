import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const influencers = [
  { handle: "@dallasblackfoodie", name: "Dallas Black Foodie", focus: "Black-owned restaurants & food culture in DFW", note: "finds spots before anybody else does" },
  { handle: "@shopsmallDFW", name: "Shop Small DFW", focus: "Amplifying small and minority-owned shops across Dallas", note: "actually shops there too" },
  { handle: "@dallashoodlife", name: "Dallas Hood Life", focus: "Real stories from Dallas neighborhoods, unfiltered", note: "says what the news won't" },
  { handle: "@dfwblackbusiness", name: "DFW Black Business", focus: "Directory and spotlight for Black entrepreneurs", note: "the receipt. the resource. the real one." },
  { handle: "@southdallasnow", name: "South Dallas Now", focus: "Community journalism from South Dallas", note: "south dallas has always had a story" },
  { handle: "@feedthehomies", name: "Feed the Homies", focus: "Food. Culture. Awareness. Action.", note: "that's us. we're right here." },
];

const businesses = [
  { name: "Kutt's Barbershop", neighborhood: "South Dallas", gives: "Free cuts for students on report card day", tag: "Education" },
  { name: "Emporium Pies", neighborhood: "Deep Ellum", gives: "Weekly pie donations to shelters & food pantries", tag: "Food" },
  { name: "Mama E's Kitchen", neighborhood: "Oak Cliff", gives: "Sunday community plates — pay what you can", tag: "Feed" },
  { name: "The Bomb Factory", neighborhood: "Deep Ellum", gives: "Concert proceeds to local youth arts programs", tag: "Youth" },
  { name: "Wild Detectives", neighborhood: "Bishop Arts", gives: "Free literacy events & book giveaways monthly", tag: "Literacy" },
  { name: "Royal Blue Grocery", neighborhood: "Uptown", gives: "Unsold fresh food donated daily to local orgs", tag: "Food" },
];

const events = [
  { date: "every Saturday", title: "Dallas Food Pantry", desc: "Drive-through distribution, 8am–11am. show up, no questions asked.", location: "2375 Stemmons Fwy" },
  { date: "1st Saturday", title: "Oak Cliff Farmers Market", desc: "Local produce, small vendors, live music. feels like community is supposed to feel.", location: "Bishop Arts District" },
  { date: "3rd Friday", title: "South Dallas Cultural Center", desc: "Free art shows, workshops, storytelling. this is the culture.", location: "3400 S Fitzhugh Ave" },
  { date: "ongoing", title: "Dallas Public Library", desc: "GED prep, digital literacy, workforce programs. free. for real.", location: "All branches" },
  { date: "year-round", title: "CitySquare", desc: "Healthcare, housing, jobs. if you need it, start here.", location: "1610 S Malcolm X Blvd" },
];

const votingInfo = [
  { icon: "🗓️", title: "register", body: "30 days before election day. vote.org takes 5 minutes.", href: "https://www.vote.org/register-to-vote/", cta: "register →" },
  { icon: "📍", title: "find your polling place", body: "dallas county elections has your location, hours, and sample ballot.", href: "https://www.dallascountyvotes.org/", cta: "dallascountyvotes.org →" },
  { icon: "📋", title: "read the ballot first", body: "ballotpedia breaks down every race in plain english before you go in.", href: "https://ballotpedia.org/Dallas_County,_Texas", cta: "ballotpedia →" },
  { icon: "🤝", title: "work the polls", body: "dallas county pays poll workers. be the person who keeps it fair.", href: "https://www.dallascountyvotes.org/voters/elections/election-workers/", cta: "apply →" },
];

const resources = [
  { icon: "🏠", title: "housing", org: "Metro Dallas Homeless Alliance", href: "https://mdhadallas.org/", desc: "emergency housing, rental help, shelter access" },
  { icon: "🍎", title: "food pantries", org: "North Texas Food Bank", href: "https://ntfb.org/", desc: "find what's near you in DFW" },
  { icon: "💼", title: "jobs", org: "Workforce Solutions Greater Dallas", href: "https://www.workforcedallas.org/", desc: "placement, training, career support" },
  { icon: "🏥", title: "free clinic", org: "CitySquare Health", href: "https://citysquare.org/health/", desc: "low-cost and free medical in Dallas" },
  { icon: "📚", title: "mentorship", org: "Big Brothers Big Sisters Lone Star", href: "https://bbbslonestar.org/", desc: "for the youth. for the future." },
  { icon: "⚖️", title: "legal aid", org: "Legal Aid of NorthWest Texas", href: "https://lanwt.org/", desc: "free legal help if you qualify" },
];

export default function Dallas() {
  return (
    <div className="min-h-screen text-foreground" style={{ background: "#0c0709" }}>

      {/* Hero — journal entry style */}
      <section className="pt-40 pb-20 px-6 md:px-16 relative overflow-hidden" style={{ background: "#0c0709" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 30% 40%, rgba(196,132,122,0.06) 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="font-hand text-lg mb-2"
              style={{ color: "rgba(196,132,122,0.6)", transform: "rotate(-0.5deg)" }}
            >
              a note from us to you —
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-serif font-bold text-foreground leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
            >
              The Dallas<br />
              <span style={{ color: "#C4847A" }}>Informant</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-sans text-base md:text-lg text-foreground/55 leading-relaxed max-w-lg lowercase"
            >
              we made this because dallas is full of people doing real things that never get enough attention. spots that give back. voices worth your follow. events worth showing up to.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="font-hand text-xl mt-6"
              style={{ color: "rgba(196,132,122,0.7)", transform: "rotate(0.3deg)" }}
            >
              "by us, for us."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Divider rule */}
      <div style={{ borderTop: "1px solid rgba(196,132,122,0.12)" }} />

      {/* 1. Follow these people */}
      <section id="influencers" className="py-20 px-6 md:px-16" style={{ background: "#0c0709" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="font-hand text-3xl md:text-4xl mb-2" style={{ color: "#F2E8D5", transform: "rotate(-0.5deg)" }}>
              people worth your follow
            </p>
            <p className="font-sans text-xs text-foreground/35 lowercase italic">
              these aren't ads. these are accounts we actually look at.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {influencers.map((inf, i) => (
              <motion.div
                key={inf.handle}
                variants={fadeUp}
                className="flex flex-col gap-3 p-5"
                style={{
                  background: i % 3 === 0 ? "#1a0d11" : i % 3 === 1 ? "#0d1a14" : "#10101a",
                  border: "1px solid rgba(242,232,213,0.06)",
                  transform: `rotate(${i % 2 === 0 ? "0.3" : "-0.3"}deg)`,
                }}
              >
                <div>
                  <div className="font-mono text-xs" style={{ color: "rgba(0,255,238,0.5)" }}>{inf.handle}</div>
                  <div className="font-serif text-base font-medium text-foreground mt-0.5">{inf.name}</div>
                </div>
                <p className="font-sans text-xs text-foreground/50 leading-relaxed lowercase">{inf.focus}</p>
                <p className="font-hand text-sm" style={{ color: "rgba(196,132,122,0.6)" }}>
                  — {inf.note}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(61,26,36,0.6)" }} />

      {/* 2. Spots that give back */}
      <section id="gives-back" className="py-20 px-6 md:px-16" style={{ background: "#0e0a0b" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="font-hand text-3xl md:text-4xl mb-2" style={{ color: "#F2E8D5" }}>
              spend here.
            </p>
            <p className="font-sans text-xs text-foreground/35 lowercase italic">
              places doing real work in the community. your money means something here.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="flex flex-col"
            style={{ borderTop: "1px solid rgba(242,232,213,0.07)" }}
          >
            {businesses.map((biz, i) => (
              <motion.div
                key={biz.name}
                variants={fadeUp}
                className="flex items-start gap-6 py-6"
                style={{ borderBottom: "1px solid rgba(242,232,213,0.06)" }}
              >
                <span
                  className="font-hand text-4xl md:text-5xl flex-shrink-0 leading-none mt-1"
                  style={{ color: "rgba(196,132,122,0.3)", width: 40, textAlign: "right" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-serif text-lg font-medium text-foreground">{biz.name}</span>
                    <span className="font-mono text-[9px] text-foreground/30 uppercase tracking-widest">{biz.neighborhood}</span>
                    <span
                      className="font-sans text-[9px] uppercase tracking-widest px-1.5 py-0.5"
                      style={{ background: "rgba(196,132,122,0.12)", color: "#C4847A" }}
                    >
                      {biz.tag}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-foreground/50 leading-relaxed lowercase">{biz.gives}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(61,26,36,0.6)" }} />

      {/* 3. What's happening */}
      <section id="events" className="py-20 px-6 md:px-16" style={{ background: "#0c0709" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="font-hand text-3xl md:text-4xl mb-2" style={{ color: "#F2E8D5", transform: "rotate(0.4deg)" }}>
              where to be.
            </p>
            <p className="font-sans text-xs text-foreground/35 lowercase italic">
              recurring events worth building a routine around.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="flex flex-col gap-4"
          >
            {events.map((ev, i) => (
              <motion.div
                key={ev.title}
                variants={fadeUp}
                className="flex gap-6 p-5"
                style={{
                  background: "#150e10",
                  borderLeft: `3px solid ${i % 2 === 0 ? "rgba(196,132,122,0.4)" : "rgba(0,255,238,0.2)"}`,
                }}
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-serif text-base font-medium text-foreground">{ev.title}</span>
                    <span className="font-hand text-sm" style={{ color: "rgba(196,132,122,0.6)" }}>{ev.date}</span>
                  </div>
                  <p className="font-sans text-xs text-foreground/50 leading-relaxed lowercase">{ev.desc}</p>
                  <span className="font-mono text-[9px] text-foreground/25 mt-1">📍 {ev.location}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(61,26,36,0.6)" }} />

      {/* 4. Your vote */}
      <section id="vote" className="py-20 px-6 md:px-16" style={{ background: "#0e0a0b" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="font-hand text-3xl md:text-4xl mb-2" style={{ color: "#F2E8D5" }}>
              your vote. your block.
            </p>
            <p className="font-sans text-xs text-foreground/35 lowercase italic">
              they count on us not showing up. let's not make it easy.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {votingInfo.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="flex flex-col gap-3 p-5"
                style={{ background: "#150e10", border: "1px solid rgba(242,232,213,0.06)" }}
              >
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: 20 }}>{v.icon}</span>
                  <div>
                    <div className="font-hand text-xl text-foreground mb-1">{v.title}</div>
                    <p className="font-sans text-xs text-foreground/50 leading-relaxed lowercase">{v.body}</p>
                  </div>
                </div>
                <a
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] lowercase"
                  style={{ color: "rgba(0,255,238,0.5)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00ffee")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,255,238,0.5)")}
                >
                  {v.cta}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ borderTop: "1px solid rgba(61,26,36,0.6)" }} />

      {/* 5. Resources */}
      <section id="resources" className="py-20 px-6 md:px-16" style={{ background: "#0c0709" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <p className="font-hand text-3xl md:text-4xl mb-2" style={{ color: "#F2E8D5", transform: "rotate(-0.3deg)" }}>
              if you need it.
            </p>
            <p className="font-sans text-xs text-foreground/35 lowercase italic">
              real resources. no judgment. for our people.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {resources.map((r) => (
              <motion.a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                className="flex flex-col gap-3 p-5 no-underline"
                style={{
                  background: "#150e10",
                  border: "1px solid rgba(242,232,213,0.05)",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,132,122,0.3)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(242,232,213,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                  <div>
                    <div className="font-hand text-lg text-foreground">{r.title}</div>
                    <div className="font-mono text-[9px]" style={{ color: "rgba(0,255,238,0.4)" }}>{r.org}</div>
                  </div>
                </div>
                <p className="font-sans text-xs text-foreground/40 leading-relaxed lowercase">{r.desc}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer note */}
      <footer
        className="py-12 px-6 md:px-16"
        style={{ background: "#0c0709", borderTop: "1px solid rgba(61,26,36,0.6)" }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="font-hand text-2xl mb-1" style={{ color: "rgba(196,132,122,0.6)" }}>
            keep building.
          </p>
          <p className="font-sans text-xs text-foreground/25 lowercase">
            the dallas informant · by feed the homies · community, not content
          </p>
        </div>
      </footer>
    </div>
  );
}
