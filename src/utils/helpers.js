// 071 234 5678 / 27712345678 / +27712345678  ->  +27712345678
export function normalizeZAPhone(input) {
  const d = String(input).replace(/[^\d+]/g, "");
  if (/^\+27\d{9}$/.test(d)) return d;
  if (/^27\d{9}$/.test(d)) return `+${d}`;
  if (/^0\d{9}$/.test(d)) return `+27${d.slice(1)}`;
  return null;
}

export function normalizeTikTokUsername(input) {
  const value = String(input || "").trim();
  if (!value) return "";

  let username = value;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!/(^|\.)tiktok\.com$/i.test(url.hostname)) return null;
      username = url.pathname.split("/").filter(Boolean)[0] || "";
    } catch {
      return null;
    }
  }

  username = username.replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,24}$/.test(username) ? username : null;
}

export function ageFromDob(dob) {
  if (!dob) return 0;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}
