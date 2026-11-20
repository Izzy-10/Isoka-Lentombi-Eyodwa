import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Field from "../../components/Field.jsx";
import ErrorText from "../../components/ErrorText.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useOnboarding } from "../../context/OnboardingContext.jsx";
import { PROVINCES } from "../../utils/constants.js";
import { uploadPhoto } from "../../services/storage.js";
import { saveProfile } from "../../services/api.js";

export default function SetupLocation() {
  const { user } = useAuth();
  const { data, update, photos, reset } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const useMyLocation = () =>
    navigator.geolocation.getCurrentPosition(
      (p) => update({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setError("Location is blocked. Choose your city from the list instead.")
    );

  const finish = async () => {
    if (!data.province || !data.city) return setError("Choose your province and city.");
    setError(""); setBusy(true);
    try {
      const photo_urls = await Promise.all(photos.map((f, i) => uploadPhoto(user.uid, f, i)));
      await saveProfile({ ...data, photo_urls, profile_photo: photo_urls[0] });
      localStorage.setItem("isoka_onboarded", "1");
      reset();
      navigate("/discover", { replace: true });
    } catch {
      setError("We couldn't upload your photos. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl font-extrabold gold-text">Where are you based?</h1>
      <Field label="Province" as="select" value={data.province}
        onChange={(e) => update({ province: e.target.value, city: "" })}>
        <option value="">Choose one</option>
        {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
      </Field>
      <Field label="City or town" as="select" value={data.city} disabled={!data.province}
        onChange={(e) => update({ city: e.target.value })}>
        <option value="">Choose one</option>
        {(PROVINCES[data.province] || []).map((c) => <option key={c}>{c}</option>)}
      </Field>

      <div className="grid gap-1">
        <Button variant="ghost" type="button" onClick={useMyLocation}>
          {data.lat ? "Location saved" : "Use my location for distance"}
        </Button>
        <p className="text-xs text-muted">Optional. Other people only see your city, never your exact position.</p>
      </div>

      <ErrorText>{error}</ErrorText>
      <Button disabled={busy} onClick={finish}>{busy ? "Setting up your profile…" : "Finish"}</Button>
      <Button variant="link" onClick={() => navigate("/onboarding/interests")}>Back</Button>
    </div>
  );
}
