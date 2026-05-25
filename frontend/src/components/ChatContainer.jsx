import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { FileText } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-200">
        <ChatHeader />
        <div className="flex-1 flex justify-center items-center">
          <span className="loading loading-spinner"></span>
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-transparent">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.senderId === authUser?._id;
          return (
            <div
              key={message._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
            >
              <div 
                className={`flex flex-col relative max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-lg shadow-sm 
                  ${isMe 
                    ? "bg-[#dcf8c6] text-black dark:bg-[#005c4b] dark:text-white rounded-tr-none" 
                    : "bg-white text-black dark:bg-[#202c33] dark:text-white rounded-tl-none"
                  }`}
              >
                {/* Optional Tail Effect */}
                <div className={`absolute top-0 w-3 h-4 ${isMe ? "-right-2" : "-left-2"}`}>
                  <svg viewBox="0 0 8 13" width="8" height="13" className={`fill-current ${isMe ? "text-[#dcf8c6] dark:text-[#005c4b]" : "text-white dark:text-[#202c33]"}`}>
                    {isMe ? (
                      <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                    ) : (
                      <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                    )}
                  </svg>
                </div>

                {message.image && message.image.startsWith("data:application/pdf") ? (
                  <a
                    href={message.image}
                    download={`document-${message._id}.pdf`}
                    className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-md mb-1 hover:bg-black/10 transition-colors"
                  >
                    <FileText className="size-6 text-primary" />
                    <span className="text-sm font-medium">Document.pdf</span>
                  </a>
                ) : message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[250px] rounded-md mb-1 object-cover"
                  />
                )}
                
                <div className="flex flex-wrap items-end justify-between gap-2">
                  {message.text && (
                    <span className="text-[15px] leading-relaxed break-words">{message.text}</span>
                  )}
                  <div className={`text-[11px] leading-none whitespace-nowrap opacity-60 ${!message.text ? "ml-auto" : "ml-2 mt-2"}`}>
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
