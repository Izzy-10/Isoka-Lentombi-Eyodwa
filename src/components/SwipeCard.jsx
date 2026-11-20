import { useRef, useState } from "react";
import VerifiedBadge from "./VerifiedBadge.jsx";

const THRESHOLD = 110;

export default function SwipeCard({ profile, onSwipe, disabled }) {
  const [photo, setPhoto] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const photos = profile.photo_urls?.length ? profile.photo_urls : profile.profile_photo ? [profile.profile_photo] : [];

  const down = (e) => {
    if (disabled) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => dragging && setDx(e.clientX - startX.current);
  const up = (e) => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) {
      const action = dx > 0 ? "like" : "dislike";
      setDx(0);
      onSwipe(action);
    } else if (Math.abs(dx) < 6) {
      // A tap: left third = previous photo, right two thirds = next photo
      const rect = e.currentTarget.getBoundingClientRect();
      const left = e.clientX - rect.left < rect.width / 3;
      setPhoto((p) => Math.min(photos.length - 1, Math.max(0, p + (left ? -1 : 1))));
      setDx(0);
    } else {
      setDx(0);
    }
  };

  return (
    <article
      aria-label={`${profile.display_name}, ${profile.age}`}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      className="relative aspect-[3/4] w-full select-none overflow-hidden rounded-3xl glow bg-panel"
      style={{
        touchAction: "pan-y",
        transform: `translateX(${dx}px) rotate(${dx / 25}deg)`,
        transition: dragging ? "none" : "transform .25s ease",
      }}
    >
      {photos[photo] ? (
        <img src={photos[photo]} alt="" draggable={false} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full place-items-center font-display text-8xl text-gold">
          {profile.display_name[0]}
        </div>
      )}

      {photos.length > 1 && (
        <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden="true">
          {photos.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i === photo ? "bg-gold" : "bg-cream/40"}`} />
          ))}
        </div>
      )}

      <span
        className="absolute left-4 top-10 rounded-lg border-2 border-gold px-3 py-1 font-display text-2xl font-extrabold text-gold"
        style={{ opacity: Math.min(1, Math.max(0, dx / THRESHOLD)) }}
      >
        Like
      </span>
      <span
        className="absolute right-4 top-10 rounded-lg border-2 border-cream px-3 py-1 font-display text-2xl font-extrabold text-cream"
        style={{ opacity: Math.min(1, Math.max(0, -dx / THRESHOLD)) }}
      >
        Pass
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-5 pt-16">
        <h2 className="font-display text-3xl font-extrabold">
          {profile.display_name}, {profile.age} {profile.verified && <VerifiedBadge size={22} />}
        </h2>
        <p className="text-sm text-gold-soft">{profile.city}, {profile.province}</p>
        {profile.bio && <p className="mt-2 line-clamp-2 text-sm text-cream">{profile.bio}</p>}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {profile.interests.slice(0, 5).map((t) => (
            <li key={t} className="rounded-full border border-gold/50 px-2.5 py-0.5 text-xs text-gold-soft">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
