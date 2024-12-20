import GameDetailPage from '@/all-pages/GameDetailPage/GameDetailPage';

export default function DetailsPage({ searchParams }: any) {
  const id = searchParams.id;
  return <GameDetailPage productId={id} />;
}
