import type { Icon } from "@phosphor-icons/react";
import { GithubLogoIcon } from "@phosphor-icons/react";

export const SUPPORTED_OAUTH_PROVIDERS = ["github"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOAuthProvider,
  {
    name: string;
    Icon: Icon;
  }
> = {
  github: {
    name: "GitHub",
    Icon: GithubLogoIcon,
  },
};
