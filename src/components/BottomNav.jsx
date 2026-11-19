import { NavLink } from "react-router-dom";
import useUnread from "../hooks/useUnread.js";

const link = ({ isActive }) =>
  `relative flex-1 py-4 text-center text-sm font-bold ${isActive ? "text-gold" : "text-muted"}`;

export default function BottomNav() {
  const unread = useUnread();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 border-t border-line bg-ink"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-md">
        <NavLink to="/discover" className={link}>Discover</NavLink>
        <NavLink to="/matches" className={link}>Matches</NavLink>
        <NavLink to="/notifications" className={link}>
          Alerts
          {unread > 0 && (
            <span className="ml-1.5 inline-block min-w-5 rounded-full bg-gold px-1.5 text-xs text-ink" aria-label={`${unread} unread`}>
              {unread}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
