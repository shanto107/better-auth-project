import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { Checkbox } from "../ui/checkbox";

export type User = {
  name: string;
  email: string;
  favoriteNumber?: number;
};

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  async function handlePasswordChange(data: ChangePasswordForm) {
    await authClient.changePassword(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to change password.");
      },
      onSuccess: () => {
        toast.success("Password changed successfully.");
        form.reset();
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(handlePasswordChange)}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <PasswordInput {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <PasswordInput {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="revokeOtherSessions"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex w-fit flex-row items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="size-4! shrink-0"
              />
              <FieldLabel
                htmlFor="revokeOtherSessions"
                className="w-auto whitespace-nowrap"
              >
                Log out other sessions
              </FieldLabel>
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
          Change Password
        </LoadingSwap>
      </Button>
    </form>
  );
}
