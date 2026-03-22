import { ConversationsListType, ParticipantUser } from "@/pages/ChatPage/Chat.types";

export const getImageSrc = (user: ParticipantUser): string | null => {
  if (!user.image?.data?.data || !user.image?.contentType) return null;
  const base64 = btoa(String.fromCharCode(...new Uint8Array(user.image.data.data)));
  return `data:${user.image.contentType};base64,${base64}`;
};

export const getOtherUser = (
  conversation: ConversationsListType,
  currentUserId: string
): ParticipantUser | null => {
  const otherParticipant = conversation.participants.find((p) => p.user._id !== currentUserId);
  return otherParticipant?.user || null;
};

export const getReceiverInfo = (
  chatId: string,
  receiverId: string,
  currentUserId: string,
  conversationList: ConversationsListType[],
  searchedUsers: ParticipantUser[]
) => {
  const userInList = conversationList.find((c) => c._id === chatId);
  const receiverUser = userInList
    ? getOtherUser(userInList, currentUserId)
    : (searchedUsers.find((u) => u._id === receiverId) as ParticipantUser | undefined);

  if (receiverUser) {
    return {
      name: receiverUser.fullName,
      image: getImageSrc(receiverUser),
    };
  }

  return {
    name: "Chat",
    image: null,
  };
};
