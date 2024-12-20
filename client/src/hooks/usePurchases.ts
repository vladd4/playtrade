import { useQuery } from '@tanstack/react-query';

import { getUserPurchases } from '@/http/userController';

const usePurchases = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`user-${id} purchases`],
    queryFn: () => getUserPurchases(id),
  });
};

export default usePurchases;
