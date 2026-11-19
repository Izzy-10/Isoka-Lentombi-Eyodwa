import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.js";
import { shrinkImage } from "../utils/image.js";

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
