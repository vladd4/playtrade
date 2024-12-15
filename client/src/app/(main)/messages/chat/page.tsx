import ChatPage from "@/all-pages/ChatPage/ChatPage";

export default function Chat({ searchParams }: any) {
  const chatId = searchParams.chatId;
  return <ChatPage chatId={chatId} />;
}
