import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import ErrorText from "../../components/ErrorText.jsx";
import { useOnboarding } from "../../context/OnboardingContext.jsx";
import { MAX_PHOTOS, MIN_PHOTOS } from "../../utils/constants.js";

const MAX_MB = 8;

export default function SetupPhotos() {
  const { photos, setPhotos } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const previews = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const add = (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    for (const f of files) {
      if (!f.type.startsWith("image/")) return setError("Only image files are allowed.");
      if (f.size > MAX_MB * 1024 * 1024) return setError(`Each photo must be under ${MAX_MB} MB.`);
    }
    setError("");
    setPhotos([...photos, ...files].slice(0, MAX_PHOTOS));
  };

  const next = () => {
    if (photos.length < MIN_PHOTOS) return setError("Add at least 1 photo that clearly shows your face.");
    navigate("/onboarding/interests");
  };

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl font-extrabold gold-text">Add your photos</h1>
      <p className="text-muted">Add up to {MAX_PHOTOS}. Your first photo is your main one. Show your face clearly.</p>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-dashed border-line bg-panel">
            {previews[i] ? (
              <>
                <img src={previews[i]} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-cream"
                >
                  ×
                </button>
              </>
            ) : (
              i === photos.length && (
                <label className="grid h-full cursor-pointer place-items-center text-center text-sm text-gold focus-within:outline-2">
                  Add photo
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={add} />
                </label>
              )
            )}
          </div>
        ))}
      </div>

      <ErrorText>{error}</ErrorText>
      <Button onClick={next}>Continue</Button>
      <Button variant="link" onClick={() => navigate("/onboarding/interests")}>
        Skip photos for now
      </Button>
      <Button variant="link" onClick={() => navigate("/onboarding/profile")}>Back</Button>
    </div>
  );
}
