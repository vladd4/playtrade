import { useQuery } from '@tanstack/react-query';

import { getAllAdminChats } from '@/http/chatController';

const useAdminChats = ({ page }: { page: number }) => {
  return useQuery({
    queryKey: [`admin-chats`, page],
    queryFn: () => getAllAdminChats(page),
  });
};

export default useAdminChats;
