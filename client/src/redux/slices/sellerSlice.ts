import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Seller } from '@/types/user.type';

type SellerSlice = {
  seller: Seller | null;
};

const initialState: SellerSlice = {
  seller: null,
};

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSeller: (state, action: PayloadAction<Seller>) => {
      state.seller = action.payload;
    },
  },
});

export const { setSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
