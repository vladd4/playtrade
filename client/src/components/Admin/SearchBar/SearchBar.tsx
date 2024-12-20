'use client';

import { Search } from 'lucide-react';

import styles from './SearchBar.module.scss';

import { useState } from 'react';

import {
  setFilteredChat,
  setFilteredGames,
  setFilteredProducts,
  setFilteredUsers,
} from '@/redux/slices/filteredAdminItems';

import { useAppDispatch } from '@/hooks/redux-hooks';
import useSearchDebounce from '@/hooks/useSearchDebounce';

import { searchChatByChatId } from '@/http/chatController';
import { searchGamesByName } from '@/http/gameController';
import { searchProductsByName } from '@/http/productController';
import { searchUsersByName } from '@/http/userController';

import { mont } from '@/font';

interface SearchBarProps {
  placeholder?: string;
  type: 'users' | 'products' | 'chats' | 'games';
}

export default function SearchBar({ placeholder, type }: SearchBarProps) {
  const [value, setValue] = useState('');

  const dispatch = useAppDispatch();

  const searchProducts = async () => {
    const result = await searchProductsByName(value);
    if (result) {
      dispatch(setFilteredProducts(result));
    }
  };

  const searchUsers = async () => {
    const result = await searchUsersByName(value);
    if (result) {
      dispatch(setFilteredUsers(result));
    }
  };

  const searchGames = async () => {
    const result = await searchGamesByName(value);

    dispatch(setFilteredGames(result));
  };

  const searchChat = async () => {
    const result = await searchChatByChatId(value);
    if (result) {
      dispatch(setFilteredChat(result));
    } else {
      dispatch(setFilteredChat(undefined));
    }
  };

  const searchContoller =
    type === 'products'
      ? searchProducts
      : type === 'users'
        ? searchUsers
        : type === 'chats'
          ? searchChat
          : searchGames;

  useSearchDebounce(value, searchContoller);

  return (
    <div className={styles.root}>
      <Search className={styles.icon} size={20} color="#000" />
      <input
        className={mont.className}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
