import { eq } from "drizzle-orm";
import { getDatabase } from "../../server/db.js";
import { requireFirebaseUser } from "../../server/firebase-auth.js";
import { ApiError, prepareApiResponse, sendApiError } from "../../server/http.js";
import { validateProfile } from "../../server/profile-validation.js";
import { profiles } from "../../server/schema.js";

const allowedMethods = ["GET", "PUT", "OPTIONS"];

function parseBody(body) {
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      throw new ApiError(400, "Submit a valid profile.");
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Submit a valid profile.");
  }
  return body;
}

export default async function handler(req, res) {
  if (!prepareApiResponse(req, res, allowedMethods)) return;
  if (!allowedMethods.includes(req.method)) {
    res.setHeader("Allow", "GET, PUT, OPTIONS");
    return res.status(405).json({ detail: "Method not allowed." });
  }

  try {
    const userId = await requireFirebaseUser(req);
    const db = getDatabase();

    if (req.method === "GET") {
      const [row] = await db
        .select({ profile: profiles.profile })
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1);
      return res.status(200).json(row?.profile ?? {});
    }

    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > 32 * 1024) throw new ApiError(413, "Profile data is too large.");

    const [existing] = await db
      .select({ profile: profiles.profile })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    const profile = validateProfile(parseBody(req.body), existing?.profile, userId);
    const [saved] = await db
      .insert(profiles)
      .values({ userId, profile, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: { profile, updatedAt: new Date() },
      })
      .returning({ profile: profiles.profile });

    return res.status(200).json(saved.profile);
  } catch (error) {
    return sendApiError(res, error);
  }
}
