import z from 'zod'
import { Id } from '@/convex/_generated/dataModel'

export const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(4),
  image: z.instanceof(File).optional(),
})

export const createPostActionSchema = postSchema.omit({ image: true }).extend({
  imageStorageId: z
    .custom<Id<'_storage'>>((value) => typeof value === 'string' && value.length > 0)
    .optional(),
})
