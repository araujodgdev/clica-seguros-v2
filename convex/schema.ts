import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    externalId: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
    onboardingCompleted: v.optional(v.boolean()),
  }).index("by_externalId", ["externalId"])
});