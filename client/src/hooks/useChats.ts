import { getChatsByUserId } from "@/http/chatController";
import { useQuery } from "@tanstack/react-query";

const useChats = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [`chats-${userId}`],
    queryFn: () => getChatsByUserId(userId),
  });
};

export default useChats;
