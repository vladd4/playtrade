'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

import styles from './Filter.module.scss';

import { useRef, useState } from 'react';

import { setSortedGames } from '@/redux/slices/filteredAdminItems';

import { useAppDispatch } from '@/hooks/redux-hooks';
import useClickOutside from '@/hooks/useClickOutside';

import { getSortedGames } from '@/http/gameController';

import { jost } from '@/font';

export default function Filter() {
  const [isClicked, setIsClicked] = useState(false);
  const [sortValue, setSortValue] = useState<'asc' | 'desc' | ''>('');

  const filterRef = useRef(null);

  const dispatch = useAppDispatch();

  const buttonElement =
    typeof window !== 'undefined' ? document.getElementById('open-btn') : null;

  useClickOutside(filterRef, isClicked, setIsClicked, buttonElement);

  const handleSortGames = async (order: 'asc' | 'desc') => {
    setSortValue(order);

    const result = await getSortedGames(order.toUpperCase() as 'ASC' | 'DESC');
    if (result) {
      dispatch(setSortedGames(result));
    } else {
      dispatch(setSortedGames(null));
    }
  };

  return (
    <div className={`${styles.root} ${jost.className} `}>
      <p onClick={() => setIsClicked(!isClicked)} id="open-btn">
        Фільтрувати {isClicked ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </p>
      <div
        ref={filterRef}
        className={`${styles.filter_block} ${isClicked ? styles.show_filters : ''}`}
      >
        <p>По алфавіту</p>
        <div className={styles.options_block}>
          <div>
            <input
              type="radio"
              value="asc"
              name="asc"
              id="asc"
              checked={sortValue === 'asc'}
              onChange={() => handleSortGames('asc')}
            />
            <label htmlFor="asc">A -- Z</label>
          </div>
          <div>
            <input
              type="radio"
              value="desc"
              name="desc"
              id="desc"
              checked={sortValue === 'desc'}
              onChange={() => handleSortGames('desc')}
            />
            <label htmlFor="desc">Z -- A</label>
          </div>
        </div>
      </div>
    </div>
  );
}
