import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

type SetPasswordButtonProps = {
  email: string;
};

export function SetPasswordButton({ email }: SetPasswordButtonProps) {
  return (
    <BetterAuthActionButton
      variant={"outline"}
      successMessage="Password reset email sent. Please Check"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "http://localhost:5173/auth/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </BetterAuthActionButton>
  );
}
