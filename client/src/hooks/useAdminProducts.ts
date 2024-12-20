import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getProducts } from '@/http/productController';

const useAdminProducts = (page: number) => {
  return useQuery({
    queryKey: [`all-products`, page],
    queryFn: () => getProducts(page),
    placeholderData: keepPreviousData,
  });
};

export default useAdminProducts;
