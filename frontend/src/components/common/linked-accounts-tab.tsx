import { authClient } from "@/lib/auth-client";
import type { Account } from "better-auth";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import AccountLinking from "./account-linking";

export default function LinkedAccountsTab() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const nonCredentialAccounts = accounts.filter(
    (account) => account.providerId !== "credential",
  );

  useEffect(() => {
    authClient.listAccounts().then(({ data: accounts }) => {
      setAccounts(accounts ?? []);
    });
  }, []);

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}
