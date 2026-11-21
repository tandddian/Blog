"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { commentSchema } from "@/app/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Id } from "@/convex/_generated/dataModel";
import z from "zod";
import { useTransition } from "react";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection(props: {
  postId: Id<"posts">;
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPost>;
}) {
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: props.postId,
      body: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);

  const comments = usePreloadedQuery(props.preloadedComments);

  function onSubmit(value: z.infer<typeof commentSchema>) {
    startTransition(async function () {
      try {
        await createComment(value);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create comment");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments?.length} comment(s)</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="gap-y-4">
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Comment</FieldLabel>
                  <Textarea
                    aria-invalid={fieldState.invalid}
                    placeholder="comment"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Send</span>
              )}
            </Button>
          </FieldGroup>
        </form>

        <Separator className="my-8" />

        {comments?.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={`https://avatar.vercel.sh/${comment.authorName}`}
                alt={comment.authorName}
              />
              <AvatarFallback>
                {comment.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{comment.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment._creationTime).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {comment.body}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
