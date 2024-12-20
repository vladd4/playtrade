import { useInfiniteQuery } from '@tanstack/react-query';

import { ProductType } from '@/utils/constants';

import { getProductsByGameId } from '@/http/productController';

interface useProductsProps {
  gameId: string;
  type: ProductType;
}

const useProducts = ({ gameId, type }: useProductsProps) => {
  return useInfiniteQuery({
    queryKey: [`products-${gameId}, type-${type}`],
    queryFn: ({ pageParam }) => getProductsByGameId(gameId, type, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage?.products.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    refetchOnWindowFocus: false,
  });
};

export default useProducts;
