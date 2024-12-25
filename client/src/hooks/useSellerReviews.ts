import { useQuery } from '@tanstack/react-query';

import { getReviewsBySellerId } from '@/http/reviewController';

const useSellerReviews = ({ sellerId }: { sellerId: string }) => {
  return useQuery({
    queryKey: [`seller-${sellerId}-reviews`],
    queryFn: () => getReviewsBySellerId(sellerId),
  });
};

export default useSellerReviews;
