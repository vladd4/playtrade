import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type FiltersType = {
  regions: string[];
  servers: string[];
  platforms: string[];
};

type FilterSlice = {
  showFilter: boolean;
  filterOptions: FiltersType | null;
};

const initialState: FilterSlice = {
  showFilter: false,
  filterOptions: null,
};

export const filterSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setShowFilter: (state, action: PayloadAction<boolean>) => {
      state.showFilter = action.payload;
    },
    setGameFilters: (state, action: PayloadAction<FiltersType>) => {
      state.filterOptions = action.payload;
    },
  },
});

export const { setShowFilter, setGameFilters } = filterSlice.actions;
export default filterSlice.reducer;
