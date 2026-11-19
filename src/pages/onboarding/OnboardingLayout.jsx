import { Outlet, useLocation } from "react-router-dom";

const STEPS = [
  ["profile", "About you"],
  ["photos", "Photos"],
  ["interests", "Interests"],
  ["location", "Location"],
];

export default function OnboardingLayout() {
  const { pathname } = useLocation();
  const current = Math.max(0, STEPS.findIndex(([slug]) => pathname.endsWith(slug)));

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-8">
      <p className="text-sm text-muted" aria-live="polite">
        Step {current + 1} of {STEPS.length}: {STEPS[current][1]}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2" aria-hidden="true">
        {STEPS.map(([slug], i) => (
          <span key={slug} className={`h-1 rounded-full ${i <= current ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
      <div className="mt-8"><Outlet /></div>
    </main>
  );
}
