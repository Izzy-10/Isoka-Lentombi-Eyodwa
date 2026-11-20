import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import ErrorText from "../components/ErrorText.jsx";
import { getNotifications, markNotificationsRead } from "../services/api.js";
import { NOTIFICATIONS_READ } from "../hooks/useUnread.js";

export default function Notifications() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then(async (d) => {
        setItems(d.results);
        if (d.unread_count > 0) {
          await markNotificationsRead();
          window.dispatchEvent(new Event(NOTIFICATIONS_READ));
        }
      })
      .catch((e) => { setError(e.message); setItems([]); });
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <h1 className="font-display text-3xl font-extrabold gold-text">Alerts</h1>
      <div className="mt-2"><ErrorText>{error}</ErrorText></div>
      {items === null && <p className="py-20 text-center text-muted">Loading…</p>}
      {items?.length === 0 && !error && (
        <p className="py-20 text-center text-muted">Nothing new. Matches and messages will show up here.</p>
      )}
      <ul className="mt-6 grid gap-2">
        {items?.map((n) => (
          <li key={n.id}>
            <Link to={n.type === "verify" ? "/verify" : n.data?.match_id ? `/chat/${n.data.match_id}` : "/matches"}
              className={`block rounded-2xl border p-4 ${n.is_read ? "border-line text-muted" : "border-gold text-cream"}`}>
              <p className="truncate">{n.content}</p>
              <p className="mt-1 text-xs text-muted">{new Date(n.created_at).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</p>
            </Link>
          </li>
        ))}
      </ul>
      <BottomNav />
    </main>
  );
}
