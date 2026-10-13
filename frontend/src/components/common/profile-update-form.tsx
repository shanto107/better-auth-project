import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { NumberInput } from "../ui/number-input";

export type User = {
  name: string;
  email: string;
  favoriteNumber?: number;
};

const profileUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  favoriteNumber: z.number().int(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdateForm({ user }: { user: User }) {
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  async function handleProfleUpdate(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        favoriteNumber: data.favoriteNumber,
      }),
    ];
    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "http://localhost:5173/profile",
        }),
      );
    }
    const res = await Promise.all(promises);
    const updateUserResult = res[0];
    const emailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(
        updateUserResult.error.message || "Failed to update profile.",
      );
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || "Failed to update email.");
    } else if (data.email !== user.email) {
      toast.success("Verify your new email address to complete the change.");
    } else {
      window.location.reload();
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleProfleUpdate)}
      className="space-y-4"
    >
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
          Update Profile
        </LoadingSwap>
      </Button>
    </form>
  );
}
