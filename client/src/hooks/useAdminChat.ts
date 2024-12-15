import { getChatByChatId } from "@/http/chatController";
import { useQuery } from "@tanstack/react-query";

const useAdminChat = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`chat-${id}`],
    queryFn: () => getChatByChatId(id),
  });
};

export default useAdminChat;
