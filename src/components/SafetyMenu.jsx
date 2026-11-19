import { useState } from "react";
import Button from "./Button.jsx";
import ErrorText from "./ErrorText.jsx";
import { blockUser, reportUser } from "../services/api.js";

const REASONS = [
  ["fake_profile", "Fake profile"],
  ["harassment", "Harassment or abuse"],
  ["inappropriate_content", "Inappropriate content"],
  ["scam", "Scam or asking for money"],
  ["underage", "Seems under 18"],
  ["other", "Something else"],
];

export default function SafetyMenu({ profile, onClose, onBlocked }) {
  const [step, setStep] = useState("menu"); // menu | report | reported | block
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn, next) => {
    setError(""); setBusy(true);
    try { await fn(); next(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const block = () => run(() => blockUser(profile.id), onBlocked);
  const report = () => {
    if (!reason) return setError("Choose a reason for your report.");
    run(() => reportUser(profile.id, reason, details), () => setStep("reported"));
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Safety options"
      className="fixed inset-0 z-20 flex items-end bg-ink/80" onClick={onClose}>
      <div className="mx-auto w-full max-w-md rounded-t-3xl border border-line bg-panel p-6"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
        onClick={(e) => e.stopPropagation()}>

        {step === "menu" && (
          <div className="grid gap-3">
            <h2 className="font-display text-xl font-bold">{profile.display_name}</h2>
            <Button variant="ghost" onClick={() => setStep("report")}>Report</Button>
            <Button variant="ghost" onClick={() => setStep("block")}>Block</Button>
            <Button variant="link" onClick={onClose}>Cancel</Button>
          </div>
        )}

        {step === "report" && (
          <div className="grid gap-4">
            <h2 className="font-display text-xl font-bold">Report {profile.display_name}</h2>
            <fieldset className="grid gap-2">
              <legend className="sr-only">Reason</legend>
              {REASONS.map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                  <input type="radio" name="reason" value={value} checked={reason === value}
                    onChange={() => setReason(value)} className="accent-[#d4af37]" />
                  {label}
                </label>
              ))}
            </fieldset>
            <textarea aria-label="More details (optional)" placeholder="Tell us what happened (optional)"
              rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)}
              className="rounded-xl border border-line bg-ink px-4 py-3 text-cream placeholder:text-muted" />
            <ErrorText>{error}</ErrorText>
            <Button disabled={busy} onClick={report}>{busy ? "Sending…" : "Send report"}</Button>
            <Button variant="link" onClick={() => setStep("menu")}>Back</Button>
          </div>
        )}

        {step === "reported" && (
          <div className="grid gap-3">
            <h2 className="font-display text-xl font-bold">Report sent</h2>
            <p className="text-muted">Thanks for telling us. Our team will review it. Want to block {profile.display_name} too?</p>
            <ErrorText>{error}</ErrorText>
            <Button disabled={busy} onClick={block}>Block {profile.display_name}</Button>
            <Button variant="ghost" onClick={onClose}>Not now</Button>
          </div>
        )}

        {step === "block" && (
          <div className="grid gap-3">
            <h2 className="font-display text-xl font-bold">Block {profile.display_name}?</h2>
            <p className="text-muted">You won't see each other again and this chat will end.</p>
            <ErrorText>{error}</ErrorText>
            <Button disabled={busy} onClick={block}>{busy ? "Blocking…" : "Block"}</Button>
            <Button variant="link" onClick={() => setStep("menu")}>Back</Button>
          </div>
        )}
      </div>
    </div>
  );
}
