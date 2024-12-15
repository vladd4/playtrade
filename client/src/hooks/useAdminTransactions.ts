import { getTransactions } from "@/http/transactionController";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useAdminTransactions = (page: number) => {
  return useQuery({
    queryKey: [`all-transactions`, page],
    queryFn: () => getTransactions(page),
    placeholderData: keepPreviousData,
  });
};

export default useAdminTransactions;
