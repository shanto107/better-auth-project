import SignInTab from "@/components/common/sign-in-tab";
import SignUpTab from "@/components/common/sign-up-tab";
import SocialAuthButtons from "@/components/common/social-auth-buttons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/", { replace: true });
    }
  }, [session, isPending, navigate]);

  if(isPending || session) {
    return null;
  }

  return (
    <Tabs defaultValue={"signin"} className={"mx-auto w-full my-6 px-4"}>
      <TabsList>
        <TabsTrigger value={"signin"}>Sign In</TabsTrigger>
        <TabsTrigger value={"signup"}>Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value={"signin"}>
        <Card className="w-full">
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab />
          </CardContent>

          <CardFooter>
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value={"signup"}>
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab />
          </CardContent>

          <CardFooter>
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
