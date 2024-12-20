import { useEffect } from 'react';

import {
  setFilteredGames as setFilteredAdminGames,
  setFilteredChat,
  setFilteredProducts,
  setFilteredUsers,
} from '@/redux/slices/filteredAdminItems';
import { setFilteredGames } from '@/redux/slices/filteredGames';

import { useAppDispatch } from './redux-hooks';

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
