import { ProductType } from '@/utils/constants';

import { Game } from './game.type';
import { Review } from './review.type';
import { User } from './user.type';

export type Product = {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  platform: string;
  server: string;
  region: string;
  price: string;
  imageUrls: string[] | null;
  inProcess: boolean;
  type: ProductType;
  gameId: string;
  latestReviews: Review[];
  ownerId: string;
  buyerId: string;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  successfulTransactions: number;
};

export type AdminProducts = {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  platform: string;
  server: string;
  region: string;
  price: string;
  imageUrls: string[] | null;
  inProcess: boolean;
  isActive: boolean;
  type: ProductType;
  game: Game;
  owner: User;
};

export type AdminProductsWithPagination = {
  products: AdminProducts[];
  totalPages: number;
  currentPage: string;
  totalProducts: number;
};

export type ChatProduct = Omit<
  Product,
  'gameId' | 'latestReviews' | 'ownerId' | 'reviewsCount'
>;

export type MiniProduct = {
  id: string;
  seller: string;
  sellerRating: number;
  sellerId: string;
  description: string;
  platform: string;
  server: string;
  price: string;
  imageUrl: string;
};

export type AllMiniProducts = {
  products: MiniProduct[];
  totalPages: number;
  currentPage: number;
};

export type NewProduct = Omit<
  Product,
  'id' | 'inProcess' | 'latestReviews' | 'reviewsCount' | 'imageUrls'
> & {
  images: [];
};

export type FilterParams = {
  gameId: string;
  type: ProductType;
  platforms?: string[];
  servers?: string[];
  regions?: string[];
  minPrice?: number;
  maxPrice?: number;
};
