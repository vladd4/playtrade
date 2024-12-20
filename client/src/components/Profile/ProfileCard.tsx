'use client';

import AlertChangeForm from '../AlertChangeForm/AlertChangeForm';
import StarRating from '../GameCards/StarRating';
import { Pencil } from 'lucide-react';

import styles from './Profile.module.scss';

import { User } from '@/types/user.type';

import { setChangeAlertType, setShowChangeAlert } from '@/redux/slices/alertSlice';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { formatImageFromServer } from '@/utils/formatImageName';

import ProfileButton from './ProfileButton';
import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';
import { profile_links } from '@/static_store/profile_links';

interface ProfileProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileProps) {
  const dispatch = useAppDispatch();

  const handleAlertOpen = (alertType: 'name' | 'password') => {
    dispatch(setShowChangeAlert(true));
    dispatch(setChangeAlertType(alertType));
  };

  return (
    <>
      <div className={`${styles.root} ${jost.className}`}>
        <div className={styles.info_block}>
          <div
            className={styles.image_div}
            style={{
              backgroundColor: '#B0C4DE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            <span>{user?.name ? user?.name[0]?.toUpperCase() : 'U'}</span>
          </div>
          <div className={styles.user_info}>
            <div className={styles.name}>
              <p>
                Ім'я: <span>{user.name}</span>
              </p>
              <Pencil
                size={16}
                className={styles.svg}
                onClick={() => handleAlertOpen('name')}
              />
            </div>
            <div className={styles.name}>
              <p>Рейтинг:</p>
              <StarRating size={14} rating={user.rating} className={styles.stars} />
            </div>
            <div className={styles.name}>
              <p>
                E-mail: <span>{user.email}</span>
              </p>
            </div>
            <div className={styles.name}>
              <p>
                Пароль: <span>*****</span>
              </p>
              <Pencil
                size={16}
                className={styles.svg}
                onClick={() => handleAlertOpen('password')}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttons_block}>
          {profile_links.map((btn) => {
            return (
              <ProfileButton
                key={btn.label}
                label={btn.label}
                icon={btn.icon}
                href={btn.href}
              />
            );
          })}
        </div>
      </div>
      <AlertChangeForm currentUserName={user.name} />
    </>
  );
}
