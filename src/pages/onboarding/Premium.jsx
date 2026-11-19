import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import Button from "../components/Button.jsx";
import ErrorText from "../components/ErrorText.jsx";
import { getBilling, getPlans, startCheckout } from "../services/api.js";

const RANK = { free: 0, premium: 1, vip: 2 };
const rand = (cents) => `R${(cents / 100).toFixed(0)}`;
const date = (iso) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default function Premium() {
  const [plans, setPlans] = useState(null);
  const [billing, setBilling] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    Promise.all([getPlans(), getBilling()])
      .then(([p, b]) => { setPlans(p.results); setBilling(b); })
      .catch((e) => { setError(e.message); setPlans([]); });
  }, []);

  const buy = async (plan) => {
    setError(""); setBusy(plan);
    try {
      const { authorization_url } = await startCheckout(plan);
      window.location.assign(authorization_url);
    } catch (e) {
      setError(e.message);
      setBusy("");
    }
  };

  const tier = billing?.tier || "free";

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <Link to="/discover" className="text-sm text-gold underline underline-offset-4">Back to Discover</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">Go further with Isoka</h1>
      {tier !== "free" && billing?.tier_expires_at && (
        <p className="mt-2 text-gold-soft">
          You're on Isoka {tier === "vip" ? "VIP" : "Premium"} until {date(billing.tier_expires_at)}.
        </p>
      )}
      <p className="mt-2 text-sm text-muted">Each payment gives you 30 days. It doesn't renew by itself. Secure checkout by Paystack.</p>

      <div className="mt-4"><ErrorText>{error}</ErrorText></div>
      {plans === null && <p className="py-20 text-center text-muted">Loading…</p>}

      <ul className="mt-4 grid gap-4">
        {plans?.map((p) => {
          const owned = RANK[tier] > RANK[p.id];
          const same = tier === p.id;
          return (
            <li key={p.id} className={`rounded-3xl border p-6 ${p.id === "vip" ? "border-gold" : "border-line"} bg-panel`}>
              <h2 className="font-display text-2xl font-extrabold">{p.name}</h2>
              <p className="mt-1"><span className="font-display text-4xl font-extrabold text-gold">{rand(p.amount)}</span>
                <span className="text-muted"> for {p.days} days</span></p>
              <ul className="mt-4 grid gap-1.5 text-cream">
                {p.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <div className="mt-5">
                <Button disabled={owned || !!busy} onClick={() => buy(p.id)}>
                  {busy === p.id ? "Opening checkout…" : owned ? "Included in your plan" : same ? `Add 30 days of ${p.name}` : `Get ${p.name}`}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-xs text-muted">More perks are on the way.</p>
      <BottomNav />
    </main>
  );
}
