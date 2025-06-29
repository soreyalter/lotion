import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    // 在 Convex 中，每条记录都有一个唯一的 ID（类似于数据库中的主键）
    parentDocument: v.optional(v.id('documents')),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
  // 自定义两个二级索引
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocument']),
})

/**
 * Convex 的数据库默认只能通过主键来快速查找记录。
 * 如果你要根据其他字段做查询（如 userId, parentDocument），就需要定义 索引（index） ，否则：
 * - 查询会变得非常慢（全表扫描）
 * - 可能不能满足你的业务需求（比如并发或大数据量）
 */