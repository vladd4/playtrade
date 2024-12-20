'use client';

import { Search } from 'lucide-react';

import styles from './SearchBar.module.scss';

import { Game } from '@/types/game.type';

import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import useSearchDebounce from '@/hooks/useSearchDebounce';

import { searchGameByName } from '@/utils/searchGamesByName';

import { mont } from '@/font';

interface SearchProps {
  games: Record<string, Game[]>;
}

export default function SearchBar({ games }: SearchProps) {
  const [searchValue, setSearchValue] = useState('');

  const dispatch = useAppDispatch();

  const { searchedValue } = useAppSelector((state) => state.filteredGames);

  useSearchDebounce(searchValue, () => searchGameByName(searchValue, games, dispatch));

  useEffect(() => {
    setSearchValue(searchedValue);
  }, [searchedValue]);

  return (
    <div className={styles.root}>
      <Search className={styles.icon} size={20} color="#1f211f" />
      <input
        className={mont.className}
        type="text"
        placeholder="Пошук"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
}
