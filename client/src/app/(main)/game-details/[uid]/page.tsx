import FilterComponent from '@/components/Filters/FilterComponent';

import GamePage from '@/all-pages/GamePage/GamePage';

export default function GameDetailsPage({ searchParams }: any) {
  const gameId = searchParams.id;
  const type = searchParams.type;
  return (
    <>
      <FilterComponent gameId={gameId} productType={type} />
      <GamePage gameId={gameId} type={type} />
    </>
  );
}
