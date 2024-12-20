import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers } from '@/http/userController';

const useAllUsers = (page: number) => {
  return useQuery({
    queryKey: [`all-users`, page],
    queryFn: () => getUsers(page),
    placeholderData: keepPreviousData,
  });
};

export default useAllUsers;
