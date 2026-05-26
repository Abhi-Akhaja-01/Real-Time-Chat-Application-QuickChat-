import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    if (socket) {
      subscribeToMessages();
    }
    return () => {
      if (socket) unsubscribeFromMessages();
    };
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* Sidebar */}
            <div className={`w-full md:w-[300px] lg:w-[350px] h-full flex-shrink-0 border-r border-base-300 bg-base-100 ${selectedUser ? "hidden md:block" : "block"}`}>
              <Sidebar />
            </div>

            {/* Chat Area */}
            <div className={`flex-1 h-full flex flex-col relative ${!selectedUser ? "hidden md:flex" : "flex"}`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
