import { useQuery } from '@tanstack/react-query';

import { getSupportChatByChatId } from '@/http/supportController';

const useSupportChat = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`support-chat-${id}`],
    queryFn: () => getSupportChatByChatId(id),
  });
};

export default useSupportChat;
