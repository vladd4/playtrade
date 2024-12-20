import { useQuery } from '@tanstack/react-query';

import { getGames } from '@/http/gameController';

const useAdmingames = () => {
  return useQuery({
    queryKey: ['all-games'],
    queryFn: getGames,
  });
};

export default useAdmingames;
