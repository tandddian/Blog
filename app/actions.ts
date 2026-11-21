"use server"

import z from "zod";
import { createPostActionSchema } from "./schemas/post";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

export async function createBlogAction(
  values: z.infer<typeof createPostActionSchema>,
) {
  try {
    const parsed = createPostActionSchema.safeParse(values);
    if (!parsed.success) {
      return { error: "Invalid post data" };
    }

    const token = await getToken();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: parsed.data.imageStorageId,
      },
      { token },
    );

  } catch {
    return { error: "Failed to create post" };
  }

  revalidatePath("/blog");
  return redirect("/blog");
}
