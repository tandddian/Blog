import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";

export const getCommentsByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string()
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) throw new ConvexError('login pls')

    await ctx.db.insert('comments', {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name
    })
  },
})