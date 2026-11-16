"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function BlogPage() {
  const data = useQuery(api.posts.getPosts);
  return (
    <div className="w-full">
      <div className="px-12 text-center">
        <h1 className="font-bold text-4xl">Our Blog</h1>
        <p className="text-xl text-muted-foreground">Insight, thought</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {data?.map((article) => (
          <Card key={article._id} className="pt-0">
            <div className="h-48 w-auto relative ">
              <Image
                src="https://placecats.com/300/200"
                alt="image"
                fill
                loading="eager"
              />
            </div>
            <CardContent>
              <Link href={`/blog/${article._id}`}>
                <h1 className="font-bold text-xl">{article.title}</h1>
              </Link>
              <p className="text-muted-foreground">{article.body}</p>
            </CardContent>
            <CardFooter>
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
    </div>
  );
}
