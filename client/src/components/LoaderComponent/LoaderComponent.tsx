import { Loader } from 'lucide-react';

import styles from './Loader.module.scss';

export default function LoaderComponent() {
  return (
    <div className={styles.root}>
      <Loader fill="#fff" color="#fff" size={26} className={styles.svg} />
    </div>
  );
}
