import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
} from "@/lib/oauth-providers";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export default function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].Icon;

    return (
      <BetterAuthActionButton
        variant={"outline"}
        key={provider}
        className={"w-full"}
        action={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: "http://localhost:5173/",
          });
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}
