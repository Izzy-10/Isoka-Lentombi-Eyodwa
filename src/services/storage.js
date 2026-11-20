import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.js";
import { shrinkImage } from "../utils/image.js";

/** Turns a Firebase Storage error into something a person can act on. */
export function describeStorageError(e) {
  const code = e?.code || "";
  const notSetUp = "Storage isn't set up for this project. In Firebase, open Storage and tap Get started (it needs the Blaze plan).";
  const messages = {
    "storage/unauthorized": "Firebase Storage is blocking the upload. In Firebase, open Storage, then Rules, and paste the Isoka rules.",
    "storage/unauthenticated": "Your login expired. Log out, log in again and retry.",
    "storage/retry-limit-exceeded": "We couldn't reach Firebase Storage. Check your signal. If it keeps happening, Storage may not be set up (it needs the Blaze plan).",
    "storage/bucket-not-found": notSetUp,
    "storage/project-not-found": notSetUp,
    "storage/quota-exceeded": "Your Firebase Storage quota is used up.",
    timeout: "The upload took too long. Check your signal and try again. If it keeps happening, Storage may not be set up (it needs the Blaze plan).",
  };
  return `${messages[code] || "We couldn't upload your photos."} (${code || e?.message || "unknown error"})`;
}

/** Rejects if the work takes longer than ms, so a stuck upload can't leave the screen loading forever. */
export const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("timed out"), { code: "timeout" })), ms))]);

export async function uploadPhoto(uid, file, index) {
  // Shrunk to a JPEG first: faster, and it removes hidden metadata such as GPS location from photos others can see
  const blob = await shrinkImage(file, 1600, 0.88);
  const r = ref(storage, `users/${uid}/photos/${index}-${Date.now()}.jpg`);
  await uploadBytes(r, blob, { contentType: "image/jpeg" });
  return getDownloadURL(r);
}

// Used when someone deletes their account: remove their photos from Firebase Storage first.
import { listAll, deleteObject } from "firebase/storage";

export async function deleteAllPhotos(uid) {
  const folder = await listAll(ref(storage, `users/${uid}/photos`));
  await Promise.all(folder.items.map((item) => deleteObject(item)));
}

// Verification selfie. The path comes from the server, and the storage rules make it write-only.
export async function uploadSelfie(path, blob) {
  await uploadBytes(ref(storage, path), blob, { contentType: "image/jpeg" });
}

// Remove a photo file the person took out of their profile. Best effort.
export async function deletePhotoByUrl(url) {
  try { await deleteObject(ref(storage, url)); } catch { /* already gone */ }
}
