import GameCard from "./GameCard";
import styles from "./GameCards.module.scss";
import { days } from "@/font";
import { Game } from "@/types/game.type";

type CardBlockProps = {
  letter?: string;
  cards: Game[];
};

export default function GameCardBlock({ letter, cards }: CardBlockProps) {
  return (
    <section className={styles.root} id={`card-${letter}`}>
      {letter && <h1 className={days.className}>{letter}</h1>}
      <div className={styles.cards_block}>
        {cards.map((card) => {
          return (
            <GameCard
              key={card.id}
              heading={card.name}
              description={card.description}
              imageSrc={card.photoPath}
              id={card.id}
              regions={card.region}
              servers={card.servers}
              platforms={card.platforms}
            />
          );
        })}
      </div>
    </section>
  );
}
