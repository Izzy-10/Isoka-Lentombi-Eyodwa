import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";
import { normalizeZAPhone } from "../utils/helpers.js";

let verifier;

export async function sendOtp(rawPhone) {
  const phone = normalizeZAPhone(rawPhone);
  if (!phone) throw new Error("Enter a valid South African number, like 071 234 5678.");
  if (!verifier) {
    verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  }
  try {
    return await signInWithPhoneNumber(auth, phone, verifier);
  } catch (e) {
    verifier?.clear();
    verifier = undefined;
    throw e;
  }
}

export const confirmOtp = (confirmation, code) => confirmation.confirm(code);
export const googleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
export const emailSignUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const emailSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

const ERRORS = {
  "auth/invalid-credential": "Email or password is wrong. Check both and try again.",
  "auth/email-already-in-use": "That email already has an account. Log in instead.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  "auth/invalid-verification-code": "That code is wrong. Check the SMS and try again.",
  "auth/code-expired": "That code expired. Request a new one.",
  "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed. Try again.",
  "auth/invalid-phone-number": "That phone number isn't valid. Check it and try again.",
};
export const friendlyError = (e) => ERRORS[e?.code] || e?.message || "Something went wrong. Try again.";
