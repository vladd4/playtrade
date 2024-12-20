import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import styles from './CreateForms.module.scss';

import { Game } from '@/types/game.type';

import React, { useEffect, useState } from 'react';

import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import { setShowEditGameTypesAlert } from '@/redux/slices/alertSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { TOAST_DURATION } from '@/utils/constants';

import { addGamePlatform, addGameRegion, addGameServer } from '@/http/gameController';

import { jost } from '@/font';

interface PlatformProps {
  games: Game[];
}

export default function CreatePlatformForm({ games }: PlatformProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedGame, setSelectedGame] = useState('');

  const [gameOptions, setGameOptions] = useState<{ label: string; value: string }[]>([]);

  const dispatch = useAppDispatch();
  const { showEditGameTypesAlert, editGameTypesAlertType } = useAppSelector(
    (state) => state.alert,
  );

  const queryClient = useQueryClient();

  const label =
    editGameTypesAlertType === 'platform'
      ? 'платформу'
      : editGameTypesAlertType === 'region'
        ? 'регіон'
        : 'сервер';

  const handleCloseAlert = () => {
    dispatch(setShowEditGameTypesAlert(false));
    setInputValue('');
    setSelectedGame('');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const createController =
        editGameTypesAlertType === 'platform'
          ? addGamePlatform
          : editGameTypesAlertType === 'server'
            ? addGameServer
            : addGameRegion;

      if (selectedGame !== '' && inputValue !== '') {
        const result = await createController(selectedGame, [
          inputValue.toUpperCase().trim(),
        ]);

        if (result) {
          toast.success('Успішно додано!');
          queryClient.invalidateQueries({ queryKey: [`all-games`] });
          setTimeout(() => {
            handleCloseAlert();
          }, TOAST_DURATION);
        } else {
          toast.error('Щось пішло не так. Спробуйте пізніше!');
        }
      } else {
        toast.error('Заповніть всі неохідні поля!');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (games) {
      const newOptions = games.map((game) => ({
        label: game.name,
        value: game.id,
      }));

      setGameOptions(newOptions);
    }
  }, [games]);

  return (
    <>
      <section
        className={`${styles.edit_root} ${jost.className} ${
          showEditGameTypesAlert ? styles.show_form : ''
        }`}
      >
        <article className={styles.edit_wrapper}>
          <h1>Додати {label}</h1>
          <form onSubmit={handleSubmitForm}>
            <p>Оберіть гру</p>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="" disabled className={styles.disabled}>
                Наприклад: CS GO 2
              </option>
              {gameOptions &&
                gameOptions.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
            </select>
            <p>Введіть значення</p>
            <input
              placeholder="Значення"
              value={inputValue}
              name="name"
              onChange={(e) => setInputValue(e.target.value)}
            />

            <ServiceButton
              isActive
              className={styles.button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Завантаження...' : 'Додати'}
            </ServiceButton>
          </form>
        </article>
      </section>
      <div
        onClick={handleCloseAlert}
        className={`${styles.overlay} ${showEditGameTypesAlert ? styles.show_form : ''}`}
      />
    </>
  );
}
