import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Invitation = NonNullable<
  Awaited<ReturnType<typeof authClient.organization.getInvitation>>["data"]
>;

export default function InvitePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInvitation() {
      if (!id || !session) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const { data, error } = await authClient.organization.getInvitation({
          query: { id },
        });

        if (cancelled) return;

        if (error || !data) {
          setLoadError(error?.message ?? "Invitation not found or expired.");
          return;
        }

        setInvitation(data);
      } catch {
        if (!cancelled) {
          setLoadError("Unable to load this invitation.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadInvitation();

    return () => {
      cancelled = true;
    };
  }, [id, session]);

  async function handleInvitation(action: "accept" | "reject") {
    if (!id) return;

    setIsSubmitting(true);

    try {
      const result =
        action === "accept"
          ? await authClient.organization.acceptInvitation({
              invitationId: id,
            })
          : await authClient.organization.rejectInvitation({
              invitationId: id,
            });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success(
        action === "accept" ? "Invitation accepted!" : "Invitation rejected.",
      );

      window.location.assign("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSessionPending) {
    return <p className="p-6">Checking your session...</p>;
  }

  if (!session) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(
          window.location.pathname,
        )}`}
        replace
      />
    );
  }

  if (!id) {
    return <p className="p-6">Invalid invitation link.</p>;
  }

  if (isLoading) {
    return <p className="p-6">Loading invitation...</p>;
  }

  if (loadError || !invitation) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invitation unavailable</CardTitle>
            <CardDescription>
              {loadError ?? "This invitation could not be found."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-6 max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the{" "}
            <strong>{invitation.organizationName}</strong> organization as a{" "}
            <strong>{invitation.role}</strong>.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-3">
          <Button
            disabled={isSubmitting}
            onClick={() => void handleInvitation("accept")}
          >
            Accept invitation
          </Button>

          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => void handleInvitation("reject")}
          >
            Reject invitation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
