import styles from "./Wallet.module.scss";

import { jost } from "@/font";

import WalletHistoryCard from "./WalletHistoryCard";

const cards = [
  {
    amount: 50,
    transactionType: "Надходження коштів від ABCD",
    type: "plus",
  },
  {
    amount: 50,
    transactionType: "Виведення коштів на рахунок ***1111",
    type: "minus",
  },
  {
    amount: 50,
    transactionType: "Поповнення балансу",
    type: "plus",
  },
];

export default function WalletHistory() {
  return (
    <article className={`${styles.root} ${jost.className}`}>
      <p>Історія транзакцій</p>
      <div className={styles.cards_block}>
        {cards.map((card) => {
          return (
            <WalletHistoryCard
              key={card.transactionType}
              amount={card.amount}
              type={card.type as "plus" | "minus"}
              transactionType={card.transactionType}
            />
          );
        })}
      </div>
    </article>
  );
}
