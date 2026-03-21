export interface ParticipantUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  image?: {
    data: {
      type: string;
      data: number[];
    };
    contentType: string;
  };
}

export interface Participant {
  user: ParticipantUser;
  role: string;
  _id: string;
  joinedAt: string;
}

export interface ConversationsListType {
  _id: string;
  type: string;
  participants: Participant[];
  lastMessage?: {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };
  updatedAt?: string;
}

export interface UsersProps {}
