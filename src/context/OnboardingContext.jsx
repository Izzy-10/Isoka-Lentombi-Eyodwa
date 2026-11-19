import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);
export const useOnboarding = () => useContext(OnboardingContext);

const KEY = "isoka_onboarding";
const empty = {
  display_name: "", dob: "", gender: "", looking_for: "", bio: "",
  accepted_terms: false, interests: [], province: "", city: "", lat: null, lng: null,
};

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(() => {
    try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return empty; }
  });
  const [photos, setPhotos] = useState([]); // File objects stay in memory, not localStorage

  const update = (patch) =>
    setData((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });

  const reset = () => { localStorage.removeItem(KEY); setData(empty); setPhotos([]); };

  return (
    <OnboardingContext.Provider value={{ data, update, photos, setPhotos, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}
