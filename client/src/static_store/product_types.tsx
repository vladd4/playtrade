import { ProductType } from '@/utils/constants';

export const product_types = [
  { label: 'Ігрова валюта', value: ProductType.CURRENCY },
  { label: 'Ігрові предмети', value: ProductType.ITEM },
  { label: 'Аккаунти', value: ProductType.ACCOUNT },
  { label: 'Послуги', value: ProductType.SERVICE },
  { label: 'Інше', value: ProductType.OTHER },
];
