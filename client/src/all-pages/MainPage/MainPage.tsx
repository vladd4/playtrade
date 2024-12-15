"use client";

import styles from "./MainPage.module.scss";

import Logo from "@/components/Logo/Logo";
import SearchBar from "@/components/SearchBar/SearchBar";
import Alphabet from "@/components/AlphabetScroll/Alphabet";
import GameCardBlock from "@/components/GameCards/GameCardBlock";

import withAuth from "@/utils/withAuth";

import useGames from "@/hooks/useGames";
import { useAppSelector } from "@/hooks/redux-hooks";

function MainPage() {
  const { data, isLoading } = useGames();

  const { filteredGames, searchedValue } = useAppSelector(
    (state) => state.filteredGames
  );

  return (
    <div className={styles.root}>
      <div className={styles.logo_block}>
        <Logo fill="var(--button-active-color)" />
      </div>
      <SearchBar games={data!} />
      <Alphabet />
      <div className={styles.cards_block}>
        {isLoading ? null : filteredGames === null ? (
          data ? (
            Object.keys(data).map((letter) => (
              <GameCardBlock
                key={letter}
                letter={letter}
                cards={data[letter]}
              />
            ))
          ) : (
            <p className={styles.no_games}>Ігри скоро з'являться, очікуйте!</p>
          )
        ) : filteredGames.length > 0 ? (
          <GameCardBlock letter={searchedValue} cards={filteredGames} />
        ) : (
          <p className={styles.no_games}>
            За вашим пошуком нічого не знайдено!
          </p>
        )}
      </div>
    </div>
  );
}

export default withAuth(MainPage);
