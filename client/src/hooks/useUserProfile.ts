import { getUserById } from "@/http/userController";
import { useQuery } from "@tanstack/react-query";

const useUserProfile = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`user-${id}`],
    queryFn: () => getUserById(id),
  });
};

export default useUserProfile;
