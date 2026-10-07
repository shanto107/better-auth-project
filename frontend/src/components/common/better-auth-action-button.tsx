import type { ComponentProps } from "react";
import { ActionButton } from "../ui/action-button";

type BetterAuthActionButtonType = Omit<
  ComponentProps<typeof ActionButton>,
  "action"
> & {
  action: () => Promise<{ error: null | { message?: string } }>;
  successMessage?: string;
};

export function BetterAuthActionButton({
  action,
  successMessage,
  ...props
}: BetterAuthActionButtonType) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();
        if (res.error) {
          return {
            error: true,
            message: res.error.message || "Action Failed!",
          };
        } else {
          return {
            error: false,
            message: successMessage,
          };
        }
      }}
    />
  );
}
