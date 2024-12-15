"use client";

import styles from "./AdminMainPage.module.scss";

import Notifications from "@/components/Admin/Notifications/Notifications";
import InfoCard from "@/components/Admin/InfoCard/InfoCard";
import AdminHeader from "@/components/Admin/AdminHeader/AdminHeader";

import withAdminAuth from "@/utils/withAdminAuth";

function AdminMainPage() {
  return (
    <section className={styles.root}>
      <AdminHeader />
      <article className={styles.wrapper}>
        <div className={styles.left_block}>
          <Notifications />
          <div className={styles.left_block_inner}>
            <InfoCard
              type="Прибуток платформи"
              amount="+11000"
              label="GB COINS"
            />
            <div className={styles.balance_inner}>
              <InfoCard
                type="Поповнення балансу"
                amount="+5800"
                label="GB COINS"
                className={styles.smaller_info}
              />
              <InfoCard
                type="Виведення балансу"
                amount="-2150"
                label="GB COINS"
                className={styles.smaller_info}
              />
            </div>
          </div>
        </div>
        <div className={styles.right_block}>
          <div className={styles.right_block_inner}>
            <InfoCard
              type="Кількість зареєстрованих 
                    користувачів"
              amount="358"
              label="користувачів"
            />
            <div className={styles.balance_right_inner}>
              <InfoCard
                type="За останній день"
                amount="+13"
                label="користувачів"
                className={styles.smaller_right_info}
              />
              <InfoCard
                type="За останній тиждень"
                amount="+36"
                label="користувачів"
                className={styles.smaller_right_info}
              />
              <InfoCard
                type="За останній місяць"
                amount="+78"
                label="користувачів"
                className={styles.smaller_right_info}
              />
            </div>
          </div>
          <InfoCard type="Статистика угод" isChart />
        </div>
      </article>
    </section>
  );
}

export default withAdminAuth(AdminMainPage);
