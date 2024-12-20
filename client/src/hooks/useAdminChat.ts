import { useQuery } from '@tanstack/react-query';

import { getChatByChatId } from '@/http/chatController';

const useAdminChat = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`chat-${id}`],
    queryFn: () => getChatByChatId(id),
  });
};

export default useAdminChat;
