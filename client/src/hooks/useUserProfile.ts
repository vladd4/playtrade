import { useQuery } from '@tanstack/react-query';

import { getUserById } from '@/http/userController';

const useUserProfile = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`user-${id}`],
    queryFn: () => getUserById(id),
  });
};

export default useUserProfile;
