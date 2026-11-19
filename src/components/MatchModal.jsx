import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function MatchModal({ profile, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="match-title"
      className="fixed inset-0 z-20 grid place-items-center bg-ink/95 px-6">
      <div className="hero-rise w-full max-w-sm text-center">
        <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-gold bg-panel">
          {profile.profile_photo && <img src={profile.profile_photo} alt="" className="h-full w-full object-cover" />}
        </div>
        <h2 id="match-title" ref={ref} tabIndex={-1} className="font-display text-5xl font-extrabold text-gold">
          Kuyashisa!
        </h2>
        <p className="mt-3 text-lg">You and {profile.display_name} liked each other.</p>
        <div className="mt-8 grid gap-3">
          <Link to={`/chat/${profile.matchId}`}><Button>Say hello</Button></Link>
          <Button variant="ghost" onClick={onClose}>Keep swiping</Button>
        </div>
      </div>
    </div>
  );
}
