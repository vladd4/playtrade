import { useQuery } from '@tanstack/react-query';

import { getAllSupportChats } from '@/http/supportController';

const useSupportChats = ({ page }: { page: number }) => {
  return useQuery({
    queryKey: [`support-chats`, page],
    queryFn: () => getAllSupportChats(page),
  });
};

export default useSupportChats;
