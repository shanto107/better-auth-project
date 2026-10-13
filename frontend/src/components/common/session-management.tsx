import type { Session } from "better-auth";
import SessionCard from "./session-card";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { Card, CardContent } from "../ui/card";
import { authClient } from "@/lib/auth-client";

type SessionManagementType = {
  sessions: Session[];
  currentSessionToken: string;
};

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: SessionManagementType) {
  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken,
  );
  const currentSession = sessions.find(
    (session) => session.token === currentSessionToken,
  );

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        window.location.reload();
      }
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeOtherSessions}
            >
              Revoke Other Sessions
            </BetterAuthActionButton>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No other active sessions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isCurrentSession={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
