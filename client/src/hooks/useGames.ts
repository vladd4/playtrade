import { useQuery } from '@tanstack/react-query';

import { groupedGames } from '@/utils/groupGamesByLetter';

import { getGames } from '@/http/gameController';

const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: getGames,
    select: (data) => groupedGames(data!),
  });
};

export default useGames;
