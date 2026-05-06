import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: [],
  unreadCounts: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, users, unreadCounts } = get();
      const isMessageSentFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;
      
      if (!isMessageSentFromSelectedUser) {
        const sender = users.find((u) => u._id === newMessage.senderId);
        toast.success(`New message from ${sender ? sender.fullName : "someone"}`);
        
        // Increment unread count for this user
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: (unreadCounts[newMessage.senderId] || 0) + 1,
          },
        });
        return;
      }

      set({
        messages: [...messages, newMessage],
      });
    });

    socket.off("typing");
    socket.on("typing", (userId) => {
      const { selectedUser, typingUsers } = get();
      if (selectedUser && userId === selectedUser._id) {
        set({ typingUsers: [...new Set([...typingUsers, userId])] });
      }
    });

    socket.off("stopTyping");
    socket.on("stopTyping", (userId) => {
      set({ typingUsers: get().typingUsers.filter((id) => id !== userId) });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
  },

  setSelectedUser: (selectedUser) => {
    const { unreadCounts } = get();
    set({ 
      selectedUser, 
      typingUsers: [],
      unreadCounts: {
        ...unreadCounts,
        [selectedUser?._id]: 0,
      }
    });
  },
}));
