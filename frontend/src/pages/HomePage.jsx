import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <div className="h-screen w-full bg-[#e1e1de] dark:bg-[#0b141a] flex items-center justify-center sm:p-4 lg:p-8">
      {/* Container with max-width and shadow */}
      <div className="w-full h-full max-w-[1500px] bg-base-100 flex overflow-hidden shadow-2xl sm:rounded-lg border border-base-300">
        
        {/* Sidebar */}
        <div className={`w-full md:w-[350px] lg:w-[400px] h-full flex-shrink-0 border-r border-base-300 bg-base-100 ${selectedUser ? "hidden md:block" : "block"}`}>
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div className={`flex-1 h-full flex flex-col relative ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          {/* WhatsApp-like background pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundRepeat: 'repeat' }}>
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>

      </div>
    </div>
  );
};
export default HomePage;
