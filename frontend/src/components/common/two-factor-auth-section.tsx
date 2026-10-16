import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import QRCodeVerify from "./QRCodeVerify";

const twoFactorAuthSchema = z.object({
  password: z.string().min(1),
});

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>;
export type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export default function TwoFactorAuthSection({
  isEnabled,
}: {
  isEnabled: boolean;
}) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const form = useForm<TwoFactorAuthForm>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      password: "",
    },
  });

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Failed to diable Two Factor Authentication.",
          );
        },
        onSuccess: () => {
          form.reset();
          window.location.reload();
        },
      },
    );
  }

  async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
    const result = await authClient.twoFactor.enable({
      password: data.password,
      method: "totp",
    });

    if (result.error) {
      toast.error(
        result.error.message || "Failed to enable Two Factor Authentication.",
      );
      return;
    }
    if (result.data.method !== "totp") {
      toast.error("Unexpected two-factor authentication method.");
      return;
    }
    setTwoFactorData(result.data);
    form.reset();
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(
        isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
      )}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput {...field} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={"w-full"}
        variant={isEnabled ? "destructive" : "default"}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          {isEnabled
            ? "Disable 2 Factor Authentication"
            : "Enable Two Factor Authentication"}
        </LoadingSwap>
      </Button>
    </form>
  );
}
