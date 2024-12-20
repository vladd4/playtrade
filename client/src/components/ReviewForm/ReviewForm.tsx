'use client';

import ServiceButton from '../ServiceButtons/ServiceButton';
import { Star } from 'lucide-react';

import styles from './ReviewForm.module.scss';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/hooks/redux-hooks';

import withAuth from '@/utils/withAuth';

import { createReview } from '@/http/reviewController';

import { jost } from '@/font';

interface ReviewProps {
  productId: string;
  sellerId: string;
}

function ReviewForm({ productId, sellerId }: ReviewProps) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAppSelector((state) => state.user);

  const router = useRouter();

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value);
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleAddReview = async () => {
    try {
      setIsLoading(true);
      if (userId && productId && sellerId) {
        const newReview = {
          content: review,
          rating,
          buyerId: userId,
          sellerId,
          productId,
        };

        console.log(newReview);

        const result = await createReview(newReview);

        if (result) {
          router.push('/');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.root} ${jost.className}`}>
      <div className={styles.wrapper}>
        <h1>Ви успішно придбали товар!</h1>
        <div className={styles.stars_block}>
          {[1, 2, 3, 4, 5].map((starValue) => (
            <Star
              key={starValue}
              className={styles.star}
              strokeWidth={1}
              size={25}
              color="#E8D635"
              fill={starValue <= rating ? '#E8D635' : 'transparent'}
              onClick={() => handleRating(starValue)}
            />
          ))}
        </div>
        <input
          type="text"
          placeholder="Залиште відгук про продавця"
          value={review}
          required
          onChange={handleReviewChange}
        />
        <ServiceButton
          disabled={review === '' || rating === 0 || isLoading}
          className={`${styles.submit_button} ${
            review === '' || rating === 0 ? styles.disabled : ''
          }`}
          onClick={handleAddReview}
        >
          {isLoading ? 'Завантаження...' : 'Відправити'}
        </ServiceButton>
      </div>
    </div>
  );
}

export default withAuth(ReviewForm);
