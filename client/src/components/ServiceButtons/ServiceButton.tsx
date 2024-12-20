import styles from './ServiceButtons.module.scss';

import React from 'react';

import { mont } from '@/font';

interface ServButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function ServiceButton({
  isActive,
  className,
  children,
  ...props
}: ServButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${
        isActive ? styles.active_button : ''
      } ${className} ${mont.className}`}
    >
      {children}
    </button>
  );
}
