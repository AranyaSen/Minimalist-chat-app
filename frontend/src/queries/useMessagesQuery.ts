import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/services/messageService";
import { MessageType } from "@/hooks/useChatSocket.types";

export const useMessagesQuery = (chatId: string) => {
  return useQuery<MessageType[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await getMessages(chatId);
      return res.data as MessageType[];
    },
    enabled: !!chatId,
  });
};
