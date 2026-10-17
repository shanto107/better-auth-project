import type { UserWithRole } from "better-auth/client/plugins";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function UserRow({
  user,
  selfId,
}: {
  user: UserWithRole;
  selfId: string;
}) {
  const isSelf = user.id === selfId;
  const navigate = useNavigate();
  const { refetch } = authClient.useSession();

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      {
        userId,
      },
      {
        onError: (error) => {
          toast.error(
            `Error impersonating user: ${error.error.message || "Failed to impersonate user."}`,
          );
        },
        onSuccess: () => {
          refetch();
          navigate("/");
        },
      },
    );
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      {
        userId,
      },
      {
        onError: (error) => {
          toast.error(
            `Error revoking user sessions: ${error.error.message || "Failed to revoke user sessions."}`,
          );
        },
        onSuccess: () => {
          toast(`All sessions of User ${user.name} is revoked!`);
        },
      },
    );
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser(
      {
        userId,
      },
      {
        onError: (error) => {
          toast.error(
            `Error unbanning user: ${error.error.message || "Failed to unban user"}`,
          );
        },
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser(
      {
        userId,
      },
      {
        onError: (error) => {
          toast.error(
            `Error banning user: ${error.error.message || "Failed to ban user"}`,
          );
        },
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  }

  function handleRemoveUser(userId: string) {
    authClient.admin.removeUser(
      {
        userId,
      },
      {
        onError: (error) => {
          toast.error(
            `Error removing user: ${error.error.message || "Failed to remove user"}`,
          );
        },
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "No name"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            {!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />{" "}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger
                  render={
                    <DropdownMenuItem variant="destructive">
                      Delete User
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
