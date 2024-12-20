'use client';

import styles from './PurchaseConditions.module.scss';

import { useRouter } from 'next/navigation';

import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import { removeFromSessionStorage } from '@/utils/sessionStorage_helper';
import withAuth from '@/utils/withAuth';

import { jost, mont } from '@/font';

function PurchaseConditions() {
  const router = useRouter();

  const handleConfirmOrder = () => {
    router.push('/');
    removeFromSessionStorage('product_buy_info');
  };

  const handleCancelOrder = () => {
    router.back();
    removeFromSessionStorage('product_buy_info');
  };

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Оформлення покупки</h1>
        <div className={`${styles.info_block} ${jost.className}`}>
          <h5>Правила продажу</h5>
          <p>
            <span>3.1.1</span> Відмова у виконанні завдань, поставлених співробітником
            арбітражу, ігнорування його повідомлень, а також байдужість під час вирішення
            спору.Повернення до 100% суми замовлення.
          </p>
          <p>
            <span>3.1.2</span> Відмова від консультування покупця щодо його замовлення,
            ігнорування питань покупця, відсутність обслуговування.Повернення до 100% суми
            замовлення.
          </p>
          <p>
            <span>3.2.1</span> Адміністрація гри застосувала до покупця санкції, оскільки
            ігрова валюта чи предмети отримали нелегальним шляхом (шахрайство,
            використання помилок гри тощо).Повернення до 100% суми замовлення.
          </p>
          <p>
            <span>3.2.2</span> Адміністрація гри застосувала до покупця санкції через
            купівлю ігрової валюти або предметів.Повернення до 50% від суми замовлення.
          </p>
          <p>
            <span>3.3.1</span> Втрата покупцем аккаунту внаслідок відновлення доступу до
            нього продавцем або первісним власником (через службу підтримки гри або
            будь-яким іншим чином).Повернення до 100% суми замовлення.
          </p>
          <p>
            <span>3.3.2</span> Блокування аккаунту адміністрацією гри через факт
            купівлі/продажу аккаунту.Повернення до 50% від суми замовлення.3.4. Послуги
          </p>
          <ServiceButton isActive className={styles.btn} onClick={handleConfirmOrder}>
            Погодитись
          </ServiceButton>
          <ServiceButton className={styles.btn} onClick={handleCancelOrder}>
            Відмінити домовленість
          </ServiceButton>
        </div>
      </article>
    </section>
  );
}

export default withAuth(PurchaseConditions);
