import { getProductById } from "@/http/productController";
import { useQuery } from "@tanstack/react-query";

const useProduct = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`product-${id}`],
    queryFn: () => getProductById(id),
  });
};

export default useProduct;
