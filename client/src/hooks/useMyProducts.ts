import { useQuery } from '@tanstack/react-query';

import { getMyProductsByUserId } from '@/http/productController';

const useMyProducts = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [`my-products-${userId}`],
    queryFn: () => getMyProductsByUserId(userId),
  });
};

export default useMyProducts;
