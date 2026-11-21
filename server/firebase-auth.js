import { createRemoteJWKSet, jwtVerify } from "jose";
import { ApiError } from "./http.js";

const firebaseKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function requireFirebaseUser(req) {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new ApiError(503, "Authentication is not configured for this deployment.");

  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new ApiError(401, "Please sign in again.");

  let payload;
  try {
    ({ payload } = await jwtVerify(match[1], firebaseKeys, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    }));
  } catch {
    throw new ApiError(401, "Your session is invalid or has expired. Please sign in again.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    typeof payload.sub !== "string" ||
    payload.sub.length === 0 ||
    payload.sub.length > 128 ||
    typeof payload.auth_time !== "number" ||
    payload.auth_time > now + 60
  ) {
    throw new ApiError(401, "Your session is invalid or has expired. Please sign in again.");
  }

  return payload.sub;
}
