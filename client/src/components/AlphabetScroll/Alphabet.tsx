import { days } from "@/font";
import styles from "./Alphabet.module.scss";
import { alphabet_letters } from "@/static_store/alphabet_letters";
import Link from "next/link";

export default function Alphabet() {
  return (
    <div className={styles.root}>
      {alphabet_letters.map((item) => {
        return (
          <Link href={`#card-${item}`} className={days.className} key={item}>
            {item}
          </Link>
        );
      })}
    </div>
  );
}
