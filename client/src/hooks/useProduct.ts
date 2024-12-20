import { useQuery } from '@tanstack/react-query';

import { getProductById } from '@/http/productController';

const useProduct = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`product-${id}`],
    queryFn: () => getProductById(id),
  });
};

export default useProduct;
