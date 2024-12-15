import styles from "./Wallet.module.scss";

import { MoveLeft, MoveRight } from "lucide-react";

type WalletCardProps = {
  amount: number;
  transactionType: string;
  type: "plus" | "minus";
};

export default function WalletHistoryCard(props: WalletCardProps) {
  return (
    <div className={styles.card_root}>
      <div className={styles.top_block}>
        {props.type === "minus" ? (
          <MoveLeft size={20} color="var(--button-active-color)" />
        ) : (
          <MoveRight size={20} color="var(--button-active-color)" />
        )}
        <p>{props.transactionType}</p>
      </div>
      <div className={styles.bottom_block}>
        <p>Сума</p>
        <p>
          {props.type === "minus" ? "-" : "+"} {props.amount} GB coins
        </p>
      </div>
    </div>
  );
}
