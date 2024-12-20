import styles from './SideBar.module.scss';

import Logo from '@/components/Logo/Logo';

import SideBarLinks from './SideBarLinks';

export default function SideBar() {
  return (
    <article className={styles.root}>
      <Logo className={styles.logo} fill="#fff" />
      <SideBarLinks />
    </article>
  );
}
