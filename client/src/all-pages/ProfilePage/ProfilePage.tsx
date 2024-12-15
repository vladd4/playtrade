"use client";

import styles from "./Profile.module.scss";

import { mont } from "@/font";

import ProfileCard from "@/components/Profile/ProfileCard";

import withAuth from "@/utils/withAuth";

import useUserProfile from "@/hooks/useUserProfile";
import { useAppSelector } from "@/hooks/redux-hooks";

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
