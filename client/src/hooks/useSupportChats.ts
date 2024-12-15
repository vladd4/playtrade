import { getAllSupportChats } from "@/http/supportController";
import { useQuery } from "@tanstack/react-query";

const useSupportChats = ({ page }: { page: number }) => {
  return useQuery({
    queryKey: [`support-chats`, page],
    queryFn: () => getAllSupportChats(page),
  });
};

export default useSupportChats;
