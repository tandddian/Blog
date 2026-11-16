"use client"
import { postSchema } from "@/app/schemas/post";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { createBlogAction } from "@/app/actions";

export default function CreateBlogPage() {
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined
    },
  });
  // const createPost = useMutation(api.posts.createPost);

  const [isPending, startTransition] = useTransition();

  function onSubmit(value: z.infer<typeof postSchema>) {
    startTransition(async function() {
      await createBlogAction({
        title: value.title,
        content: value.content,
        image: value.image
      });
    });
  }
  return (
    <div className="py-12">
      <div className="text-center mt-4 mb-12">
        <h1 className="text-4xl font-extrabold">Create blog</h1>
        <p className="text-xl text-muted-foreground mt-4">
          create you own blog...
        </p>
      </div>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
                <Controller
                control={form.control}
                name="image"
                render={({ field}) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input id="image" type="file" accept="image/*" onChange={e => field.onChange(e.target.files?.[0])}  />
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
                  <span>Create</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
