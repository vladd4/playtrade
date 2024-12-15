import { getMyProductsByUserId } from "@/http/productController";
import { useQuery } from "@tanstack/react-query";

const useMyProducts = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: [`my-products-${userId}`],
    queryFn: () => getMyProductsByUserId(userId),
  });
};

export default useMyProducts;
