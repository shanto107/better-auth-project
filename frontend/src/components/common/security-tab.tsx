import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SetPasswordButton } from "./set-password-button";
import ChangePasswordForm from "./change-password-form";
import { Badge } from "../ui/badge";
import TwoFactorAuthSection from "./two-factor-auth-section";

type SecurityTabProps = {
  email: string;
  isTwoFactorEnabled: boolean;
};

export default async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: SecurityTabProps) {
  const [hasPasswordAccount, setHasPasswordAccount] = useState(false);

  useEffect(() => {
    authClient.listAccounts().then(({ data: accounts }) => {
      setHasPasswordAccount(
        accounts?.some((account) => account.providerId === "credential") ??
          false,
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Two Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuthSection isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
