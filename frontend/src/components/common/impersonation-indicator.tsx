import { UserX } from "lucide-react";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export function ImpersonationIndicator() {
  const navigate = useNavigate();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <BetterAuthActionButton
        action={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              navigate("/admin");
              refetch();
            },
          })
        }
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />
      </BetterAuthActionButton>
    </div>
  );
}
