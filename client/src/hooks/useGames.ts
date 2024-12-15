import { getGames } from "@/http/gameController";
import { groupedGames } from "@/utils/groupGamesByLetter";
import { useQuery } from "@tanstack/react-query";

const useGames = () => {
  return useQuery({
    queryKey: ["games"],
    queryFn: getGames,
    select: (data) => groupedGames(data!),
  });
};

export default useGames;
