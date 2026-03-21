import { apiClient } from "@/services/api/apiClient";
import { ApiResponseType } from "@/types/api.types";

export const getConversation = (senderId: string, receiverId: string): Promise<ApiResponseType> => {
  return apiClient.post("/api/messages/conversation", {
    senderId,
    receiverId,
  });
};

export const reactToMessage = (messageId: string, reaction: string): Promise<ApiResponseType> => {
  return apiClient.post(`/api/messages/react/${messageId}`, {
    reaction,
  });
};

export default {
  getConversation,
  reactToMessage,
};
