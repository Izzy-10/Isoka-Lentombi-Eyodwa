import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import SwipeCard from "../components/SwipeCard.jsx";
import Logo from "../components/Logo.jsx";
import ThemeButton from "../components/ThemeButton.jsx";
import MatchModal from "../components/MatchModal.jsx";
import ErrorText from "../components/ErrorText.jsx";
import { getDiscover, sendSwipe } from "../services/api.js";

const merge = (a, b) => [...a, ...b.filter((x) => !a.some((y) => y.id === x.id))];

export default function Discover() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [left, setLeft] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [limitHit, setLimitHit] = useState(false);
  const [match, setMatch] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const d = await getDiscover();
      setQueue((q) => merge(q, d.results));
      setLeft(d.swipes_left);
      setLimitHit(d.swipes_left === 0);
      setStatus("ready");
    } catch (e) {
      if (e.status === 409) {
        localStorage.removeItem("isoka_onboarded");
        navigate("/onboarding/profile", { replace: true });
      } else {
        setMsg(e.message);
        setStatus("error");
      }
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const current = queue[0];

  const act = async (action) => {
    if (busy || !current) return;
    setBusy(true); setMsg("");
    try {
      const r = await sendSwipe(current.id, action);
      setLeft(r.swipes_left);
      if (r.swipes_left === 0) setLimitHit(true);
      if (r.matched) setMatch({ ...current, matchId: r.match_id });
      setQueue((q) => q.slice(1));
      if (queue.length <= 3) load();
    } catch (e) {
      if (e.status === 429) setLimitHit(true);
      else setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <header className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Logo size={36} />
            <h1 className="font-brand text-lg font-bold tracking-[0.18em] gold-text">ISOKA</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <ThemeButton compact />
            <Link to="/settings" className="underline underline-offset-4">Settings</Link>
          </div>
        </div>
        {left !== null && (
          <p className="mt-3 flex items-center justify-center gap-3 text-sm text-muted">
            <span aria-live="polite">{left} swipes left today</span>
            <Link to="/premium" className="font-bold text-gold">Go Premium</Link>
          </p>
        )}
      </header>

      {status === "loading" && <p className="py-24 text-center text-muted">Finding people near you…</p>}

      {status === "error" && (
        <div className="grid gap-3 py-24 text-center">
          <ErrorText>{msg}</ErrorText>
          <button onClick={() => { setStatus("loading"); load(); }} className="text-gold underline underline-offset-4">
            Try again
          </button>
        </div>
      )}

      {status === "ready" && limitHit && (
        <div className="py-24 text-center">
          <h2 className="font-display text-3xl font-extrabold">That's your 10 for today</h2>
          <p className="mt-3 text-muted">Your swipes reset at midnight. Isoka Premium gives you unlimited swipes.</p>
          <Link to="/premium" className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-bold text-ink">See Isoka Premium</Link>
        </div>
      )}

      {status === "ready" && !limitHit && !current && (
        <div className="py-24 text-center">
          <h2 className="font-display text-3xl font-extrabold">You've seen everyone for now</h2>
          <p className="mt-3 text-muted">New people join every day. Check back soon.</p>
        </div>
      )}

      {status === "ready" && !limitHit && current && (
        <>
          <SwipeCard key={current.id} profile={current} onSwipe={act} disabled={busy} />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <button onClick={() => act("dislike")} disabled={busy}
              className="rounded-2xl border border-line py-4 font-bold text-cream hover:border-cream disabled:opacity-40">
              Pass
            </button>
            <button onClick={() => act("superlike")} disabled={busy}
              className="rounded-2xl border border-gold py-4 font-bold text-gold hover:bg-gold/10 disabled:opacity-40">
              Super like
            </button>
            <button onClick={() => act("like")} disabled={busy}
              className="rounded-2xl bg-gold py-4 font-bold text-ink hover:bg-gold-soft disabled:opacity-40">
              Like
            </button>
          </div>
          <div className="mt-3 text-center">
            <ErrorText>{msg}</ErrorText>
            {msg.includes("Premium") && <Link to="/premium" className="text-sm text-gold underline underline-offset-4">See Isoka Premium</Link>}
          </div>
        </>
      )}

      {match && <MatchModal profile={match} onClose={() => setMatch(null)} />}
      <BottomNav />
    </main>
  );
}
