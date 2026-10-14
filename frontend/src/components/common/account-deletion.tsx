import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export default function AccountDeletion() {
  return (
    <BetterAuthActionButton
      variant={"destructive"}
      className={"w-full"}
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => {
        return authClient.deleteUser({
          callbackURL: "http://localhost:5173/",
        });
      }}
      requireAreYouSure
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
