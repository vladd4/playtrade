import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { MiniProduct } from '@/types/product.type';

type FilteredProducts = {
  filteredProducts: {
    products: MiniProduct[];
    totalPages: number;
    currentPage: number;
  } | null;
  filtersCount: number;
};

const initialState: FilteredProducts = {
  filteredProducts: null,
  filtersCount: 0,
};

export const filteredProductsSlice = createSlice({
  name: 'filteredProducts',
  initialState,
  reducers: {
    setFilteredProducts: (
      state,
      action: PayloadAction<{
        products: MiniProduct[];
        totalPages: number;
        currentPage: number;
      } | null>,
    ) => {
      state.filteredProducts = action.payload;
    },
    setFiltersCount: (state, action: PayloadAction<number>) => {
      state.filtersCount = action.payload;
    },
  },
});

export const { setFilteredProducts, setFiltersCount } = filteredProductsSlice.actions;
export default filteredProductsSlice.reducer;
