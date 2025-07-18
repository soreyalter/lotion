import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export class NotFoundError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not anthenticated')
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }
    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // 递归地将所有子文档都归档
    const recursiveArchive = async (documentId: Id<'documents'>) => {

      // 查询传入 document id 文档的孩子文档
      const children = await ctx.db
        .query('documents')
        // withIndex 使用自定义的二级索引来查询，这里是 by_user_parent
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })
        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })
    await recursiveArchive(args.id)
    return document
  },
})

/** 查找未归档的文档列表 */
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument),
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    // 查找 documents 表中所有记录
    const document = await ctx.db.query('documents').collect()

    return document
  },
})

/** 创建一条新的文档记录 */
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject

    const documentId = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    return documentId
  },
})

/** 查询回收站（已归档）文档（archived documents） */
export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  },
})

/** 将已归档的 document 及其孩子恢复 */
export const restore = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) {
      throw new Error('Not found')
    }
    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })
        await recursiveRestore(child._id)
      }
    }

    // ts 类型体操 Partial 表示将传入的泛型类型转为可选
    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    }

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)
    await recursiveRestore(args.id)
    return document
  },
})

export const remove = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) {
      throw new Error('Not found')
    }
    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.delete(args.id)
    return document
  },
})

/** 查找未归档的文档 */
export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()
    return documents
  },
})

/** 根据文档 Id 查询文档详情 */
export const getById = query({
  args: {documentId: v.id("documents")},
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const document = await ctx.db.get(args.documentId)
    if (!document) {
      // 返回 null 而不是抛出错误，配合 delete 操作，防止其路由跳转失败报错
      return null
    }

    if (document.isPublished && !document.isArchived) {
      return document
    }

    if (!identity) {
      throw new Error('Not authenticated')
    }
    const userId = identity.subject
    if (document.userId !== userId) {
      throw new Error("Unauthorized")
    }
    return document
  }
})

/** 更新文档内容 */
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthenticated")
    }
    const userId = identity.subject

    const {id, ...rest } = args

    const existingDocument = await ctx.db.get(id)

    if (!existingDocument) {
      throw new Error("Not Found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(id, {...rest})
    return document
  }
})