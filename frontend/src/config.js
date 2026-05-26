export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://real-time-chat-application-quickchat.onrender.com";
