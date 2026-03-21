export interface MessageType {
  _id: string;
  senderId:
    | string
    | {
        _id: string;
        fullName: string;
        username: string;
        email: string;
      };
  receiverId?: string;
  chatId: string;
  content: string;
  messageType: string;
  createdAt: string;
  updatedAt?: string;
  messageReaction?: { userId: string; type: string }[];
  isDeleted?: boolean;
}

export interface ReadReceiptPayload {
  chatId: string;
  userId: string;
  messageId: string;
  readAt: string;
}
