import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { io } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: PostIdRouteProps) {
  await io();
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return {
      title: "Blog is not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}
interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export default async function PostIdPage({ params }: PostIdRouteProps) {
    await io();
  const { postId } = await params;
  const token = await getToken();
  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPost, { postId: postId }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if (!userId) return redirect("/auth/sign-in")

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 p-20">
          No post found
        </h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-3">
      <Link
        href={"/blog"}
        className={buttonVariants({ variant: "ghost", className: "mb-4" })}
      >
        <ArrowLeft />
        Back to blog
      </Link>
      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? "https://placecats.com/300/200"}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("zh-CN")}
          </p>
          {userId ? <PostPresence roomId={postId} userId={userId} /> : null}
        </div>
      </div>
      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="my-8" />
      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}

