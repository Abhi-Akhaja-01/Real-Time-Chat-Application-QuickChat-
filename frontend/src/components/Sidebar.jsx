import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";
import Avatar from "./Avatar";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadCounts } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Make sure the authUser is always the first item so they can message themselves
  const allUsersWithSelf = [authUser, ...users.filter(u => u._id !== authUser._id)];

  const filteredUsers = showOnlineOnly
    ? allUsersWithSelf.filter((user) => onlineUsers.includes(user._id))
    : allUsersWithSelf;

  if (isUsersLoading) return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="flex items-center justify-center h-full"><span className="loading loading-spinner"></span></div>
    </aside>
  );

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <Avatar user={user} size="size-12" />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
              {/* Mobile unread badge */}
              {(unreadCounts[user._id] || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-zinc-900 font-bold text-[10px] size-4 rounded-full flex items-center justify-center lg:hidden animate-pulse">
                  {unreadCounts[user._id]}
                </span>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {user.fullName} {user._id === authUser._id && "(You)"}
              </div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {/* Desktop unread badge */}
            {(unreadCounts[user._id] || 0) > 0 && (
              <div className="hidden lg:flex items-center justify-center ml-auto">
                <span className="bg-green-500 text-zinc-900 font-bold text-xs size-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {unreadCounts[user._id]}
                </span>
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
