"use client";

import styles from "./Deposit.module.scss";

import { jost } from "@/font";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import withAuth from "@/utils/withAuth";

type DepositPageProps = {
  paymentType?: "deposit" | "withdraw";
};

function DepositPage({ paymentType }: DepositPageProps) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <section className={`${styles.root} ${jost.className}`}>
      <article className={styles.wrapper}>
        <div className={styles.top_block}>
          <p>Ваш баланс 50 GB coins</p>
          <h1 className={jost.className}>10</h1>
          <span className={jost.className}>GB coins</span>
        </div>
        <p className={styles.label}>*курс 1:1 до гривні </p>
        <div className={styles.bottom_block}>
          {paymentType && (
            <p>
              {paymentType === "withdraw"
                ? "Виведення коштів"
                : "Поповнення коштів"}
            </p>
          )}
          <div className={styles.select}>
            <div
              className={styles.select_wrapper}
              onClick={() => setIsClicked(!isClicked)}
            >
              <p>Обрати спосіб оплати</p>
              {isClicked ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            <div
              className={`${styles.options_block} ${
                isClicked ? styles.show_options : ""
              }`}
            >
              <div className={styles.option}>
                <input type="radio" name="option" value="1" id="option" />
                <label htmlFor="option">Спосіб оплати</label>
              </div>
              <div className={styles.option}>
                <input type="radio" name="option" value="2" id="option2" />
                <label htmlFor="option2">Спосіб оплати</label>
              </div>
              <div className={styles.option}>
                <input type="radio" name="option" value="3" id="option3" />
                <label htmlFor="option3">Спосіб оплати</label>
              </div>
            </div>
          </div>
          <input
            className={styles.card_input}
            placeholder="Введіть номер карти"
            type="text"
            required
          />
        </div>
      </article>
    </section>
  );
}

export default withAuth(DepositPage);
