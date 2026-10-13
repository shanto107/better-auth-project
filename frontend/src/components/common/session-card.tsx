import type { Session } from "better-auth";
import { UAParser } from "ua-parser-js";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { authClient } from "@/lib/auth-client";

export type SessionCardType = {
  session: Session;
  isCurrentSession: boolean;
};
export default function SessionCard({
  session,
  isCurrentSession,
}: SessionCardType) {
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardHeader className="flex-1 px-0">
          {getBrowserInformation()}
        </CardHeader>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeSession}
              successMessage="Session revoked"
            >
              <Trash2 />
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
