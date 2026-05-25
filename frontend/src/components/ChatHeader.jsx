import { Search, MoreVertical, ArrowLeft, Video, Phone } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="bg-base-200 px-4 py-3 flex items-center justify-between border-b border-base-300">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <button className="md:hidden" onClick={() => setSelectedUser(null)}>
          <ArrowLeft className="size-5 text-base-content/60" />
        </button>

        {/* Avatar */}
        <div className="cursor-pointer">
          <Avatar user={selectedUser} size="size-10" />
        </div>

        {/* User info */}
        <div className="cursor-pointer">
          <h3 className="font-medium text-base-content">{selectedUser.fullName}</h3>
          {onlineUsers.includes(selectedUser._id) && (
            <p className="text-xs text-base-content/60">online</p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 text-base-content/60">
        <Video className="size-5 hover:text-base-content cursor-pointer transition-colors" />
        <Phone className="size-5 hover:text-base-content cursor-pointer transition-colors" />
        <Search className="size-5 hover:text-base-content cursor-pointer transition-colors hidden sm:block" />
        <MoreVertical className="size-5 hover:text-base-content cursor-pointer transition-colors" />
      </div>
    </div>
  );
};
export default ChatHeader;
