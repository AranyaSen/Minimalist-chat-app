import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/services/userService/userService";

export const useConversationsQuery = (search?: string) => {
  return useQuery({
    queryKey: ["conversations", search],
    queryFn: () => getConversations(search),
    select: (data) => data.data,
  });
};
