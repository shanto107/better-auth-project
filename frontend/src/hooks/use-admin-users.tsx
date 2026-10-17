import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

type SortBy = "name" | "email" | "createdAt";
type SortDirection = "asc" | "desc";

type UseAdminUsersOptions = {
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  limit?: number;
  offset?: number;
};

export function useAdminUsers({
  sortBy = "createdAt",
  sortDirection = "desc",
  limit = 10,
  offset = 0,
}: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<
    Awaited<ReturnType<typeof fetchUsers>>["users"]
  >([]);
  const [total, setTotal] = useState(0);
  const [hasAdminPermission, setHasAdminPermission] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    const { data, error } = await authClient.admin.listUsers({
      query: { sortBy, sortDirection, limit, offset },
    });

    if (error) throw new Error(error.message);

    return data;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsPending(true);
      setError(null);

      try {
        const permission = await authClient.admin.hasPermission({
          permissions: { user: ["list"] },
        });

        if (permission.error || !permission.data?.success) {
          if (!cancelled) {
            setHasAdminPermission(false);
            setUsers([]);
            setTotal(0);
          }
          return;
        }

        if (!cancelled) setHasAdminPermission(true);

        const result = await fetchUsers();

        if (!cancelled) {
          setUsers(result.users);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (!cancelled) setIsPending(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [sortBy, sortDirection, limit, offset]);

  return { users, total, hasAdminPermission, isPending, error };
}
