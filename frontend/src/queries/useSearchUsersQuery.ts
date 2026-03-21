import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/services/userService/userService";

export const useSearchUsersQuery = (search?: string) => {
  return useQuery({
    queryKey: ["users", "search", search],
    queryFn: () => searchUsers(search || ""),
    enabled: !!search && search.trim().length > 0,
    select: (data) => data.data,
  });
};
