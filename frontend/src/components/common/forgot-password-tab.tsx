import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordTab({
  openSignInTab,
}: {
  openSignInTab: (email: string) => void;
}) {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSendPasswordResetEmail(data: ForgotPasswordForm) {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: "http://localhost:5173/auth/reset-password",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email.",
          );
        },
        onSuccess: () => {
          toast.success("Password reset email sent!");
        },
      },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSendPasswordResetEmail)}
      className="space-y-4"
    >
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
      </FieldGroup>

      <div className="flex gap-2">
        <Button type="button" variant={"outline"} onClick={() => openSignInTab}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={"flex-1"}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Send Reset Email
          </LoadingSwap>
        </Button>
      </div>
    </form>
  );
}
