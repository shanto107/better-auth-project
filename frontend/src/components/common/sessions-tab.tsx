import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import type { Session } from "better-auth";
import SessionManagement from "./session-management";

export default function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    authClient.listSessions().then(({ data }) => {
      setSessions(data ?? []);
    });
  }, []);

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}
