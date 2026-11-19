import { auth } from "./firebase.js";

const WS_BASE =
  import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL || "").replace(/^http/, "ws");

/**
 * Opens a chat socket that logs in with the Firebase token as its first message
 * and reconnects with backoff if the connection drops.
 */
export function openChat(matchId, { onMessage, onRead, onReady, onError, onStatus }) {
  let ws;
  let closed = false;
  let attempt = 0;
  let timer;

  const connect = async () => {
    onStatus("connecting");
    const token = await auth.currentUser?.getIdToken();
    ws = new WebSocket(`${WS_BASE}/ws/chat/${matchId}/`);
    ws.onopen = () => ws.send(JSON.stringify({ type: "auth", token }));
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "ready") { attempt = 0; onStatus("online"); onReady?.(); }
      else if (d.type === "message") onMessage(d);
      else if (d.type === "read") onRead(d);
      else if (d.type === "error") onError(d.detail);
    };
    ws.onclose = (e) => {
      if (closed) return;
      if (e.code === 4401 || e.code === 4403) {
        onStatus("closed");
        onError("This chat is no longer available.");
        return;
      }
      onStatus("offline");
      timer = setTimeout(connect, Math.min(1000 * 2 ** attempt++, 15000));
    };
  };
  connect();

  const sendJson = (obj) => {
    if (ws?.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(obj));
    return true;
  };

  return {
    send: (content) => sendJson({ type: "message", content }),
    markRead: () => sendJson({ type: "read" }),
    close: () => { closed = true; clearTimeout(timer); ws?.close(); },
  };
}
