import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import ErrorText from "../components/ErrorText.jsx";
import VerifiedBadge from "../components/VerifiedBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getBilling, getMyProfile, updateProfile } from "../services/api.js";
import { deletePhotoByUrl, uploadPhoto } from "../services/storage.js";
import { GENDERS, INTERESTS, LOOKING_FOR, MAX_INTERESTS, MIN_INTERESTS, PROVINCES } from "../utils/constants.js";
import { normalizeTikTokUsername } from "../utils/helpers.js";

const MAX_MB = 8;
let nextId = 0;
const item = (o) => ({ id: ++nextId, ...o });

function normalizeProfile(profile) {
  const photo_urls = Array.isArray(profile?.photo_urls)
    ? profile.photo_urls
    : profile?.profile_photo ? [profile.profile_photo] : [];

  return {
    ...profile,
    display_name: profile?.display_name ?? "",
    dob: profile?.dob ?? "",
    gender: profile?.gender ?? "",
    looking_for: profile?.looking_for ?? "",
    bio: profile?.bio ?? "",
    interests: Array.isArray(profile?.interests) ? profile.interests : [],
    province: profile?.province ?? "",
    city: profile?.city ?? "",
    tiktok_username: profile?.tiktok_username ?? "",
    verified: Boolean(profile?.verified),
    photo_urls,
  };
}

export default function EditProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [photos, setPhotos] = useState([]); // { id, url } for saved ones, { id, file, preview } for new ones
  const [original, setOriginal] = useState([]);
  const [maxPhotos, setMaxPhotos] = useState(3);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([getMyProfile(), getBilling()])
      .then(([p, b]) => {
        const profile = normalizeProfile(p);
        setForm(profile);
        setVerified(profile.verified);
        setOriginal(profile.photo_urls);
        setPhotos(profile.photo_urls.map((url) => item({ url })));
        setMaxPhotos(b?.tier === "free" ? 3 : 10);
      })
      .catch((e) => setError(e.message));
  }, []);

  const set = (patch) => { setForm((f) => ({ ...f, ...patch })); setNotice(null); };

  const addFiles = (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    for (const f of files) {
      if (!f.type.startsWith("image/")) return setError("Only image files are allowed.");
      if (f.size > MAX_MB * 1024 * 1024) return setError(`Each photo must be under ${MAX_MB} MB.`);
    }
    setError(""); setNotice(null);
    setPhotos((list) => [...list, ...files.map((file) => item({ file, preview: URL.createObjectURL(file) }))].slice(0, maxPhotos));
  };

  const makeMain = (id) => setPhotos((list) => [list.find((p) => p.id === id), ...list.filter((p) => p.id !== id)]);
  const remove = (id) => setPhotos((list) => list.filter((p) => p.id !== id));

  const toggleInterest = (tag) => {
    const has = form.interests.includes(tag);
    if (!has && form.interests.length >= MAX_INTERESTS) return setError(`You can pick up to ${MAX_INTERESTS}.`);
    setError("");
    set({ interests: has ? form.interests.filter((t) => t !== tag) : [...form.interests, tag] });
  };

  const save = async (e) => {
    e.preventDefault();
    if (form.display_name.trim().length < 2) return setError("Enter the name you want people to see.");
    if (form.interests.length < MIN_INTERESTS) return setError(`Pick at least ${MIN_INTERESTS} interests.`);
    if (!form.province || !form.city) return setError("Choose your province and city.");
    if (photos.length < 1) return setError("Keep at least 1 photo that clearly shows your face.");
    const tiktok_username = normalizeTikTokUsername(form.tiktok_username);
    if (tiktok_username === null) return setError("Enter a valid TikTok username or profile link.");
    setError(""); setNotice(null); setBusy(true);
    try {
      const urls = await Promise.all(photos.map((p, i) => (p.file ? uploadPhoto(user.uid, p.file, i) : p.url)));
      const saved = normalizeProfile(await updateProfile({ ...form, tiktok_username, photo_urls: urls, profile_photo: urls[0] }));
      const lostBadge = verified && !saved.verified;
      setForm(saved);
      setVerified(saved.verified);
      setPhotos(saved.photo_urls.map((url) => item({ url })));
      original.filter((u) => !saved.photo_urls.includes(u)).forEach(deletePhotoByUrl);
      setOriginal(saved.photo_urls);
      setNotice(lostBadge ? "lostBadge" : "saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!form) {
    return (
      <main className="mx-auto min-h-screen max-w-md px-5 pt-6">
        <ErrorText>{error}</ErrorText>
        {!error && <p className="py-20 text-center text-muted">Loading…</p>}
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-6">
      <Link to="/settings" className="text-sm text-gold underline underline-offset-4">Back to Settings</Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold gold-text">Edit profile {verified && <VerifiedBadge size={28} />}</h1>

      <form onSubmit={save} className="mt-6 grid gap-5">
        <section className="grid gap-3">
          <h2 className="font-display text-xl font-bold">Photos</h2>
          <p className="text-sm text-muted">
            Up to {maxPhotos}. The first is your main photo.
            {verified && " If you add a new photo, your gold badge is removed until you verify again. Removing or reordering photos keeps it."}
          </p>
          <ul className="grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <li key={p.id} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-panel">
                <img src={p.url || p.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => remove(p.id)}
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-cream">×</button>
                {i === 0 ? (
                  <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-xs text-gold">Main</span>
                ) : (
                  <button type="button" onClick={() => makeMain(p.id)}
                    className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-xs text-cream">Make main</button>
                )}
              </li>
            ))}
            {photos.length < maxPhotos && (
              <li className="aspect-[3/4]">
                <label className="grid h-full cursor-pointer place-items-center rounded-xl border border-dashed border-line text-center text-sm text-gold focus-within:outline-2">
                  Add photo
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={addFiles} />
                </label>
              </li>
            )}
          </ul>
          {maxPhotos === 3 && <p className="text-xs text-muted">Premium members can add up to 10.</p>}
        </section>

        <Field label="Display name" value={form.display_name} maxLength={30} onChange={(e) => set({ display_name: e.target.value })} />
        <Field label="Date of birth" type="date" value={form.dob} disabled hint="Your date of birth can't be changed. Email us if it's wrong." />
        <Field label="I am" as="select" value={form.gender} onChange={(e) => set({ gender: e.target.value })}>
          {GENDERS.map((g) => <option key={g}>{g}</option>)}
        </Field>
        <Field label="I'm looking for" as="select" value={form.looking_for} onChange={(e) => set({ looking_for: e.target.value })}>
          {LOOKING_FOR.map((g) => <option key={g}>{g}</option>)}
        </Field>
        <Field label="TikTok username (optional)" value={form.tiktok_username || ""} maxLength={100}
          placeholder="@username or profile link"
          hint="Matches can use the 🤟 link on your profile to visit TikTok."
          onChange={(e) => set({ tiktok_username: e.target.value })} />
        <Field label="Bio" as="textarea" rows={4} maxLength={300} value={form.bio} hint={`${form.bio.length}/300`}
          onChange={(e) => set({ bio: e.target.value })} />

        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium">Interests ({form.interests.length} of {MIN_INTERESTS} to {MAX_INTERESTS})</legend>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((tag) => (
              <button type="button" key={tag} aria-pressed={form.interests.includes(tag)} onClick={() => toggleInterest(tag)}
                className={`rounded-full border px-4 py-2 text-sm ${form.interests.includes(tag) ? "border-gold bg-gold font-bold text-ink" : "border-line text-cream hover:border-gold"}`}>
                {tag}
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="Province" as="select" value={form.province} onChange={(e) => set({ province: e.target.value, city: "" })}>
          <option value="">Choose one</option>
          {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
        </Field>
        <Field label="City or town" as="select" value={form.city} disabled={!form.province} onChange={(e) => set({ city: e.target.value })}>
          <option value="">Choose one</option>
          {(PROVINCES[form.province] || []).map((c) => <option key={c}>{c}</option>)}
        </Field>

        <ErrorText>{error}</ErrorText>
        {notice === "saved" && <p role="status" className="text-gold">Saved.</p>}
        {notice === "lostBadge" && (
          <p role="status" className="text-gold">
            Saved. Your gold badge was removed because you added a new photo.{" "}
            <Link to="/verify" className="underline underline-offset-4">Verify again</Link>
          </p>
        )}
        <Button disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
      </form>
      <BottomNav />
    </main>
  );
}
