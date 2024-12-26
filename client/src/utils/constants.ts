export const MAX_IMAGES = 5;
export const TOAST_DURATION = 3000;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const ITEMS_PER_PAGE_COUNT = 10;
export const ENGLISH_ONLY_REGEX = /^[A-Za-z0-9\s-]+$/;
export const USER_PLACEHOLDER_ID = 'ca2cfeff-8480-4dd2-b840-dc4c489cede1';

export enum ProductType {
  CURRENCY = 'currency',
  ITEM = 'item',
  ACCOUNT = 'account',
  SERVICE = 'service',
  OTHER = 'other',
}

export enum UserRoles {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export const BLOCK_OPTIONS = [
  {
    value: '24h',
    label: '24 год',
  },
  {
    value: '7d',
    label: '7 днів',
  },
  {
    value: 'forever',
    label: 'назавжди',
  },
];

export const ProductTypeUrk: { [key in ProductType]: string } = {
  [ProductType.CURRENCY]: 'Валюта',
  [ProductType.ITEM]: 'Предмет',
  [ProductType.ACCOUNT]: 'Аккаунт',
  [ProductType.SERVICE]: 'Послуга',
  [ProductType.OTHER]: 'Інше',
};
