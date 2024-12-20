'use client';

import styles from './AdminTable.module.scss';

import React from 'react';

import {
  setCreateGameAlertType,
  setEditGameTypesAlertType,
  setShowCreateGameAlert,
  setShowEditGameTypesAlert,
} from '@/redux/slices/alertSlice';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { jost } from '@/font';

export default function AdminCategoryButtons() {
  const dispatch = useAppDispatch();

  const handleOpenTypesAlert = (type: 'platform' | 'region' | 'server') => {
    dispatch(setEditGameTypesAlertType(type));
    dispatch(setShowEditGameTypesAlert(true));
  };

  return (
    <div className={`${styles.buttons} ${jost.className}`}>
      <button
        onClick={() => {
          dispatch(setShowCreateGameAlert(true));
          dispatch(setCreateGameAlertType('create'));
        }}
      >
        Додати гру
      </button>
      <button onClick={() => handleOpenTypesAlert('region')}>Додати регіон</button>
      <button onClick={() => handleOpenTypesAlert('server')}>Додати сервер</button>
      <button onClick={() => handleOpenTypesAlert('platform')}>Додати платформу</button>
    </div>
  );
}
