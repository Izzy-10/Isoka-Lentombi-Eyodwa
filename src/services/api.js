import { auth } from "./firebase.js";

const API = import.meta.env.VITE_API_URL;

async function authed(path, options = {}) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.detail || "Something went wrong. Try again.");
    err.status = res.status;
    throw err;
  }
  return body;
}

// Call after login so Django creates/loads the user from the Firebase token.
export const verifySession = () => authed("/api/auth/verify-token", { method: "POST" });

// Saves to Django when the backend is up; otherwise keeps a local copy so onboarding still completes.
export async function saveProfile(profile) {
  localStorage.setItem("isoka_profile", JSON.stringify(profile));
  if (!API) return { offline: true };
  try {
    return await authed("/api/profiles/me", { method: "PUT", body: JSON.stringify(profile) });
  } catch {
    return { offline: true };
  }
}

// Week 2
export const getDiscover = (filters = {}) => {
  const qs = new URLSearchParams(filters).toString();
  return authed(`/api/discover${qs ? `?${qs}` : ""}`);
};
export const sendSwipe = (swiped_id, action) =>
  authed("/api/swipes", { method: "POST", body: JSON.stringify({ swiped_id, action }) });
export const getMatches = () => authed("/api/matches");
export const unmatch = (id) => authed(`/api/matches/${id}`, { method: "DELETE" });

// Week 3
export const getMessages = (matchId, before) =>
  authed(`/api/matches/${matchId}/messages${before ? `?before=${encodeURIComponent(before)}` : ""}`);
export const blockUser = (user_id) => authed("/api/blocks", { method: "POST", body: JSON.stringify({ user_id }) });
export const reportUser = (user_id, reason, details) =>
  authed("/api/reports", { method: "POST", body: JSON.stringify({ user_id, reason, details }) });
export const getNotifications = () => authed("/api/notifications");
export const markNotificationsRead = () => authed("/api/notifications/read", { method: "POST" });

// Week 4: payments
export const getPlans = () => authed("/api/payments/plans");
export const getBilling = () => authed("/api/payments/me");
export const startCheckout = (plan) => authed("/api/payments/initialize", { method: "POST", body: JSON.stringify({ plan }) });
export const verifyPayment = (reference) =>
  authed("/api/payments/verify", { method: "POST", body: JSON.stringify({ reference }) });

// Account (POPIA)
export const exportMyData = () => authed("/api/account/export");
export const deleteAccount = () => authed("/api/account", { method: "DELETE" });

// Photo verification
export const getVerification = () => authed("/api/verification");
export const startVerification = () =>
  authed("/api/verification/start", { method: "POST", body: JSON.stringify({ consent: true }) });
export const submitVerification = () => authed("/api/verification/submit", { method: "POST" });

// Profile editing
export const getMyProfile = () => authed("/api/profiles/me");
export const updateProfile = (profile) => authed("/api/profiles/me", { method: "PUT", body: JSON.stringify(profile) });
