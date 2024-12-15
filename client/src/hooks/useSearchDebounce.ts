import { useEffect } from "react";
import { useAppDispatch } from "./redux-hooks";
import {
  setFilteredChat,
  setFilteredProducts,
  setFilteredUsers,
  setFilteredGames as setFilteredAdminGames,
} from "@/redux/slices/filteredAdminItems";
import { setFilteredGames } from "@/redux/slices/filteredGames";

const useSearchDebounce = (searchValue: string, getData: () => void) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer = setTimeout(() => {
      if (searchValue) {
        getData();
      } else {
        dispatch(setFilteredGames(null));
        dispatch(setFilteredProducts(null));
        dispatch(setFilteredUsers(null));
        dispatch(setFilteredChat(null));
        dispatch(setFilteredAdminGames(null));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue]);
};

export default useSearchDebounce;
