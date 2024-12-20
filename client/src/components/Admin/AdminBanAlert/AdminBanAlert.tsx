'use client';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import styles from './AdminBanAlert.module.scss';

import { BlockTime } from '@/types/user.type';

import { useState } from 'react';

import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import { setShowBanAlert } from '@/redux/slices/alertSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { BLOCK_OPTIONS } from '@/utils/constants';

import { banUser } from '@/http/userController';

import { jost } from '@/font';

export default function AdminBanAlert() {
  const [optionValue, setOptionValue] = useState<BlockTime>('24h');

  const { showBanAlert, userToBanId } = useAppSelector((state) => state.alert);

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  const handleOptionChange = (option: BlockTime) => {
    setOptionValue(option);
  };

  const handleCloseAlert = () => {
    dispatch(setShowBanAlert(false));
    setOptionValue('24h');
  };

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userToBanId && optionValue) {
      const result = await banUser(userToBanId, optionValue);

      if (result) {
        toast.success(`Користувач ${userToBanId} був заблокований на ${optionValue}.`);
        queryClient.invalidateQueries({ queryKey: [`all-users`] });
      } else {
        toast.error(`Користувач ${userToBanId} не був заблокований. Спробуйте пізніше!`);
      }
      handleCloseAlert();
    }
  };

  return (
    <>
      <section
        className={`${styles.root} ${showBanAlert ? styles.show_form : ''} ${
          jost.className
        }`}
      >
        <form onSubmit={handleBanUser}>
          <h2>Оберіть термін блокування</h2>
          <div className={styles.block_options}>
            {BLOCK_OPTIONS.map((option) => {
              return (
                <ServiceButton
                  key={option.value}
                  onClick={() => handleOptionChange(option.value as BlockTime)}
                  className={optionValue === option.value ? styles.active : ''}
                  type="button"
                >
                  {option.label}
                </ServiceButton>
              );
            })}
          </div>
          <ServiceButton isActive className={styles.block_btn} type="submit">
            Заблокувати
          </ServiceButton>
        </form>
      </section>
      <div
        onClick={handleCloseAlert}
        className={`${styles.overlay} ${showBanAlert ? styles.show_form : ''}`}
      />
    </>
  );
}
