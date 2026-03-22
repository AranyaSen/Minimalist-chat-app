import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/services/userService/userService";

export const useAllUsersQuery = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    select: (data) => data.data,
  });
};
