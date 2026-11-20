import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheLife, cacheTag } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Nextjs16",
  description: "Browse the latest posts and insights on the Next.js 16 blog.",
};

export default async function BlogPage() {
  
  return (
    <div className="w-full">
      <div className="px-12 text-center">
        <h1 className="font-bold text-4xl">Our Blog</h1>
        <p className="text-xl text-muted-foreground">Insight, thought</p>
      </div>
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>
    </div>
  );
}

async function BlogList() {
  // `fetchQuery` builds a ConvexHttpClient, whose logger calls Math.random().
  // With cacheComponents, that is unstable IO, so opt this part out of the prerender.
  "use cache";
  cacheLife("days")
  cacheTag("blog")
  const data = await fetchQuery(api.posts.getPosts);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {data.map((article) => (
        <Card key={article._id} className="pt-0">
          <div className="h-48 w-auto relative">
            <Image
              src={article.imageUrl ?? "https://placecats.com/300/200"}
              alt="image"
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardContent>
            <Link href={`/blog/${article._id}`}>
              <h1 className="font-bold text-xl">{article.title}</h1>
            </Link>
            <p className="line-clamp-3 text-muted-foreground">{article.body}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link
              href={`/blog/${article._id}`}
              className={buttonVariants({
                variant: "default",
                className: "w-full",
              })}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <div className="h-48 w-auto">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-2/3 " />
          </div>
        </div>
      ))}
    </div>
  );
}
