import z from 'zod'
import { Id } from '@/convex/_generated/dataModel'
import { POST_BODY_MAX, POST_BODY_MIN, POST_TITLE_MAX } from '@/convex/validation'

export const postSchema = z.object({
  title: z.string().trim().min(1).max(POST_TITLE_MAX),
  content: z.string().trim().min(POST_BODY_MIN).max(POST_BODY_MAX),
  image: z.instanceof(File).optional(),
})

export const createPostActionSchema = postSchema.omit({ image: true }).extend({
  imageStorageId: z
    .custom<Id<'_storage'>>((value) => typeof value === 'string' && value.length > 0)
    .optional(),
})
