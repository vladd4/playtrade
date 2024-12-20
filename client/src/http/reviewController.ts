import { Review } from '@/types/review.type';

import { privateAxios } from './axios';

export async function getReviews(): Promise<Review[] | null> {
  try {
    const { data } = await privateAxios.get<Review[]>('/reviews');
    return data;
  } catch (error: any) {
    console.log('Error getting reviews:', error.response?.data || error.message);
    return null;
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const { data } = await privateAxios.get<Review>(`/reviews/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error getting review by id ${id}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function deleteReview(id: string): Promise<Review | null> {
  try {
    const { data } = await privateAxios.delete<Review>(`/reviews/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error deleting review by id ${id}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function createReview(
  newReview: Omit<Review, 'id'>,
): Promise<Review | null> {
  try {
    const { data } = await privateAxios.post<Review>(`/reviews`, newReview);
    return data;
  } catch (error: any) {
    console.log(
      `Error creating review ${JSON.stringify(newReview)}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}
