import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Field from "../../components/Field.jsx";
import ErrorText from "../../components/ErrorText.jsx";
import { useOnboarding } from "../../context/OnboardingContext.jsx";
import { GENDERS, LOOKING_FOR } from "../../utils/constants.js";
import { ageFromDob } from "../../utils/helpers.js";

export default function SetupProfile() {
  const { data, update } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const next = (e) => {
    e.preventDefault();
    if (data.display_name.trim().length < 2) return setError("Enter the name you want people to see.");
    if (ageFromDob(data.dob) < 18) return setError("You must be 18 or older to use Isoka.");
    if (!data.gender || !data.looking_for) return setError("Choose your gender and what you're looking for.");
    if (!data.accepted_terms) return setError("Please accept the Terms and Privacy Policy to continue.");
    setError("");
    navigate("/onboarding/photos");
  };

  return (
    <form onSubmit={next} className="grid gap-5">
      <h1 className="font-display text-3xl font-extrabold">Tell us about you</h1>
      <Field label="Display name" value={data.display_name} maxLength={30}
        onChange={(e) => update({ display_name: e.target.value })} />
      <Field label="Date of birth" type="date" value={data.dob}
        max={new Date().toISOString().slice(0, 10)}
        hint="Only your age is shown to other people."
        onChange={(e) => update({ dob: e.target.value })} />
      <Field label="I am" as="select" value={data.gender} onChange={(e) => update({ gender: e.target.value })}>
        <option value="">Choose one</option>
        {GENDERS.map((g) => <option key={g}>{g}</option>)}
      </Field>
      <Field label="I'm looking for" as="select" value={data.looking_for}
        onChange={(e) => update({ looking_for: e.target.value })}>
        <option value="">Choose one</option>
        {LOOKING_FOR.map((g) => <option key={g}>{g}</option>)}
      </Field>
      <Field label="Bio" as="textarea" rows={4} maxLength={300} value={data.bio}
        hint={`${data.bio.length}/300`} onChange={(e) => update({ bio: e.target.value })} />
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={data.accepted_terms} onChange={(e) => update({ accepted_terms: e.target.checked })}
          className="mt-1 h-5 w-5 accent-[#d4af37]" />
        <span>
          I am 18 or older, and I agree to the{" "}
          <Link to="/terms" target="_blank" className="text-gold underline underline-offset-4">Terms</Link> and{" "}
          <Link to="/privacy" target="_blank" className="text-gold underline underline-offset-4">Privacy Policy</Link>.
        </span>
      </label>
      <ErrorText>{error}</ErrorText>
      <Button>Continue</Button>
    </form>
  );
}
