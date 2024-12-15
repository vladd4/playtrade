import { getSupportChatByChatId } from "@/http/supportController";
import { useQuery } from "@tanstack/react-query";

const useSupportChat = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`support-chat-${id}`],
    queryFn: () => getSupportChatByChatId(id),
  });
};

export default useSupportChat;
