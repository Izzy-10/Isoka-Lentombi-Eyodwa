import { and, desc, eq, ne, notExists, sql } from "drizzle-orm";
import { getDatabase } from "../server/db.js";
import { requireFirebaseUser } from "../server/firebase-auth.js";
import { ApiError, prepareApiResponse, sendApiError } from "../server/http.js";
import { toDiscoverCard } from "../server/discover-profile.js";
import { getDailySwipeCount, FREE_DAILY_SWIPE_LIMIT } from "../server/swipe-usage.js";
import { profiles, swipes } from "../server/schema.js";

const allowedMethods = ["GET", "OPTIONS"];
const DISCOVER_PAGE_SIZE = 30;

export default async function handler(req, res) {
  if (!prepareApiResponse(req, res, allowedMethods)) return;
  if (!allowedMethods.includes(req.method)) {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ detail: "Method not allowed." });
  }

  try {
    const userId = await requireFirebaseUser(req);
    const db = getDatabase();
    const [ownProfile] = await db
      .select({ profile: profiles.profile })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!toDiscoverCard(userId, ownProfile?.profile)) {
      throw new ApiError(409, "Complete your profile before discovering people.");
    }

    const alreadySwiped = db
      .select({ swipedId: swipes.swipedId })
      .from(swipes)
      .where(and(eq(swipes.swiperId, userId), eq(swipes.swipedId, profiles.userId)));

    const rows = await db
      .select({ id: profiles.userId, profile: profiles.profile })
      .from(profiles)
      .where(and(
        ne(profiles.userId, userId),
        sql`${profiles.profile}->>'accepted_terms' = 'true'`,
        notExists(alreadySwiped),
      ))
      .orderBy(desc(profiles.updatedAt))
      .limit(DISCOVER_PAGE_SIZE * 2);

    const results = rows
      .map(({ id, profile }) => toDiscoverCard(id, profile))
      .filter(Boolean)
      .slice(0, DISCOVER_PAGE_SIZE);
    const swipesUsed = await getDailySwipeCount(db, userId);

    return res.status(200).json({
      results,
      swipes_left: Math.max(0, FREE_DAILY_SWIPE_LIMIT - swipesUsed),
    });
  } catch (error) {
    return sendApiError(res, error);
  }
}
