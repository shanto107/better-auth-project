import UserRow from "@/components/common/user-row";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Users } from "lucide-react";
import { Link, Navigate } from "react-router";

export default function AdminPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { users, total, hasAdminPermission, isPending, error } =
    useAdminUsers();

  if (isSessionPending || (session && isPending)) {
    return <p>Loading ...</p>;
  }
  if (session == null) {
    return <Navigate to={"/auth/login"} replace />;
  }
  if (!hasAdminPermission) {
    return <Navigate to={"/"} replace />;
  }

  if (error) return <p role="alert">{error}</p>;

  return (
    <div className="mx-auto container my-6 px-4">
      <Link to="/" className="inline-flex items-center mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({total})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <UserRow key={user.id} user={user} selfId={session.user.id} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
