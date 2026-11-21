import { and, eq, gte, sql } from "drizzle-orm";
import { swipes } from "./schema.js";

export const FREE_DAILY_SWIPE_LIMIT = 10;

export function southAfricanDayStart(now = new Date()) {
  const offsetMs = 2 * 60 * 60 * 1000;
  const southAfricanNow = new Date(now.getTime() + offsetMs);
  return new Date(Date.UTC(
    southAfricanNow.getUTCFullYear(),
    southAfricanNow.getUTCMonth(),
    southAfricanNow.getUTCDate(),
  ) - offsetMs);
}

export async function getDailySwipeCount(db, userId) {
  const [usage] = await db
    .select({ count: sql`count(*)::int` })
    .from(swipes)
    .where(and(eq(swipes.swiperId, userId), gte(swipes.createdAt, southAfricanDayStart())));
  return Number(usage?.count ?? 0);
}
