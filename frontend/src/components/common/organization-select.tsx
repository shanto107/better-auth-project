import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  function setActiveOrganization(organizationId: string | null) {
    if (!organizationId) return;

    authClient.organization.setActive(
      { organizationId },
      {
        onError: (error) => {
          toast.error(error.error.message ?? "Failed to switch organization!");
        },
      },
    );
  }

  organizations?.forEach((org) => {
    console.log({
      id: org.id,
      name: org.name,
    });
  });

  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {activeOrganization?.name ?? "Select an organization"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
