import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getTransactions } from '@/http/transactionController';

const useAdminTransactions = (page: number) => {
  return useQuery({
    queryKey: [`all-transactions`, page],
    queryFn: () => getTransactions(page),
    placeholderData: keepPreviousData,
  });
};

export default useAdminTransactions;
