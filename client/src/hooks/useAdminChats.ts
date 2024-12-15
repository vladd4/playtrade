import { getAllAdminChats } from "@/http/chatController";
import { useQuery } from "@tanstack/react-query";

const useAdminChats = ({ page }: { page: number }) => {
  return useQuery({
    queryKey: [`admin-chats`, page],
    queryFn: () => getAllAdminChats(page),
  });
};

export default useAdminChats;
