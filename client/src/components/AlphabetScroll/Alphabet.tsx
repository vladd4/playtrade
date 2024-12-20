import styles from './Alphabet.module.scss';

import Link from 'next/link';

import { days } from '@/font';
import { alphabet_letters } from '@/static_store/alphabet_letters';

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
