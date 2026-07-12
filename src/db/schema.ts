import { sql } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "viewer"]);
export const subscriberStatusEnum = pgEnum("subscriber_status", [
  "active",
  "unsubscribed",
]);
export const goalPlatformEnum = pgEnum("goal_platform", [
  "youtube",
  "instagram",
  "tiktok",
  "twitter",
  "linkedin",
  "other",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const socialChannels = pgTable("social_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 40 }).notNull().unique(),
  label: varchar("label", { length: 80 }).notNull(),
  url: text("url"),
  followerCount: integer("follower_count").notNull().default(0),
  /** Follower count at the start of `dayStartDate` (calendar day in Europe/London). */
  dayStartCount: integer("day_start_count").notNull().default(0),
  dayStartDate: date("day_start_date").notNull().default(sql`CURRENT_DATE`),
  viewCount: integer("view_count").notNull().default(0),
  dayStartViewCount: integer("day_start_view_count").notNull().default(0),
  videoCount: integer("video_count").notNull().default(0),
  externalId: varchar("external_id", { length: 80 }),
  channelTitle: varchar("channel_title", { length: 160 }),
  thumbnailUrl: text("thumbnail_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const socialMetricSnapshots = pgTable(
  "social_metric_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => socialChannels.id, { onDelete: "cascade" }),
    capturedOn: date("captured_on").notNull(),
    followerCount: integer("follower_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    videoCount: integer("video_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    channelDayUnique: uniqueIndex("social_metric_snapshots_channel_day_uidx").on(
      table.channelId,
      table.capturedOn,
    ),
  }),
);

export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  platform: goalPlatformEnum("platform").notNull().default("other"),
  channelId: uuid("channel_id").references(() => socialChannels.id, {
    onDelete: "set null",
  }),
  metricKey: varchar("metric_key", { length: 40 }),
  targetValue: integer("target_value").notNull().default(0),
  currentValue: integer("current_value").notNull().default(0),
  notes: text("notes"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const milestones = pgTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  goalId: uuid("goal_id")
    .notNull()
    .references(() => goals.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 160 }).notNull(),
  targetValue: integer("target_value").notNull(),
  reachedAt: timestamp("reached_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emailSubscribers = pgTable("email_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 160 }),
  source: varchar("source", { length: 80 }).notNull().default("website"),
  status: subscriberStatusEnum("status").notNull().default("active"),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type SocialChannel = typeof socialChannels.$inferSelect;
export type SocialMetricSnapshot = typeof socialMetricSnapshots.$inferSelect;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type GoalPlatform = (typeof goalPlatformEnum.enumValues)[number];
