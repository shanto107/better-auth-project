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

type SecurityTabProps = {
  email: string;
};

export default async function SecurityTab({ email }: SecurityTabProps) {
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
    </div>
  );
}
