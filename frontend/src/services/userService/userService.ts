import { apiClient } from "@/services/api/apiClient";
import { ApiResponseType } from "@/types/api.types";

import {
  ConversationsListType,
  ParticipantUser,
} from "@/pages/ChatPage/Chat.types";

export const getConversations = (
  search?: string
): Promise<ApiResponseType<ConversationsListType[]>> => {
  const params = {
    search: search ? search : undefined,
  };
  return apiClient.get("/api/chat", { params });
};

export const initiateDirectChat = (
  receiverId: string
): Promise<ApiResponseType<ConversationsListType>> => {
  return apiClient.post("/api/chat", { receiverId });
};

export const searchUsers = (
  search: string
): Promise<ApiResponseType<ParticipantUser[]>> => {
  return apiClient.get("/api/user/search", { params: { search } });
};

export const getAllUsers = (): Promise<ApiResponseType<ParticipantUser[]>> => {
  return apiClient.get("/api/user");
};

export default {
  getConversations,
  initiateDirectChat,
  searchUsers,
  getAllUsers,
};
