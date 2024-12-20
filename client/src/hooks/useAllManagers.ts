import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAllManagers } from '@/http/userController';

const useAllManagers = (page: number) => {
  return useQuery({
    queryKey: [`all-managers`, page],
    queryFn: () => getAllManagers(page),
    placeholderData: keepPreviousData,
  });
};

export default useAllManagers;
