import { GENDERS, INTERESTS, LOOKING_FOR, PROVINCES } from "../src/utils/constants.js";
import { ApiError } from "./http.js";

function requireText(value, field, maxLength, minLength = 0) {
  if (typeof value !== "string") throw new ApiError(400, `Enter a valid ${field}.`);
  const normalized = value.trim();
  if (normalized.length < minLength || normalized.length > maxLength) {
    throw new ApiError(400, `Enter a valid ${field}.`);
  }
  return normalized;
}

function normalizeDateOfBirth(value) {
  const dob = requireText(value, "date of birth", 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) throw new ApiError(400, "Enter a valid date of birth.");
  const birthDate = new Date(`${dob}T00:00:00.000Z`);
  if (!Number.isFinite(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== dob) {
    throw new ApiError(400, "Enter a valid date of birth.");
  }

  const today = new Date();
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  if (
    today.getUTCMonth() < birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())
  ) age -= 1;
  if (age < 18) throw new ApiError(400, "You must be 18 or older to use Isoka.");
  return dob;
}

function validatePhotoUrl(value, userId) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    const encodedPath = url.pathname.split("/o/")[1];
    const objectPath = encodedPath ? decodeURIComponent(encodedPath) : "";
    return url.protocol === "https:" &&
      url.hostname === "firebasestorage.googleapis.com" &&
      objectPath.startsWith(`users/${userId}/photos/`);
  } catch {
    return false;
  }
}

function coordinate(value, fallback, min, max, field) {
  if (value === undefined) value = fallback ?? null;
  if (value === null || value === "") return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw new ApiError(400, `Enter a valid ${field}.`);
  }
  return value;
}

export function validateProfile(input, previous, userId) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, "Submit a valid profile.");
  }

  const displayName = requireText(input.display_name, "display name", 30, 2);
  const dob = normalizeDateOfBirth(input.dob ?? previous?.dob);
  if (!GENDERS.includes(input.gender)) throw new ApiError(400, "Choose a valid gender.");
  if (!LOOKING_FOR.includes(input.looking_for)) throw new ApiError(400, "Choose a valid preference.");

  const bio = requireText(input.bio ?? previous?.bio ?? "", "bio", 300);
  const interests = input.interests ?? previous?.interests;
  if (
    !Array.isArray(interests) ||
    interests.length < 3 ||
    interests.length > 10 ||
    new Set(interests).size !== interests.length ||
    interests.some((interest) => !INTERESTS.includes(interest))
  ) throw new ApiError(400, "Choose between 3 and 10 valid interests.");

  const province = requireText(input.province, "province", 40, 1);
  const city = requireText(input.city, "city or town", 60, 1);
  if (!Object.hasOwn(PROVINCES, province) || !PROVINCES[province].includes(city)) {
    throw new ApiError(400, "Choose a valid province and city.");
  }

  const acceptedTerms = input.accepted_terms === true || previous?.accepted_terms === true;
  if (!acceptedTerms) throw new ApiError(400, "Please accept the Terms and Privacy Policy.");

  const photoUrls = input.photo_urls ?? previous?.photo_urls ?? (previous?.profile_photo ? [previous.profile_photo] : []);
  if (!Array.isArray(photoUrls) || photoUrls.length > 10 || photoUrls.some((url) => !validatePhotoUrl(url, userId))) {
    throw new ApiError(400, "One or more profile photos are invalid.");
  }
  if (!previous && photoUrls.length === 0) throw new ApiError(400, "Add at least one profile photo.");

  const previousPhotoUrls = Array.isArray(previous?.photo_urls) ? previous.photo_urls : [];
  const hasNewPhoto = photoUrls.some((url) => !previousPhotoUrls.includes(url));
  const username = requireText(input.tiktok_username ?? previous?.tiktok_username ?? "", "TikTok username", 100);

  return {
    display_name: displayName,
    dob,
    gender: input.gender,
    looking_for: input.looking_for,
    bio,
    accepted_terms: true,
    terms_version: previous?.terms_version || process.env.TERMS_VERSION || "draft",
    terms_accepted_at: previous?.terms_accepted_at || new Date().toISOString(),
    interests,
    tiktok_username: username,
    province,
    city,
    lat: coordinate(input.lat, previous?.lat, -90, 90, "latitude"),
    lng: coordinate(input.lng, previous?.lng, -180, 180, "longitude"),
    photo_urls: photoUrls,
    profile_photo: photoUrls[0] ?? null,
    verified: previous?.verified === true && !hasNewPhoto,
  };
}
