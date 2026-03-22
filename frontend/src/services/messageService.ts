import { apiClient } from "@/services/api/apiClient";
import { ApiResponseType } from "@/types/api.types";

export const getMessages = (chatId: string): Promise<ApiResponseType> => {
  return apiClient.get(`/api/message/conversation/${chatId}`);
};

export const sendMessage = (
  chatId: string,
  content: string,
  receiverId: string
): Promise<ApiResponseType> => {
  return apiClient.post("/api/message/send", {
    chatId,
    content,
    receiverId,
  });
};

export const reactToMessage = (
  messageId: string,
  reaction: string
): Promise<ApiResponseType> => {
  return apiClient.post(`/api/message/react/${messageId}`, {
    reaction,
  });
};
