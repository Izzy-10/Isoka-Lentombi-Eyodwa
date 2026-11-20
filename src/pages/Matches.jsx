import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import ErrorText from "../components/ErrorText.jsx";
import VerifiedBadge from "../components/VerifiedBadge.jsx";
import { getMatches, unmatch } from "../services/api.js";

export default function Matches() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMatches().then((d) => setItems(d.results)).catch((e) => { setError(e.message); setItems([]); });
  }, []);

  const remove = async (m) => {
    if (!window.confirm(`Unmatch with ${m.profile.display_name}? You can't undo this.`)) return;
    try {
      await unmatch(m.match_id);
      setItems((list) => list.filter((x) => x.match_id !== m.match_id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <h1 className="font-display text-3xl font-extrabold gold-text">Your matches</h1>
      <div className="mt-2"><ErrorText>{error}</ErrorText></div>

      {items === null && <p className="py-20 text-center text-muted">Loading…</p>}
      {items?.length === 0 && !error && (
        <p className="py-20 text-center text-muted">No matches yet. Keep swiping and they'll show up here.</p>
      )}

      <ul className="mt-6 grid gap-3">
        {items?.map((m) => (
          <li key={m.match_id} className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-3">
            <Link to={`/chat/${m.match_id}`} className="flex min-w-0 flex-1 items-center gap-4">
              <div className="oval h-[5.25rem] w-[3.9rem] shrink-0">
                {m.profile.profile_photo && <img src={m.profile.profile_photo} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{m.profile.display_name}, {m.profile.age} {m.profile.verified && <VerifiedBadge size={16} />}</p>
                <p className={`truncate text-sm ${m.unread_count ? "text-cream" : "text-muted"}`}>
                  {m.last_message || "Say hello"}
                </p>
              </div>
              {m.unread_count > 0 && (
                <span className="rounded-full bg-gold px-2 text-sm font-bold text-ink" aria-label={`${m.unread_count} unread`}>
                  {m.unread_count}
                </span>
              )}
            </Link>
            <button onClick={() => remove(m)} className="text-sm text-muted underline underline-offset-4 hover:text-cream">
              Unmatch
            </button>
          </li>
        ))}
      </ul>
      <BottomNav />
    </main>
  );
}
