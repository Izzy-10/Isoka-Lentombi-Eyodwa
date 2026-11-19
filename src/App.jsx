import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import Discover from "./pages/Discover.jsx";
import Matches from "./pages/Matches.jsx";
import Chat from "./pages/Chat.jsx";
import Premium from "./pages/Premium.jsx";
import Settings from "./pages/Settings.jsx";
import Safety from "./pages/Safety.jsx";
import Legal from "./pages/Legal.jsx";
import Verify from "./pages/Verify.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import Notifications from "./pages/Notifications.jsx";
import OnboardingLayout from "./pages/onboarding/OnboardingLayout.jsx";
import SetupProfile from "./pages/onboarding/SetupProfile.jsx";
import SetupPhotos from "./pages/onboarding/SetupPhotos.jsx";
import SetupInterests from "./pages/onboarding/SetupInterests.jsx";
import SetupLocation from "./pages/onboarding/SetupLocation.jsx";

const isOnboarded = () => localStorage.getItem("isoka_onboarded") === "1";

function Splash() {
  return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return user ? children : <Navigate to="/login" replace />;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Welcome />;
  return <Navigate to={isOnboarded() ? "/discover" : "/onboarding/profile"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/privacy" element={<Legal doc="privacy" />} />
      <Route path="/terms" element={<Legal doc="terms" />} />
      <Route path="/onboarding" element={<RequireAuth><OnboardingLayout /></RequireAuth>}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<SetupProfile />} />
        <Route path="photos" element={<SetupPhotos />} />
        <Route path="interests" element={<SetupInterests />} />
        <Route path="location" element={<SetupLocation />} />
      </Route>
      <Route path="/discover" element={<RequireAuth><Discover /></RequireAuth>} />
      <Route path="/matches" element={<RequireAuth><Matches /></RequireAuth>} />
      <Route path="/chat/:matchId" element={<RequireAuth><Chat /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      <Route path="/premium" element={<RequireAuth><Premium /></RequireAuth>} />
      <Route path="/payment/callback" element={<RequireAuth><PaymentCallback /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/safety" element={<RequireAuth><Safety /></RequireAuth>} />
      <Route path="/verify" element={<RequireAuth><Verify /></RequireAuth>} />
      <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
