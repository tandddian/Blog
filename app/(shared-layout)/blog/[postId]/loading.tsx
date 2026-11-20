import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoadingPage() {
  return (
    <div className="max-w-3xl mx-auto py-3">
      <Link
        href={"/blog"}
        className={buttonVariants({ variant: "ghost", className: "mb-4" })}
      >
        <ArrowLeft />
        Back to blog
      </Link>
      <div className="w-full h-100 mb-8 rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="space-y-4 flex flex-col">
        <Skeleton className=" h-10 w-full" />
        <Skeleton className=" h-5  w-full" />
      </div>
      <Separator className="my-8" />

      <Skeleton className="h-8  w-full" />

      <Separator className="my-8" />

      <div className="w-full h-50 mb-8 rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
