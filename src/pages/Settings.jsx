import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import ErrorText from "../components/ErrorText.jsx";
import ThemeChips from "../components/ThemeChips.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { deleteAccount, exportMyData } from "../services/api.js";
import { logout } from "../services/auth.js";
import { deleteAllPhotos } from "../services/storage.js";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  const download = async () => {
    setError(""); setBusy("export");
    try {
      const data = await exportMyData();
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "my-isoka-data.json" });
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message); }
    finally { setBusy(""); }
  };

  const remove = async () => {
    setError(""); setBusy("delete");
    try {
      await deleteAllPhotos(user.uid).catch(() => {}); // photos may already be gone; don't block deletion
      await deleteAccount();
      localStorage.clear();
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.message);
      setBusy("");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <h1 className="font-display text-3xl font-extrabold gold-text">Settings</h1>
      <p className="mt-1 text-sm text-muted">{user?.phoneNumber || user?.email}</p>

      <section className="mt-6 grid gap-3">
        <h2 className="ribbon w-fit">Theme</h2>
        <ThemeChips />
      </section>

      <ul className="mt-8 grid gap-3">
        <li><Link to="/profile/edit" className="block rounded-2xl border border-line bg-panel p-4">Manage my profile</Link></li>
        <li><Link to="/verify" className="block rounded-2xl border border-gold bg-panel p-4 text-gold">Get verified</Link></li>
        <li><Link to="/premium" className="block rounded-2xl border border-line bg-panel p-4">Isoka Premium and VIP</Link></li>
        <li><Link to="/safety" className="block rounded-2xl border border-line bg-panel p-4">Safety tips</Link></li>
        <li><Link to="/privacy" className="block rounded-2xl border border-line bg-panel p-4">Privacy Policy</Link></li>
        <li><Link to="/terms" className="block rounded-2xl border border-line bg-panel p-4">Terms of Service</Link></li>
      </ul>

      <section className="mt-8 grid gap-3">
        <h2 className="ribbon w-fit">Your data</h2>
        <p className="text-sm text-muted">Download a copy of everything we hold about you: your profile, matches, messages and payments.</p>
        <Button variant="ghost" disabled={!!busy} onClick={download}>{busy === "export" ? "Preparing…" : "Download my data"}</Button>
      </section>

      <section className="mt-8 grid gap-3">
        <Button variant="ghost" onClick={logout}>Log out</Button>
      </section>

      <section className="mt-8 grid gap-3 rounded-2xl border border-danger/40 p-4">
        <h2 className="font-display text-xl font-bold">Delete my account</h2>
        <p className="text-sm text-muted">
          This permanently deletes your profile, photos, matches, messages and login. It can't be undone.
          If you have an active Premium or VIP plan, you lose it with no refund.
        </p>
        {!confirming ? (
          <Button variant="ghost" onClick={() => setConfirming(true)}>Delete my account</Button>
        ) : (
          <>
            <Field label="Type DELETE to confirm" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
            <Button disabled={typed !== "DELETE" || !!busy} onClick={remove}>
              {busy === "delete" ? "Deleting…" : "Permanently delete"}
            </Button>
            <Button variant="link" onClick={() => { setConfirming(false); setTyped(""); }}>Cancel</Button>
          </>
        )}
      </section>

      <div className="mt-4"><ErrorText>{error}</ErrorText></div>
      <BottomNav />
    </main>
  );
}
