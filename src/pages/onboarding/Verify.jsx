import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import Button from "../components/Button.jsx";
import ErrorText from "../components/ErrorText.jsx";
import VerifiedBadge from "../components/VerifiedBadge.jsx";
import { getVerification, startVerification, submitVerification } from "../services/api.js";
import { uploadSelfie } from "../services/storage.js";
import { shrinkImage } from "../utils/image.js";

export default function Verify() {
  const [state, setState] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  useEffect(() => {
    getVerification().then(setState).catch((e) => { setError(e.message); setState({ status: "none" }); });
  }, []);

  const run = async (fn) => {
    setError(""); setBusy(true);
    try { setState(await fn()); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const submit = () =>
    run(async () => {
      const blob = await shrinkImage(file);
      await uploadSelfie(state.upload_path, blob);
      return submitVerification();
    });

  const status = state?.status;

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <Link to="/settings" className="text-sm text-gold underline underline-offset-4">Back to Settings</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold">Get verified</h1>
      {state === null && <p className="py-16 text-center text-muted">Loading…</p>}

      {status === "approved" && (
        <div className="mt-8 grid gap-3 text-center">
          <div className="mx-auto"><VerifiedBadge size={72} /></div>
          <h2 className="font-display text-2xl font-extrabold text-gold">You're verified</h2>
          <p className="text-muted">Your gold badge shows on your profile and in your chats.</p>
        </div>
      )}

      {status === "pending" && (
        <div className="mt-8 grid gap-3">
          <h2 className="font-display text-2xl font-extrabold">We're checking your selfie</h2>
          <p className="text-muted">A member of our team is comparing it with your photos. We'll send you an alert when it's done, then delete the selfie.</p>
        </div>
      )}

      {(status === "none" || status === "rejected") && (
        <div className="mt-4 grid gap-4">
          {status === "rejected" && (
            <p role="alert" className="rounded-xl border border-danger/50 p-3 text-sm text-danger">
              We couldn't verify you last time: {state.reject_reason?.toLowerCase()}. You can try again.
            </p>
          )}
          <p className="text-cream">A gold badge tells people your photos are really you. It takes a minute.</p>
          <ol className="grid gap-2 text-muted">
            <li>1. We give you a pose to copy.</li>
            <li>2. You take a selfie doing it. No filters.</li>
            <li>3. Our team compares it with your profile photos.</li>
          </ol>
          <p className="text-sm text-muted">
            The selfie is private. Only our review team sees it, once, and we delete it as soon as we've decided.
            See our <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
          </p>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-[#d4af37]" />
            <span>I agree that Isoka's team may look at my selfie to check it against my photos.</span>
          </label>
          <ErrorText>{error}</ErrorText>
          <Button disabled={!consent || busy} onClick={() => run(startVerification)}>{busy ? "Starting…" : "Start"}</Button>
        </div>
      )}

      {status === "started" && (
        <div className="mt-4 grid gap-4">
          <div className="rounded-2xl border border-gold bg-panel p-5">
            <p className="text-sm text-muted">Take a selfie while</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-gold">{state.challenge}</p>
          </div>
          <p className="text-sm text-muted">Show your face and your hand clearly, in good light.</p>

          {preview && <img src={preview} alt="Your selfie" className="aspect-[3/4] w-full rounded-2xl object-cover" />}
          <label className="block cursor-pointer rounded-xl border border-dashed border-line py-4 text-center text-gold focus-within:outline-2">
            {file ? "Take it again" : "Open camera"}
            <input type="file" accept="image/*" capture="user" className="sr-only"
              onChange={(e) => { setFile(e.target.files[0] || null); setError(""); e.target.value = ""; }} />
          </label>
          <ErrorText>{error}</ErrorText>
          <Button disabled={!file || busy} onClick={submit}>{busy ? "Sending…" : "Send my selfie"}</Button>
        </div>
      )}
      <BottomNav />
    </main>
  );
}
