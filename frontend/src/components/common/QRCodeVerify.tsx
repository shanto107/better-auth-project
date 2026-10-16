import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import type { TwoFactorData } from "./two-factor-auth-section";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import QRCode from "react-qr-code";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

const qrSchema = z.object({
  token: z.string().length(6),
});

type QrForm = z.infer<typeof qrSchema>;

type QRCodeVerifyType = TwoFactorData & {
  onDone: () => void;
};
export default function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: QRCodeVerifyType) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const form = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      token: "",
    },
  });

  function handleQRCode(data: QrForm) {
    return authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify code");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);
          toast.success("Two-factor authentication enabled!");
        },
      },
    );
  }

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Scan this QR code with your authenticator app and enter the code below:
      </p>
      <form onSubmit={form.handleSubmit(handleQRCode)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="token"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Code</FieldLabel>
                <Input {...field} />
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
            Submit Code
          </LoadingSwap>
        </Button>
      </form>
      <div className="p-4 bg-white w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
