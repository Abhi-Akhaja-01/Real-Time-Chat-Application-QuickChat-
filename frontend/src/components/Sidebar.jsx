import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, MoreVertical, MessageSquarePlus, CircleDashed } from "lucide-react";
import Avatar from "./Avatar";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Exclude self from the main list usually in WhatsApp, but keeping as requested
  const allUsersWithSelf = authUser ? [authUser, ...users.filter(u => u._id !== authUser._id)] : [];

  const filteredUsers = showOnlineOnly
    ? allUsersWithSelf.filter((user) => onlineUsers.includes(user._id))
    : allUsersWithSelf;

  if (isUsersLoading) return (
    <aside className="h-full w-full flex flex-col bg-base-100">
      <div className="flex items-center justify-center h-full"><span className="loading loading-spinner"></span></div>
    </aside>
  );

  return (
    <aside className="h-full w-full flex flex-col bg-base-100">
      {/* WhatsApp Sidebar Header */}
      <div className="bg-base-200 px-4 py-3 flex items-center justify-between border-b border-base-300">
        <div className="cursor-pointer">
          {authUser && <Avatar user={authUser} size="size-10" />}
        </div>
        <div className="flex items-center gap-4 text-base-content/60">
          <CircleDashed className="size-5 hover:text-base-content cursor-pointer transition-colors" />
          <MessageSquarePlus className="size-5 hover:text-base-content cursor-pointer transition-colors" />
          <MoreVertical className="size-5 hover:text-base-content cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Search Bar Placeholder */}
      <div className="p-2 border-b border-base-300">
        <div className="bg-base-200 rounded-lg p-1.5 flex items-center px-3">
          <span className="text-sm text-base-content/60 w-full text-center py-1">Search or start new chat</span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-200 transition-colors border-b border-base-200/50
              ${selectedUser?._id === user._id ? "bg-base-200/80" : ""}
            `}
          >
            <div className="relative flex-shrink-0">
              <Avatar user={user} size="size-12" />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-base-100" />
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="font-medium truncate text-base-content">
                  {user.fullName} {user._id === authUser?._id && "(You)"}
                </div>
                <div className="text-xs text-base-content/50">
                   {onlineUsers.includes(user._id) ? "Online" : ""}
                </div>
              </div>
              <div className="text-sm text-base-content/60 truncate">
                 Hey there! I am using WhatsApp.
              </div>
            </div>

            {(unreadCounts && unreadCounts[user._id] > 0) && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <span className="bg-[#25D366] text-white font-bold text-xs size-5 rounded-full flex items-center justify-center">
                  {unreadCounts[user._id]}
                </span>
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-10">No chats available</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
