"use client";

import styles from "./Wallet.module.scss";

import { jost, mont } from "@/font";

import { ChevronDown, ChevronUp, Plus, Redo2 } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import WalletHistory from "@/components/WalletHistory/WalletHistory";

import withAuth from "@/utils/withAuth";

function Wallet() {
  const [isClicked, setIsClicked] = useState(false);

  const router = useRouter();

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Гаманець</h1>
        <div className={`${styles.info_block} ${jost.className}`}>
          <h5>Ваш баланс</h5>
          <span>50,00</span>
          <span className={styles.currency_span}>gb coins</span>
          <div className={styles.buttons_block}>
            <div onClick={() => router.push("/profile/wallet/deposit")}>
              <div className={styles.back_div}>
                <Plus size={18} color="#fff" />
              </div>
              <p>Поповнити баланс</p>
            </div>
            <div onClick={() => router.push("/profile/wallet/withdraw")}>
              <div className={styles.back_div}>
                <Redo2 size={18} color="#fff" />
              </div>
              <p>Вивести кошти</p>
            </div>
          </div>
        </div>
        <div className={`${styles.payment_block} ${jost.className}`}>
          <p>Спосіб оплати</p>
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
        </div>
        <WalletHistory />
      </article>
    </section>
  );
}

export default withAuth(Wallet);
