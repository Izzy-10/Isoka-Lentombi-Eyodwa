import { auth } from "./firebase.js";

const API = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")
  : "";

async function authed(path, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    const error = new Error("Please sign in again.");
    error.status = 401;
    throw error;
  }

  let token;
  try {
    token = await user.getIdToken();
  } catch {
    const error = new Error("Your session expired. Please sign in again.");
    error.status = 401;
    throw error;
  }

  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    });
  } catch {
    const error = new Error("Couldn’t reach the API. Check your connection and try again.");
    error.status = 503;
    throw error;
  }

  if (res.status === 204) return null;
  if (!res.headers.get("content-type")?.includes("json")) {
    const error = new Error("The API returned a web page instead of data. Check that this deployment includes the profile API.");
    error.status = 502;
    throw error;
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body.detail || "Something went wrong. Try again.");
    error.status = res.status;
    throw error;
  }
  return body;
}

export const verifySession = () => authed("/api/auth/verify-token", { method: "POST" });

export const saveProfile = (profile) =>
  authed("/api/profiles/me", { method: "PUT", body: JSON.stringify(profile) });

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
