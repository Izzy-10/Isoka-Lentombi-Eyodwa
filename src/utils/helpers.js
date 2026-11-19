// 071 234 5678 / 27712345678 / +27712345678  ->  +27712345678
export function normalizeZAPhone(input) {
  const d = String(input).replace(/[^\d+]/g, "");
  if (/^\+27\d{9}$/.test(d)) return d;
  if (/^27\d{9}$/.test(d)) return `+${d}`;
  if (/^0\d{9}$/.test(d)) return `+27${d.slice(1)}`;
  return null;
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
