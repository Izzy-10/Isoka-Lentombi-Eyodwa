import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SafetyMenu from "../components/SafetyMenu.jsx";
import ErrorText from "../components/ErrorText.jsx";
import VerifiedBadge from "../components/VerifiedBadge.jsx";
import { getMatches, getMessages } from "../services/api.js";
import { openChat } from "../services/chat.js";

const time = (iso) => new Date(iso).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState("");
  const [safety, setSafety] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const chat = useRef(null);
  const bottom = useRef(null);
  const otherId = useRef(null);

  // Load the person and the history, then open the socket
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [m, h] = await Promise.all([getMatches(), getMessages(matchId)]);
        const match = m.results.find((x) => x.match_id === matchId);
        if (!match) return navigate("/matches", { replace: true });
        if (!alive) return;
        otherId.current = match.profile.id;
        setProfile(match.profile);
        setMessages(h.results);
        setHasMore(h.results.length >= 50);

        chat.current = openChat(matchId, {
          onStatus: setStatus,
          onError: setError,
          onReady: () => chat.current?.markRead(),
          onMessage: (d) => {
            setMessages((list) => (list.some((x) => x.id === d.id) ? list : [...list, d]));
            if (d.sender_id === otherId.current) chat.current?.markRead();
          },
          onRead: (d) => {
            if (d.reader_id === otherId.current) {
              setMessages((list) => list.map((x) => (x.sender_id !== otherId.current ? { ...x, is_read: true } : x)));
            }
          },
        });
      } catch (e) {
        setError(e.message);
        if (e.status === 404) navigate("/matches", { replace: true });
      }
    })();
    return () => { alive = false; chat.current?.close(); };
  }, [matchId, navigate]);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages.length]);

  const send = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    if (chat.current?.send(body)) { setText(""); setError(""); }
    else setError("You're offline. Wait for the connection to return, then try again.");
  };

  const loadEarlier = useCallback(async () => {
    const d = await getMessages(matchId, messages[0]?.sent_at);
    setMessages((list) => [...d.results, ...list]);
    setHasMore(d.results.length >= 50);
  }, [matchId, messages]);

  const lastMine = [...messages].reverse().find((m) => m.sender_id !== otherId.current);

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Link to="/matches" aria-label="Back to matches" className="px-1 text-xl text-gold">‹</Link>
        <div className="oval h-12 w-9 shrink-0">
          {profile?.profile_photo && <img src={profile.profile_photo} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{profile?.display_name || "Chat"} {profile?.verified && <VerifiedBadge size={16} />}</p>
          <p className="text-xs text-muted" aria-live="polite">
            {status === "online" ? "Connected" : status === "offline" ? "Reconnecting…" : status === "closed" ? "Chat ended" : "Connecting…"}
          </p>
        </div>
        {profile && <button onClick={() => setSafety(true)} className="px-2 text-sm text-muted underline underline-offset-4">Report or block</button>}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {hasMore && (
          <button onClick={loadEarlier} className="mx-auto mb-4 block text-sm text-gold underline underline-offset-4">
            Load earlier messages
          </button>
        )}
        {messages.length === 0 && profile && (
          <p className="py-16 text-center text-muted">You matched with {profile.display_name}. Say sawubona.</p>
        )}
        <ul className="grid gap-2">
          {messages.map((m) => {
            const mine = m.sender_id !== otherId.current;
            return (
              <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${mine ? "bg-gold text-ink" : "bg-panel text-cream"}`}>
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p className={`mt-0.5 text-right text-[11px] ${mine ? "text-ink/70" : "text-muted"}`}>
                    {time(m.sent_at)}{mine && m === lastMine && m.is_read ? " · Read" : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={bottom} />
      </div>

      <form onSubmit={send} className="border-t border-line px-4 pt-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <ErrorText>{error}</ErrorText>
        <div className="flex gap-2">
          <input aria-label="Message" value={text} maxLength={1000} autoComplete="off"
            onChange={(e) => setText(e.target.value)} placeholder="Write a message"
            className="min-w-0 flex-1 rounded-xl border border-line bg-panel px-4 py-3 text-cream placeholder:text-muted" />
          <button disabled={!text.trim() || status !== "online"}
            className="rounded-xl bg-gold px-5 font-bold text-ink disabled:opacity-40">Send</button>
        </div>
      </form>

      {safety && profile && (
        <SafetyMenu profile={profile} onClose={() => setSafety(false)}
          onBlocked={() => navigate("/matches", { replace: true })} />
      )}
    </main>
  );
}
