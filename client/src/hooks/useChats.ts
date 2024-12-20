import { useQuery } from '@tanstack/react-query';

import { getChatsByUserId } from '@/http/chatController';

const useChats = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [`chats-${userId}`],
    queryFn: () => getChatsByUserId(userId),
  });
};

export default useChats;
