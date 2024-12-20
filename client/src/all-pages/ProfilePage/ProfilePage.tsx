'use client';

import styles from './Profile.module.scss';

import ProfileCard from '@/components/Profile/ProfileCard';

import { useAppSelector } from '@/hooks/redux-hooks';
import useUserProfile from '@/hooks/useUserProfile';

import withAuth from '@/utils/withAuth';

import { mont } from '@/font';

function ProfilePage() {
  const { userId } = useAppSelector((state) => state.user);

  const { data, isLoading } = useUserProfile({ id: userId! });

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Мій кабінет</h1>
        {data ? (
          <ProfileCard user={data} />
        ) : (
          <p>Щось пішло не так. Спробуйте пізніше.</p>
        )}
      </article>
    </section>
  );
}

export default withAuth(ProfilePage);
