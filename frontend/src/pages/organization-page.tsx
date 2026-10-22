import CreateOrganizationButton from "@/components/common/create-organization-button";
import OrganizationSelect from "@/components/common/organization-select";
import OrganizationTabs from "@/components/common/organization-tabs";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router";

export default function OrganizationPage() {
  const session = authClient.useSession();

  if (!session) {
    return <Navigate to={"/auth/login"} replace />;
  }
  return (
    <div className="container mx-auto my-6 px-4">
      <Link to={"/"} className="inline-flex items-center mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </Link>

      <div className="flex items-center mb-8 gap-2">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>

      <OrganizationTabs />
    </div>
  );
}
