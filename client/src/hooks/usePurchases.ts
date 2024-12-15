import { getUserPurchases } from "@/http/userController";
import { useQuery } from "@tanstack/react-query";

const usePurchases = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [`user-${id} purchases`],
    queryFn: () => getUserPurchases(id),
  });
};

export default usePurchases;
