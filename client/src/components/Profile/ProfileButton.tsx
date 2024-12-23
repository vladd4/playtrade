'use client';

import styles from './Profile.module.scss';

import { useRouter } from 'next/navigation';

type ProfileButtonProps = {
  label: string;
  icon: any;
  href: string;
};

export default function ProfileButton({ label, icon, href }: ProfileButtonProps) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(href)} className={styles.btn_root}>
      <div className={styles.icon}>{icon}</div>
      <p>{label}</p>
    </div>
  );
}
