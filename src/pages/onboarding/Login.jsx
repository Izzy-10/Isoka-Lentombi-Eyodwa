import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import ErrorText from "../components/ErrorText.jsx";
import {
  sendOtp, confirmOtp, googleSignIn, emailSignIn, emailSignUp, friendlyError,
} from "../services/auth.js";

const TABS = [["phone", "Phone"], ["email", "Email"]];

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(params.get("mode") === "signup");
  const [tab, setTab] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setError(""); setBusy(true);
    try { await fn(); navigate("/", { replace: true }); }
    catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  };

  const onPhone = async (e) => {
    e.preventDefault();
    if (!confirmation) {
      setError(""); setBusy(true);
      try { setConfirmation(await sendOtp(phone)); }
      catch (err) { setError(friendlyError(err)); }
      finally { setBusy(false); }
    } else {
      run(() => confirmOtp(confirmation, code));
    }
  };

  const onEmail = (e) => {
    e.preventDefault();
    run(() => (signup ? emailSignUp(email, password) : emailSignIn(email, password)));
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-10">
      <Link to="/" className="font-display text-lg font-bold text-gold">Isoka Lentombi Eyodwa</Link>
      <h1 className="mt-10 font-display text-4xl font-extrabold">
        {signup ? "Create your account" : "Welcome back"}
      </h1>

      <div role="tablist" className="mt-8 grid grid-cols-2 rounded-xl border border-line p-1">
        {TABS.map(([id, label]) => (
          <button
            key={id} role="tab" aria-selected={tab === id}
            onClick={() => { setTab(id); setError(""); }}
            className={`rounded-lg py-2 text-sm font-bold ${tab === id ? "bg-gold text-ink" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "phone" ? (
        <form onSubmit={onPhone} className="mt-6 grid gap-4">
          <Field
            label="Cellphone number" type="tel" inputMode="tel" autoComplete="tel"
            placeholder="071 234 5678" value={phone} disabled={!!confirmation}
            onChange={(e) => setPhone(e.target.value)}
          />
          {confirmation && (
            <Field
              label="6-digit code" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
              hint={`We sent a code to ${phone}.`} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          )}
          <ErrorText>{error}</ErrorText>
          <Button disabled={busy || (confirmation ? code.length < 6 : phone.length < 9)}>
            {busy ? "Please wait…" : confirmation ? "Verify code" : "Send code"}
          </Button>
          {confirmation && (
            <Button type="button" variant="link" onClick={() => { setConfirmation(null); setCode(""); }}>
              Use a different number
            </Button>
          )}
        </form>
      ) : (
        <form onSubmit={onEmail} className="mt-6 grid gap-4">
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field
            label="Password" type="password" minLength={6} required
            autoComplete={signup ? "new-password" : "current-password"}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorText>{error}</ErrorText>
          <Button disabled={busy}>{busy ? "Please wait…" : signup ? "Create account" : "Log in"}</Button>
        </form>
      )}

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="ghost" disabled={busy} onClick={() => run(googleSignIn)}>Continue with Google</Button>

      {signup && (
        <p className="mt-6 text-center text-xs text-muted">
          You'll be asked to accept our <Link to="/terms" className="underline underline-offset-4">Terms</Link> and{" "}
          <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link> when you set up your profile.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        {signup ? "Already a member?" : "New here?"}{" "}
        <Button type="button" variant="link" onClick={() => setSignup(!signup)}>
          {signup ? "Log in" : "Create an account"}
        </Button>
      </p>
    </main>
  );
}
