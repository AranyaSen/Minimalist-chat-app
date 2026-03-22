import { useEffect, useRef } from "react";
import { User as UserIcon, MessageCircle, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAllUsersQuery } from "@/queries/useAllUsersQuery";
import { getImageSrc } from "@/utils/chatUtils";
import { AllUsersModalProps } from "./AllUsersModal.types";

export const AllUsersModal = ({ onClose, onUserSelect }: AllUsersModalProps) => {
  const { user: currentUser } = useAuthStore();

  // The query runs when this component mounts!
  const { data: allUsers = [], isLoading: isAllUsersLoading } = useAllUsersQuery();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden scale-in-center animate-zoom-in"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div>
            <h3 className="text-xl font-bold">Start a Conversation</h3>
            <p className="text-xs text-gray-400 mt-1">Select a user to begin chatting</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {isAllUsersLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Fetching registered users...</p>
            </div>
          ) : allUsers.filter((u: any) => u._id !== currentUser?.id).length > 0 ? (
            allUsers
              .filter((u: any) => u._id !== currentUser?.id)
              .map((user: any) => {
                const imageSrc = getImageSrc(user);
                return (
                  <div
                    key={user._id}
                    onClick={() => onUserSelect(user._id)}
                    className="flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 group hover:bg-white/10 border border-transparent hover:border-white/10"
                  >
                    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-2 border-secondary/20 group-hover:border-secondary/50 transition-colors shadow-lg">
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

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate text-white">{user.fullName}</h3>
                      <p className="text-xs truncate text-gray-500">@{user.username}</p>
                    </div>

                    <div className="p-2 rounded-xl bg-secondary/10 text-secondary opacity-0 group-hover:opacity-100 transition-all">
                      <MessageCircle size={18} />
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 opacity-60">
              <UserIcon size={40} className="mb-3" />
              <p className="text-sm">Only you are registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
