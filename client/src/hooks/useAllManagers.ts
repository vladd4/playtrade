import { getAllManagers } from "@/http/userController";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useAllManagers = (page: number) => {
  return useQuery({
    queryKey: [`all-managers`, page],
    queryFn: () => getAllManagers(page),
    placeholderData: keepPreviousData,
  });
};

export default useAllManagers;
