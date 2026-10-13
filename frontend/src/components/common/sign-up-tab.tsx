import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { NumberInput } from "../ui/number-input";
// import { useNavigate } from "react-router";

const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  favoriteNumber: z.number().int(),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  // const navigate = useNavigate();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    const res = await authClient.signUp.email(
      { ...data, callbackURL: "http://localhost:5173/" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "An error occurred during sign up.",
          );
        },
        // onSuccess: () => {
        //   navigate("/");
        // },
      },
    );
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    // console.log("Form submitted:", data);
    if (res.error === null && !res.data.user.emailVerified) {
      openEmailVerificationTab(data.email);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" aria-invalid={!!fieldState.error} {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="favoriteNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="favoriteNumber">ID Number</FieldLabel>
              <NumberInput {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={"w-full"}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          Sign Up
        </LoadingSwap>
      </Button>
    </form>
  );
}
