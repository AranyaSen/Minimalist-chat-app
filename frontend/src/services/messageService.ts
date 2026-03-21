import apiClient from "@/utils/apiClient";

export const getConversation = (senderId: string, receiverId: string) => {
  return apiClient.post("/api/messages/conversation", {
    senderId,
    receiverId,
  });
};

export const reactToMessage = (messageId: string, reaction: string) => {
  return apiClient.post(`/api/messages/react/${messageId}`, {
    reaction,
  });
};

export default {
  getConversation,
  reactToMessage,
};
