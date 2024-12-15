import { Game } from "@/types/game.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FilteredGames = {
  filteredGames: Game[] | null;
  searchedValue: string;
};

const initialState: FilteredGames = {
  filteredGames: null,
  searchedValue: "",
};

export const filteredGamesSlice = createSlice({
  name: "filteredGames",
  initialState,
  reducers: {
    setFilteredGames: (state, action: PayloadAction<Game[] | null>) => {
      state.filteredGames = action.payload;
    },
    setSearchedValue: (state, action: PayloadAction<string>) => {
      state.searchedValue = action.payload;
    },
  },
});

export const { setFilteredGames, setSearchedValue } =
  filteredGamesSlice.actions;
export default filteredGamesSlice.reducer;
