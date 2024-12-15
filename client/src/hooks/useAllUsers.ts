import { getUsers } from "@/http/userController";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useAllUsers = (page: number) => {
  return useQuery({
    queryKey: [`all-users`, page],
    queryFn: () => getUsers(page),
    placeholderData: keepPreviousData,
  });
};

export default useAllUsers;
