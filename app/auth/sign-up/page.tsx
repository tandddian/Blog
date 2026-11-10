"use client"
import { signUpSchema } from "@/app/schemas/auth";
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

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create a new account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Controller  control={form.control} name="name" render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input placeholder="tan dian" {...field} />
                {
                  fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)
                }
              </Field>
            )}/>

            <Controller  control={form.control} name="email" render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="tandian@123.com" {...field} />
                {
                  fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)
                }
              </Field>
            )}/>

            <Controller  control={form.control} name="password" render={({field, fieldState}) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input placeholder="******" {...field} />
                {
                  fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)
                }
              </Field>
            )}/>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
