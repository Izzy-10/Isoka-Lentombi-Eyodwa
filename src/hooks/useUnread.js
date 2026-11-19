import { useEffect, useState } from "react";
import { getNotifications } from "../services/api.js";

export const NOTIFICATIONS_READ = "isoka:notifications-read";

export default function useUnread() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let alive = true;
    const tick = () => getNotifications().then((d) => alive && setCount(d.unread_count)).catch(() => {});
    const clear = () => setCount(0);
    tick();
    const id = setInterval(tick, 30000);
    window.addEventListener(NOTIFICATIONS_READ, clear);
    return () => { alive = false; clearInterval(id); window.removeEventListener(NOTIFICATIONS_READ, clear); };
  }, []);

  return count;
}
