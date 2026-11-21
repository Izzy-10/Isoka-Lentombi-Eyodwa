function ageFromDob(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const birthDate = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== value) return null;

  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  if (
    today.getUTCMonth() < birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())
  ) age -= 1;
  return age >= 18 ? age : null;
}

function isSafePhotoUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "firebasestorage.googleapis.com";
  } catch {
    return false;
  }
}

export function toDiscoverCard(id, profile) {
  if (!profile || typeof profile !== "object" || profile.accepted_terms !== true) return null;

  const age = ageFromDob(profile.dob);
  const displayName = typeof profile.display_name === "string" ? profile.display_name.trim() : "";
  const city = typeof profile.city === "string" ? profile.city.trim() : "";
  const province = typeof profile.province === "string" ? profile.province.trim() : "";
  const photos = Array.isArray(profile.photo_urls) ? profile.photo_urls.filter(isSafePhotoUrl) : [];
  if (!photos.length && isSafePhotoUrl(profile.profile_photo)) photos.push(profile.profile_photo);
  if (!age || !displayName || !city || !province || !photos.length) return null;

  return {
    id,
    display_name: displayName,
    age,
    verified: profile.verified === true,
    city,
    province,
    bio: typeof profile.bio === "string" ? profile.bio : "",
    photo_urls: photos,
    profile_photo: photos[0],
    tiktok_username: typeof profile.tiktok_username === "string" ? profile.tiktok_username : "",
    interests: Array.isArray(profile.interests)
      ? profile.interests.filter((interest) => typeof interest === "string").slice(0, 10)
      : [],
  };
}
