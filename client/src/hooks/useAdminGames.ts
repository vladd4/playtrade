import { getGames } from "@/http/gameController";
import { useQuery } from "@tanstack/react-query";

const useAdmingames = () => {
  return useQuery({
    queryKey: ["all-games"],
    queryFn: getGames,
  });
};

export default useAdmingames;
