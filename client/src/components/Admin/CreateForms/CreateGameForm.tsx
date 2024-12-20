'use client';

import { useQueryClient } from '@tanstack/react-query';
import { CircleX, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

import styles from './CreateForms.module.scss';

import React, { useEffect, useRef, useState } from 'react';

import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import { setShowCreateGameAlert } from '@/redux/slices/alertSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { ENGLISH_ONLY_REGEX, TOAST_DURATION } from '@/utils/constants';
import { formatImageFromServer } from '@/utils/formatImageName';
import { handleImageClick } from '@/utils/productCreateEdit_helpers';

import { createGame, editGame, getGameById } from '@/http/gameController';

import MultiInput from './MultiInput';
import { jost } from '@/font';

const initialFormValues = {
  name: '',
  description: '',
  image: null as File | null,
};

export default function CreateGameForm() {
  const dispatch = useAppDispatch();
  const { showCreateGameAlert, createGameAlertType, editGameAlertGameId } =
    useAppSelector((state) => state.alert);

  const [formValues, setFormValues] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [platformTags, setPlatformTags] = useState<string[]>([]);
  const [regionTags, setRegionTags] = useState<string[]>([]);
  const [serverTags, setServerTags] = useState<string[]>([]);
  const [oldGameImageSrc, setOldGameImageSrc] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const handleCloseAlert = () => {
    dispatch(setShowCreateGameAlert(false));
    handleResetState();
  };

  const handleResetState = () => {
    setFormValues(initialFormValues);
    setPlatformTags([]);
    setServerTags([]);
    setRegionTags([]);
  };

  const appendTags = (formData: FormData, key: string, tags: string[]) => {
    if (tags.length > 0) {
      formData.append(key, JSON.stringify(tags.map((tag) => tag.toUpperCase().trim())));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastLabel =
      createGameAlertType === 'create' ? 'Гра успішно створена' : 'Гра успішно збережена';

    setIsLoading(true);

    if (!ENGLISH_ONLY_REGEX.test(formValues.name.trim())) {
      toast.error('Назва гри повинна містити тільки англійські літери!');
      setIsLoading(false);
      return;
    }

    const isFormValid = (type: 'create' | 'edit') => {
      return (
        Object.values(formValues).every((field) => {
          if (type === 'edit' && field === initialFormValues.image) {
            return true;
          }
          return field;
        }) &&
        platformTags.length > 0 &&
        regionTags.length > 0 &&
        serverTags.length > 0
      );
    };

    if (!isFormValid(createGameAlertType)) {
      toast.error('Заповніть всі поля будь-ласка!');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', formValues.name.trim());
    formData.append('description', formValues.description.trim());
    appendTags(formData, 'platforms', platformTags);
    appendTags(formData, 'servers', serverTags);
    appendTags(formData, 'region', regionTags);

    if (formValues.image) {
      formData.append('photo', formValues.image);
    }

    try {
      let result;
      if (editGameAlertGameId && createGameAlertType === 'edit') {
        result = await editGame(formData, editGameAlertGameId);
      } else {
        result = await createGame(formData);
      }

      if (result) {
        toast.success(toastLabel);
        queryClient.invalidateQueries({ queryKey: [`all-games`] });
        setTimeout(() => {
          handleResetState();
          dispatch(setShowCreateGameAlert(false));
        }, TOAST_DURATION);
      }
    } catch (error) {
      toast.error('Щось пішло не так. Спробуйте пізніше!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormValues((prevValues) => ({
        ...prevValues,
        image: files[0],
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        image: null,
      }));
    }
  };

  useEffect(() => {
    setIsPageLoading(true);
    const getGame = async () => {
      if (createGameAlertType === 'edit' && editGameAlertGameId && showCreateGameAlert) {
        const result = await getGameById(editGameAlertGameId);

        if (result) {
          setFormValues({
            name: result.name,
            description: result.description,
            image: null,
          });

          setPlatformTags(result.platforms ?? []);
          setRegionTags(result.region ?? []);
          setServerTags(result.servers ?? []);
          setOldGameImageSrc(result.photoPath);
        }
      } else {
        setOldGameImageSrc('');
      }
      setIsPageLoading(false);
    };

    getGame();
  }, [showCreateGameAlert]);

  useEffect(() => {
    if (createGameAlertType === 'create') {
      handleResetState();
      setOldGameImageSrc('');
    }
  }, [createGameAlertType]);

  return (
    <section
      className={`${styles.root} ${jost.className} ${
        showCreateGameAlert ? styles.show_form : ''
      }`}
    >
      <article className={styles.wrapper}>
        <h1>{createGameAlertType === 'create' ? 'Створити гру' : 'Редагувати гру'}</h1>
        <X className={styles.close_span} onClick={handleCloseAlert} />
        {!isPageLoading && (
          <form onSubmit={handleSubmitForm}>
            <div className={styles.form_row}>
              <div>
                <p>Назва гри</p>
                <input
                  placeholder="Наприклад: Dota 2"
                  value={formValues.name}
                  name="name"
                  onChange={handleInputChange}
                />
                <p>Платформи (додайте декілька натиснувши enter)</p>
                <MultiInput
                  tags={platformTags}
                  setTags={setPlatformTags}
                  placeholder="Наприклад: PC"
                />
                <p>Сервери (додайте декілька натиснувши enter)</p>
                <MultiInput
                  tags={serverTags}
                  setTags={setServerTags}
                  placeholder="Наприклад: UK"
                />
                <p>Регіони (додайте декілька натиснувши enter)</p>
                <MultiInput
                  tags={regionTags}
                  setTags={setRegionTags}
                  placeholder="Наприклад: EU"
                />
                <p>Опис гри</p>
                <textarea
                  placeholder="Наприклад: Dota 2 - багатокористувацька гра..."
                  value={formValues.description}
                  name="description"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                {oldGameImageSrc ? (
                  <div className={styles.image_preview}>
                    <div
                      className={styles.image_div}
                      style={{
                        backgroundImage: `url(${
                          process.env.NEXT_PUBLIC_BACKEND_API_URL
                        }${formatImageFromServer(oldGameImageSrc)})`,
                      }}
                    >
                      <CircleX
                        size={20}
                        fill="red"
                        color="#fff"
                        onClick={() => setOldGameImageSrc('')}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.image_block}
                    onClick={() => handleImageClick(fileInputRef)}
                  >
                    <Image size={60} />
                    <p className={jost.className}>Додати зображення</p>
                    <p>{formValues.image && formValues.image.name}</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <ServiceButton
              isActive
              className={styles.button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Завантаження...'
                : `${createGameAlertType === 'create' ? 'Створити' : 'Зберегти'}`}
            </ServiceButton>
          </form>
        )}
      </article>
    </section>
  );
}
