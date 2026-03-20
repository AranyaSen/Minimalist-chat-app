export interface Message {
  _id?: string;
  sender: string | { _id: string; username: string };
  receiver: string | { _id: string; username: string };
  message: string;
  timeStamp: string;
  messageReaction?: string;
}

export interface SocketPayload {
  senderId: string;
  receiverId: string;
  messageContent: string;
}

export interface ReactionPayload {
  messageId: string;
  reaction: string;
}
