"use client";

import styles from "./Deposit.module.scss";

import { jost } from "@/font";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import withAuth from "@/utils/withAuth";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import toast from "react-hot-toast";
import { updateBalance } from "@/http/userController";
import { useAppSelector } from "@/hooks/redux-hooks";
import useUserProfile from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";

type DepositPageProps = {
  paymentType?: "deposit" | "withdraw";
};

function DepositPage({ paymentType }: DepositPageProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [balance, setBalance] = useState(0);

  const { userId } = useAppSelector((state) => state.user);

  const { data, isLoading } = useUserProfile({ id: userId! });

  const router = useRouter();

  const handleDepositMoney = async () => {
    if (userId) {
      if (cardNumber !== "" && balance !== 0) {
        const updatedBalance = data?.balance ? data?.balance : 0 + balance;
        const result = await updateBalance(userId, updatedBalance);
        if (!result) {
          toast.error("Щось пішло не так. Спробуйте пізніше!");
        } else {
          router.push("/profile/wallet");
        }
      } else {
        toast.error("Виберіть спосіб оплати та введіть номер карти");
      }
    }
  };

  const handleWithdrawMoney = async () => {
    if (userId) {
      if (cardNumber !== "" && balance !== 0) {
        if (data?.balance ? data?.balance : 0 < balance) {
          toast.error("Невистачає коштів!");
        } else {
          const updatedBalance = data?.balance ? data?.balance : 0 - balance;
          const result = await updateBalance(userId, updatedBalance);
          if (!result) {
            toast.error("Щось пішло не так. Спробуйте пізніше!");
          } else {
            router.push("/profile/wallet");
          }
        }
      } else {
        toast.error("Виберіть спосіб оплати та введіть номер карти");
      }
    }
  };

  if (isLoading) return null;

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <article className={styles.wrapper}>
        <div className={styles.top_block}>
          <p>Ваш баланс {data?.balance}$</p>
          <h1 className={jost.className}>{balance}$</h1>
        </div>
        <p className={styles.label}>*курс 1:1 до долару</p>
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
                <label htmlFor="option">Спосіб оплати #1</label>
              </div>
              <div className={styles.option}>
                <input type="radio" name="option" value="2" id="option2" />
                <label htmlFor="option2">Спосіб оплати #2</label>
              </div>
              <div className={styles.option}>
                <input type="radio" name="option" value="3" id="option3" />
                <label htmlFor="option3">Спосіб оплати #3</label>
              </div>
            </div>
          </div>
          <input
            className={styles.card_input}
            placeholder="Введіть номер карти"
            type="text"
            required
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            className={styles.card_input}
            placeholder="Введіть суму"
            type="number"
            required
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
          />
          <ServiceButton
            isActive
            className={styles.submit_btn}
            onClick={
              paymentType === "deposit"
                ? handleDepositMoney
                : handleWithdrawMoney
            }
          >
            {paymentType === "deposit" ? "Поповнити" : "Вивести"}
          </ServiceButton>
        </div>
      </article>
    </section>
  );
}

export default withAuth(DepositPage);
