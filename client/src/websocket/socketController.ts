import { socket } from "./socket";

export const sendMessage = (messageData: any) => {
  socket.emit("sendMessage", messageData);

  socket.on("error", (error) => {
    console.error("Failed to send message:", error);
  });
};

export const joinChat = (chatId: string) => {
  socket.emit("joinChat", { chatId });
};

export const getChatHistory = () => {
  socket.on("chatHistory", (messages) => {
    return messages;
  });
};
