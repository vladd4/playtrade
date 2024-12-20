'use client';

import { ChevronDown, ChevronUp, Plus, Redo2 } from 'lucide-react';

import styles from './Wallet.module.scss';

import { useRouter } from 'next/navigation';

import WalletHistory from '@/components/WalletHistory/WalletHistory';

import { useAppSelector } from '@/hooks/redux-hooks';
import useUserProfile from '@/hooks/useUserProfile';

import withAuth from '@/utils/withAuth';

import { jost, mont } from '@/font';

function Wallet() {
  const router = useRouter();

  const { userId } = useAppSelector((state) => state.user);

  const { data, isLoading } = useUserProfile({ id: userId! });

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Гаманець</h1>
        <div className={`${styles.info_block} ${jost.className}`}>
          <h5>Ваш баланс</h5>
          <span>{data?.balance || 0}$</span>
          <div className={styles.buttons_block}>
            <div onClick={() => router.push('/profile/wallet/deposit')}>
              <div className={styles.back_div}>
                <Plus size={18} color="#fff" />
              </div>
              <p>Поповнити баланс</p>
            </div>
            <div onClick={() => router.push('/profile/wallet/withdraw')}>
              <div className={styles.back_div}>
                <Redo2 size={18} color="#fff" />
              </div>
              <p>Вивести кошти</p>
            </div>
          </div>
        </div>

        <WalletHistory />
      </article>
    </section>
  );
}

export default withAuth(Wallet);
