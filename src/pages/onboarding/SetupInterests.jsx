import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import ErrorText from "../../components/ErrorText.jsx";
import { useOnboarding } from "../../context/OnboardingContext.jsx";
import { INTERESTS, MAX_INTERESTS, MIN_INTERESTS } from "../../utils/constants.js";

export default function SetupInterests() {
  const { data, update } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const picked = data.interests;

  const toggle = (tag) => {
    if (picked.includes(tag)) return update({ interests: picked.filter((t) => t !== tag) });
    if (picked.length >= MAX_INTERESTS) return setError(`You can pick up to ${MAX_INTERESTS}.`);
    setError("");
    update({ interests: [...picked, tag] });
  };

  const next = () => {
    if (picked.length < MIN_INTERESTS) return setError(`Pick at least ${MIN_INTERESTS} interests.`);
    navigate("/onboarding/location");
  };

  return (
    <div className="grid gap-5">
      <h1 className="font-display text-3xl font-extrabold gold-text">What are you into?</h1>
      <p className="text-muted">Pick {MIN_INTERESTS} to {MAX_INTERESTS}. We use these to suggest people.</p>

      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((tag) => (
          <button
            key={tag} aria-pressed={picked.includes(tag)} onClick={() => toggle(tag)}
            className={`rounded-full border px-4 py-2 text-sm ${
              picked.includes(tag) ? "border-gold bg-gold text-ink font-bold" : "border-line text-cream hover:border-gold"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <ErrorText>{error}</ErrorText>
      <Button onClick={next}>Continue</Button>
      <Button variant="link" onClick={() => navigate("/onboarding/photos")}>Back</Button>
    </div>
  );
}
