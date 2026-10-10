import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_RESEND_COOLDOWN_SECONDS = 10;

export default function EmailVerificationTab({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(
    DEFAULT_RESEND_COOLDOWN_SECONDS,
  );
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const deadline = useRef<number | undefined>(undefined);

  const startEmailVerificationCountdown = useCallback(
    (time = DEFAULT_RESEND_COOLDOWN_SECONDS) => {
      if (interval.current !== undefined) {
        clearInterval(interval.current);
      }

      deadline.current = Date.now() + time * 1000;
      setTimeToNextResend(time);

      interval.current = setInterval(() => {
        if (deadline.current === undefined) return;

        const remainingTime = Math.max(
          0,
          Math.ceil((deadline.current - Date.now()) / 1000),
        );

        setTimeToNextResend(remainingTime);

        if (remainingTime === 0) {
          clearInterval(interval.current);
          interval.current = undefined;
          deadline.current = undefined;
        }
      }, 250);
    },
    [],
  );

  useEffect(() => {
    startEmailVerificationCountdown();
    return () => {
      if (interval.current !== undefined) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    };
  }, [startEmailVerificationCountdown]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verfication link. Please check your email and click the
        link to verify your account.
      </p>

      <BetterAuthActionButton
        variant={"outline"}
        className={"w-full"}
        disabled={timeToNextResend > 0}
        action={async () => {
          const res = await authClient.sendVerificationEmail({
            email,
            callbackURL: "http://localhost:5173/",
          });
          if (res.error) {
            return {
              error: {
                message: res.error.message,
              },
            };
          }
          startEmailVerificationCountdown();
          return {
            error: null,
          };
        }}
        successMessage="Verification Email Sent!"
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </BetterAuthActionButton>
    </div>
  );
}
