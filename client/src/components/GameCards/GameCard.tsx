'use client';

import styles from './GameCards.module.scss';

import { useRouter } from 'next/navigation';

import { formatImageFromServer } from '@/utils/formatImageName';
import { setToSessionStorage } from '@/utils/sessionStorage_helper';

import No_image from '@/../public/no-image.jpg';
import { mont } from '@/font';

type GameCardProps = {
  id: string;
  imageSrc: string;
  heading: string;
  description: string;
  servers?: string[];
  regions?: string[];
  platforms?: string[];
  isFullCard?: boolean;
};

export default function GameCard({
  id,
  imageSrc,
  heading,
  description,
  isFullCard,
  servers,
  regions,
  platforms,
}: GameCardProps) {
  const router = useRouter();

  const handleGameClick = () => {
    if (!isFullCard) {
      const gameId = id;

      const filters = {
        regions: regions ?? [],
        servers: servers ?? [],
        platforms: platforms ?? [],
      };

      router.push(`/game-details/game?id=${gameId}&type=item`);

      setToSessionStorage('game-filters', JSON.stringify(filters));
      setToSessionStorage(
        'product-game',
        JSON.stringify({
          heading,
          description,
          imageSrc,
          id,
        }),
      );
    }
  };

  return (
    <div
      className={`${styles.card_root} ${isFullCard ? styles.full_card : ''}`}
      onClick={handleGameClick}
    >
      <div
        className={styles.image_div}
        style={{
          backgroundImage: `url(${
            imageSrc
              ? `${
                  process.env.NEXT_PUBLIC_BACKEND_API_URL
                }${formatImageFromServer(imageSrc)}`
              : No_image.src
          })`,
        }}
      />

      <div className={styles.text_block}>
        <h1 className={mont.className}>{heading}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
