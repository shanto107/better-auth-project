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
import { useNavigate } from "react-router";

const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInTab({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const navigate = useNavigate();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }
          toast.error(
            error.error.message || "An error occurred during sign in.",
          );
        },
        onSuccess: () => {
          toast.success("Sign in successful!");
          navigate("/");
        },
      },
    );
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
    console.log("Form submitted:", data);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
      <FieldGroup>
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
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={"w-full"}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          Sign In
        </LoadingSwap>
      </Button>
    </form>
  );
}
