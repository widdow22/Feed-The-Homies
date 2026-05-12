import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlayerProvider } from "@/context/PlayerContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dallas from "@/pages/dallas";
import Login from "@/pages/login";
import Splash from "@/components/Splash";
import NavBar from "@/components/NavBar";
import MusicWidget from "@/components/MusicWidget";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dallas" component={Dallas} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [entered, setEntered] = useState(() => {
    try { return sessionStorage.getItem("fth_entered") === "1"; } catch { return false; }
  });

  const handleEnter = () => {
    try { sessionStorage.setItem("fth_entered", "1"); } catch { /* ignore */ }
    setEntered(true);
  };

  return (
    <PlayerProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Splash — covers z:9999, MusicWidget lives behind it always mounted */}
          <AnimatePresence>
            {!entered && <Splash onEnter={handleEnter} />}
          </AnimatePresence>

          {/* Global persistent shell — always mounted, never unmounts */}
          {entered && <NavBar />}

          {/*
            MusicWidget is ALWAYS mounted regardless of entered/route.
            The splash screen (z-index 9999) sits on top during first visit.
            State lives in PlayerContext so it can never be lost.
          */}
          <MusicWidget />

          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </PlayerProvider>
  );
}

export default App;
