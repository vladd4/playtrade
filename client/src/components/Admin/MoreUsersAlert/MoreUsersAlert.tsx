'use client';

import styles from './MoreUsersAlert.module.scss';

import { User } from '@/types/user.type';

import StarRating from '@/components/GameCards/StarRating';
import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import {
  setAdminUsersInfoType,
  setAdminUsersInfoUsers,
  setShowAdminUsersInfo,
} from '@/redux/slices/alertSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { formatImageFromServer } from '@/utils/formatImageName';

import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';

export default function MoreUsersAlert() {
  const dispatch = useAppDispatch();
  const { showAdminUsersInfo, adminUsersInfoType, adminUsersInfoUsers } = useAppSelector(
    (state) => state.alert,
  );

  const handleCloseAlert = () => {
    dispatch(setShowAdminUsersInfo(false));
  };

  const handleUserSelect = (user: User) => {
    dispatch(setAdminUsersInfoUsers([user]));
    dispatch(setAdminUsersInfoType('currentUser'));
  };

  return (
    <>
      <div
        className={`${styles.root} ${jost.className} ${
          showAdminUsersInfo ? styles.show_form : ''
        }`}
      >
        <div className={styles.wrapper}>
          {adminUsersInfoUsers === null ? null : adminUsersInfoType === 'selectUser' ? (
            <>
              <h1>Оберіть користувача</h1>
              <div className={styles.users}>
                <div onClick={() => handleUserSelect(adminUsersInfoUsers[0])}>
                  <div
                    style={{
                      backgroundColor: '#B0C4DE',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    className={styles.avatar}
                  >
                    <span>
                      {adminUsersInfoUsers[0]?.name
                        ? adminUsersInfoUsers[0]?.name[0]?.toUpperCase()
                        : 'S'}
                    </span>
                  </div>
                  <p>{adminUsersInfoUsers[0].name}</p>
                </div>
                <div onClick={() => handleUserSelect(adminUsersInfoUsers[1])}>
                  <div
                    style={{
                      backgroundColor: '#B0C4DE',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                    className={styles.avatar}
                  >
                    <span>
                      {adminUsersInfoUsers[1]?.name
                        ? adminUsersInfoUsers[1]?.name[0]?.toUpperCase()
                        : 'U'}
                    </span>
                  </div>
                  <p>{adminUsersInfoUsers[1].name}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: '#B0C4DE',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
                className={styles.avatar}
              >
                <span>
                  {adminUsersInfoUsers[0]?.name
                    ? adminUsersInfoUsers[0]?.name[0]?.toUpperCase()
                    : 'S'}
                </span>
              </div>
              <p className={styles.p}>Користувач: {adminUsersInfoUsers[0].name}</p>
              <p className={styles.p}>
                Рейтинг: <StarRating rating={adminUsersInfoUsers[0].rating} size={11} />
              </p>
              <p className={styles.p}>E-mail: {adminUsersInfoUsers[0].email}</p>
            </>
          )}
        </div>
      </div>
      <div
        onClick={handleCloseAlert}
        className={`${styles.overlay} ${showAdminUsersInfo ? styles.show_form : ''}`}
      />
    </>
  );
}
