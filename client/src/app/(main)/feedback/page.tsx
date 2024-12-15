import ReviewForm from "@/components/ReviewForm/ReviewForm";

export default function Feedback({ searchParams }: any) {
  const productId = searchParams.productId;
  const sellerId = searchParams.sellerId;

  return <ReviewForm productId={productId} sellerId={sellerId} />;
}
