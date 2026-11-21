import { and, eq } from "drizzle-orm";
import { getDatabase } from "../server/db.js";
import { requireFirebaseUser } from "../server/firebase-auth.js";
import { ApiError, prepareApiResponse, sendApiError } from "../server/http.js";
import { toDiscoverCard } from "../server/discover-profile.js";
import { getDailySwipeCount, FREE_DAILY_SWIPE_LIMIT } from "../server/swipe-usage.js";
import { matches, profiles, swipes } from "../server/schema.js";

const allowedMethods = ["POST", "OPTIONS"];
const MAX_REQUEST_BYTES = 4 * 1024;

function parseBody(body) {
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      throw new ApiError(400, "Submit a valid swipe.");
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Submit a valid swipe.");
  }
  return body;
}

async function findOrCreateMatch(db, userId, targetId) {
  const [reciprocalLike] = await db
    .select({ swiperId: swipes.swiperId })
    .from(swipes)
    .where(and(
      eq(swipes.swiperId, targetId),
      eq(swipes.swipedId, userId),
      eq(swipes.action, "like"),
    ))
    .limit(1);

  if (!reciprocalLike) return null;

  const [userOneId, userTwoId] = [userId, targetId].sort();
  const [createdMatch] = await db
    .insert(matches)
    .values({ userOneId, userTwoId })
    .onConflictDoNothing()
    .returning({ id: matches.id });

  if (createdMatch) return createdMatch.id;

  const [existingMatch] = await db
    .select({ id: matches.id })
    .from(matches)
    .where(and(eq(matches.userOneId, userOneId), eq(matches.userTwoId, userTwoId)))
    .limit(1);
  return existingMatch?.id ?? null;
}

async function respondWithSwipeState(res, db, userId, targetId, action) {
  const swipesUsed = await getDailySwipeCount(db, userId);
  const matchId = action === "like" ? await findOrCreateMatch(db, userId, targetId) : null;
  return res.status(200).json({
    swipes_left: Math.max(0, FREE_DAILY_SWIPE_LIMIT - swipesUsed),
    matched: Boolean(matchId),
    match_id: matchId,
  });
}

export default async function handler(req, res) {
  if (!prepareApiResponse(req, res, allowedMethods)) return;
  if (!allowedMethods.includes(req.method)) {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ detail: "Method not allowed." });
  }

  try {
    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > MAX_REQUEST_BYTES) throw new ApiError(413, "Swipe data is too large.");

    const userId = await requireFirebaseUser(req);
    const body = parseBody(req.body);
    const targetId = body.swiped_id;
    const action = body.action;

    if (typeof targetId !== "string" || targetId.length === 0 || targetId.length > 128 || targetId.trim() !== targetId) {
      throw new ApiError(400, "Choose a valid profile.");
    }
    if (action === "superlike") throw new ApiError(403, "Super likes are a Premium feature.");
    if (action !== "like" && action !== "dislike") throw new ApiError(400, "Choose a valid swipe action.");
    if (targetId === userId) throw new ApiError(400, "You cannot swipe on your own profile.");

    const db = getDatabase();
    const [target] = await db
      .select({ profile: profiles.profile })
      .from(profiles)
      .where(eq(profiles.userId, targetId))
      .limit(1);
    if (!toDiscoverCard(targetId, target?.profile)) throw new ApiError(404, "That profile is no longer available.");

    const [existingSwipe] = await db
      .select({ action: swipes.action })
      .from(swipes)
      .where(and(eq(swipes.swiperId, userId), eq(swipes.swipedId, targetId)))
      .limit(1);
    if (existingSwipe) return respondWithSwipeState(res, db, userId, targetId, existingSwipe.action);

    const swipesUsed = await getDailySwipeCount(db, userId);
    if (swipesUsed >= FREE_DAILY_SWIPE_LIMIT) {
      throw new ApiError(429, "That’s your 10 free swipes for today. Try again tomorrow or go Premium.");
    }

    const [savedSwipe] = await db
      .insert(swipes)
      .values({ swiperId: userId, swipedId: targetId, action })
      .onConflictDoNothing()
      .returning({ swipedId: swipes.swipedId });

    if (!savedSwipe) {
      const [recordedSwipe] = await db
        .select({ action: swipes.action })
        .from(swipes)
        .where(and(eq(swipes.swiperId, userId), eq(swipes.swipedId, targetId)))
        .limit(1);
      return respondWithSwipeState(res, db, userId, targetId, recordedSwipe?.action);
    }

    return respondWithSwipeState(res, db, userId, targetId, action);
  } catch (error) {
    return sendApiError(res, error);
  }
}
