import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { COMMENT_BODY_MAX, COMMENT_BODY_MIN } from "@/convex/validation";

export const commentSchema = z.object({
  body: z.string().trim().min(COMMENT_BODY_MIN).max(COMMENT_BODY_MAX),
  postId: z.custom<Id<"posts">>(),
});
