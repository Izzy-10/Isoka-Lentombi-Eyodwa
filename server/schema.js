import { sql } from "drizzle-orm";
import { check, index, jsonb, pgTable, primaryKey, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  profile: jsonb("profile").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const swipes = pgTable("swipes", {
  swiperId: text("swiper_id").notNull(),
  swipedId: text("swiped_id").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pairPrimaryKey: primaryKey({ columns: [table.swiperId, table.swipedId] }),
  dailyUsageIndex: index("swipes_daily_usage_idx").on(table.swiperId, table.createdAt),
  actionCheck: check("swipes_action_check", sql`${table.action} in ('like', 'dislike')`),
  noSelfSwipe: check("swipes_no_self_swipe", sql`${table.swiperId} <> ${table.swipedId}`),
}));

export const matches = pgTable("matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  userOneId: text("user_one_id").notNull(),
  userTwoId: text("user_two_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  pairUnique: unique("matches_pair_unique").on(table.userOneId, table.userTwoId),
  orderedPair: check("matches_ordered_pair", sql`${table.userOneId} < ${table.userTwoId}`),
}));
