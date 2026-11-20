import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// If the app can't start, show why on screen instead of a blank page.
const REQUIRED = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_APP_ID",
];

function Problem({ title, lines }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 py-10">
      <h1 className="font-display text-3xl font-extrabold text-gold">{title}</h1>
      {lines.map((l, i) => <p key={i} className="break-words text-cream">{l}</p>)}
    </main>
  );
}

class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return <Problem title="Something broke" lines={[String(this.state.error.message || this.state.error)]} />;
    }
    return this.props.children;
  }
}

const root = createRoot(document.getElementById("root"));
const missing = REQUIRED.filter((k) => !import.meta.env[k]);

if (missing.length) {
  root.render(
    <Problem
      title="Setup needed"
      lines={[
        "These settings are missing from this build:",
        ...missing,
        "Add them in Vercel: Settings, Environment Variables. Then redeploy.",
      ]}
    />
  );
} else {
  // Loaded after the check, because Firebase throws as soon as it loads with a bad key
  Promise.all([
    import("react-router-dom"),
    import("./App.jsx"),
    import("./context/AuthContext.jsx"),
    import("./context/OnboardingContext.jsx"),
  ])
    .then(([{ BrowserRouter }, { default: App }, { AuthProvider }, { OnboardingProvider }]) => {
      root.render(
        <React.StrictMode>
          <Boundary>
            <BrowserRouter>
              <AuthProvider>
                <OnboardingProvider>
                  <App />
                </OnboardingProvider>
              </AuthProvider>
            </BrowserRouter>
          </Boundary>
        </React.StrictMode>
      );
    })
    .catch((e) => root.render(<Problem title="The app couldn't start" lines={[String(e?.message || e)]} />));
}
