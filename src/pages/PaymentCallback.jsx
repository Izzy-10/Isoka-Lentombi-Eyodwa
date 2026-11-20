import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import { verifyPayment } from "../services/api.js";

const date = (iso) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [result, setResult] = useState(null); // { status, tier, tier_expires_at } | { error }
  const tries = useRef(0);

  const check = async () => {
    try { setResult(await verifyPayment(reference)); }
    catch (e) { setResult({ error: e.message }); }
  };

  useEffect(() => { if (reference) check(); }, [reference]); // eslint-disable-line react-hooks/exhaustive-deps

  // The webhook can arrive a few seconds after the redirect, so look again a few times
  useEffect(() => {
    if (result?.status !== "pending" || tries.current >= 5) return;
    tries.current += 1;
    const id = setTimeout(check, 4000);
    return () => clearTimeout(id);
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  let title, body, action;
  if (!reference) {
    title = "Nothing to check"; body = "We couldn't find a payment to confirm.";
  } else if (!result) {
    title = "Confirming your payment…"; body = "This takes a few seconds.";
  } else if (result.error) {
    title = "We couldn't confirm your payment"; body = result.error;
    action = <Button onClick={check}>Try again</Button>;
  } else if (result.status === "success") {
    title = `You're on Isoka ${result.tier === "vip" ? "VIP" : "Premium"}`;
    body = `Your plan is active until ${date(result.tier_expires_at)}. Enjoy.`;
  } else if (result.status === "failed") {
    title = "Your payment didn't go through"; body = "Check with your bank if money left your account, or try again.";
    action = <Link to="/premium"><Button>Try again</Button></Link>;
  } else {
    title = "Waiting for your payment"; body = "If you've already paid, it can take a minute to arrive.";
    action = <Button onClick={() => { tries.current = 0; check(); }}>Check again</Button>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 px-6 py-10 text-center">
      <h1 className="font-display text-4xl font-extrabold text-gold gold-text" aria-live="polite">{title}</h1>
      <p className="text-muted">{body}</p>
      {action}
      <Link to="/discover"><Button variant="ghost">Back to Discover</Button></Link>
    </main>
  );
}
