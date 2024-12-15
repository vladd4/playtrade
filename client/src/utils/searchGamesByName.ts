import {
  setFilteredGames,
  setSearchedValue,
} from "@/redux/slices/filteredGames";
import { AppDispatch } from "@/redux/store";
import { Game } from "@/types/game.type";

export const searchGameByName = (
  searchTerm: string,
  games: Record<string, Game[]>,
  dispatch: AppDispatch
) => {
  const result: Game[] = [];

  const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");

  Object.keys(games).forEach((letter) => {
    const filteredGames = games[letter].filter((game) => {
      const normalizedGameName = game.name.toLowerCase().replace(/\s+/g, "");

      return normalizedGameName.includes(normalizedSearchTerm);
    });

    result.push(...filteredGames);
  });

  dispatch(setFilteredGames(result));
  dispatch(setSearchedValue(searchTerm));
};
