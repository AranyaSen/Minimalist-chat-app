import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { User as UserIcon, Search, MessageCircle, Users } from "lucide-react";
import Nav from "@/components/Nav/Nav";
import Texting from "@/components/Texting/Texting";
import { useDebounce } from "@/hooks/useDebounce";
import { useConversationsQuery } from "@/queries/useConversationsQuery";
import { ConversationsLoader } from "@/components/ConversationsLoader/ConversationsLoader";
import { initiateDirectChat } from "@/services/userService/userService";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchUsersQuery } from "@/queries/useSearchUsersQuery";
import { AllUsersModal } from "@/components/AllUsersModal/AllUsersModal";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getImageSrc, getOtherUser } from "@/utils/chatUtils";

export const ChatPage = () => {
  const { user: currentUser } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Initialize socket connection
  useChatSocket(currentUser?.id || "");

  // Base list of existing conversations
  const { data: conversationList = [], isLoading: isConversationsLoading } =
    useConversationsQuery();

  // Search results for users
  const { data: searchedUsers = [], isLoading: isSearchLoading } =
    useSearchUsersQuery(debouncedSearch);

  const isSearching = !!debouncedSearch;
  const showLoading =
    (!isSearching && isConversationsLoading) ||
    (isSearching && isSearchLoading) ||
    searchQuery !== debouncedSearch;

  const handleUserSelect = async (userId: string) => {
    try {
      const res = await initiateDirectChat(userId);
      if (res.success) {
        const chatId = res.data._id;
        const otherUser = res.data.participants?.find((p: { user: { _id: string } | string }) => {
          const uid = typeof p.user === "string" ? p.user : p.user._id;
          return uid !== currentUser?.id;
        });
        const receiverId =
          typeof otherUser?.user === "string" ? otherUser.user : otherUser?.user?._id || userId;

        setSelectedChatId(chatId);
        setSelectedReceiverId(receiverId);

        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        setSearchQuery("");
        setShowAllUsers(false);
      }
    } catch (err) {
      console.error("Failed to initiate chat:", err);
    }
  };

  return (
    <div className="h-screen bg-primary flex flex-col overflow-hidden">
      <Nav />

      <main className="flex-1 pt-32 md:pt-28 pb-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex gap-6 overflow-hidden">
        {/* Sidebar: Conversation List */}
        <aside
          className={`w-full md:w-80 lg:w-96 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 ${selectedChatId ? "hidden md:flex" : "flex"}`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
              Messages
              <button
                onClick={() => setShowAllUsers(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-full transition-all text-sm font-medium"
              >
                <Users size={16} />
                <span>Find Users</span>
              </button>
            </h2>
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-secondary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            {showLoading ? (
              <ConversationsLoader />
            ) : isSearching ? (
              searchedUsers.length > 0 ? (
                searchedUsers.map((user) => {
                  const imageSrc = getImageSrc(user);
                  return (
                    <div
                      key={user._id}
                      onClick={() => handleUserSelect(user._id)}
                      className="flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 group hover:bg-white/5"
                    >
                      {/* Avatar */}
                      <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-2 border-secondary/20 group-hover:border-secondary/50 transition-colors">
                        {imageSrc ? (
                          <img
                            className="w-full h-full object-cover"
                            src={imageSrc}
                            alt={user.fullName}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                            <UserIcon className="text-secondary" size={24} />
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate text-white">{user.fullName}</h3>
                        <p className="text-xs truncate text-gray-400">@{user.username}</p>
                        <p className="text-xs mt-1 truncate flex items-center gap-1 text-gray-500">
                          <MessageCircle size={12} />
                          <span className="italic">Click to start chat</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500 opacity-60">
                  <Search size={32} className="mb-2" />
                  <p className="text-sm">No users found</p>
                </div>
              )
            ) : conversationList.length > 0 ? (
              conversationList.map((conversation) => {
                const otherUser = getOtherUser(conversation, currentUser?.id || "");
                const isSelected = selectedChatId === conversation._id;
                const imageSrc = otherUser ? getImageSrc(otherUser) : null;

                return (
                  <div
                    key={conversation._id}
                    onClick={() => otherUser && handleUserSelect(otherUser._id)}
                    className={`flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 group ${
                      isSelected
                        ? "bg-secondary text-primary shadow-lg shadow-secondary/20"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-2 transition-colors ${
                        isSelected
                          ? "border-primary/20"
                          : "border-secondary/20 group-hover:border-secondary/50"
                      }`}
                    >
                      {imageSrc ? (
                        <img
                          className="w-full h-full object-cover"
                          src={imageSrc}
                          alt={otherUser?.fullName}
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            isSelected ? "bg-primary/10" : "bg-secondary/10"
                          }`}
                        >
                          <UserIcon
                            className={isSelected ? "text-primary/70" : "text-secondary"}
                            size={24}
                          />
                        </div>
                      )}
                    </div>

                    {/* User Info & Last Message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3
                          className={`font-bold truncate ${
                            isSelected ? "text-primary" : "text-white"
                          }`}
                        >
                          {otherUser?.fullName || "Unknown User"}
                        </h3>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          isSelected ? "text-primary/70" : "text-gray-400"
                        }`}
                      >
                        @{otherUser?.username || "unknown"}
                      </p>
                      <p
                        className={`text-xs mt-1 truncate flex items-center gap-1 ${
                          isSelected ? "text-primary/60" : "text-gray-500"
                        }`}
                      >
                        {conversation.lastMessage?.content ? (
                          conversation.lastMessage.content
                        ) : (
                          <>
                            <MessageCircle size={12} />
                            <span className="italic">Start a conversation</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500 opacity-60">
                <Search size={32} className="mb-2" />
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </aside>

        <section
          className={`flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all duration-300 ${!selectedChatId ? "hidden md:flex" : "flex"}`}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <Texting
            chatId={selectedChatId || ""}
            receiverId={selectedReceiverId || ""}
            onBack={() => {
              setSelectedChatId(null);
              setSelectedReceiverId(null);
            }}
          />
        </section>
      </main>

      {/* All Users Modal */}
      {showAllUsers && (
        <AllUsersModal onClose={() => setShowAllUsers(false)} onUserSelect={handleUserSelect} />
      )}
    </div>
  );
};
