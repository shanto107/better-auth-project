import { BetterAuthActionButton } from "@/components/common/better-auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Link } from "react-router";

export default function HomePage() {
  const { data: session, isPending: loading } = authClient.useSession();

  if (loading) {
    return (
      <div className="my-6 px-4 max-w-md mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session ? (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}!</h1>
            <div className="flex gap-4 justify-center">
              <Button
                size={"lg"}
                className={"rounded-sm"}
                render={<Link to="/profile">Profile</Link>}
              />
              <BetterAuthActionButton
                size={"lg"}
                variant={"destructive"}
                className={"rounded-sm"}
                action={() => authClient.signOut()}
              >
                Sign Out
              </BetterAuthActionButton>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome to Our App</h1>
            <Button
              size={"lg"}
              className={"rounded-sm"}
              render={<Link to="/auth/login">Sign In/ Sign Up</Link>}
            />
          </>
        )}
      </div>
    </div>
  );
}
