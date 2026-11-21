import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { Doc } from "./_generated/dataModel";
import {
  POST_BODY_MAX,
  POST_BODY_MIN,
  POST_TITLE_MAX,
  SEARCH_LIMIT_MAX,
  requireText,
} from "./validation";


// Create a new task with the given text
export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      throw new ConvexError('Not authenticated')
    }
    const title = requireText(args.title, "Title", 1, POST_TITLE_MAX)
    const body = requireText(args.body, "Body", POST_BODY_MIN, POST_BODY_MAX)
    const newTaskId = await ctx.db.insert("posts", {
      title,
      body,
      authorId: user._id,
      imageStorageId: args.imageStorageId
    });
    return newTaskId;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .collect()
    return await Promise.all(
      posts.map(async (post) => {
        const imageUrl = post.imageStorageId
          ? await ctx.storage.getUrl(post.imageStorageId)
          : undefined
        return {
          ...post,
          imageUrl: imageUrl
        }
      })
    )
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      throw new ConvexError('Not authenticated')
    }
    return await ctx.storage.generateUploadUrl();
  }
})

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId)

    if (!post) return null

    const resolvedImageUrl = post?.imageStorageId ? await ctx.storage.getUrl(post?.imageStorageId) : null
    return {
      ...post,
      imageUrl: resolvedImageUrl
    }
  }
})


interface SearchResultTypes {
  _id: string;
  title: string;
  body: string;
}


export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const term = args.term.trim()
    if (!term) return []
    const limit = Math.min(Math.max(Math.floor(args.limit), 1), SEARCH_LIMIT_MAX)
    const results: Array<SearchResultTypes> = []
    const seen = new Set()

    const pushDocs = async (docs: Array<Doc<'posts'>>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue
        seen.add(doc._id)
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        })
        if (results.length >= limit) break
      }
    }

    const titleMatches = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search('title', term))
      .take(limit)

    await pushDocs(titleMatches)

    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query("posts")
        .withSearchIndex("search_body", (q) => q.search("body", term))
        .take(limit);

      await pushDocs(bodyMatches)

    }

    return results
  }
})
