"use client"
import { signInSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import z from "zod";

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    await authClient.signIn.email({
      email: data.email,
      password: data.password
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to get start.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">

            <Controller  control={form.control} name="email" render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="tandian@123.com" {...field} />
                {
                  fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)
                }
              </Field>
            )}/>

            <Controller  control={form.control} name="password" render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="******" {...field} />
                {
                  fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)
                }
              </Field>
            )}/>
          <Button type='submit'>Sign In</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
