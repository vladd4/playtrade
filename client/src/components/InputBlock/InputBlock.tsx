'use client';

import styles from './InputBlock.module.scss';

import { jost } from '@/font';

type InputProps = {
  name: string;
  value: string;
  setValue: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  label: string;
  placeholder: string;
  isTextArea?: boolean;
  isFull?: boolean;
};

export default function InputBlock(props: InputProps) {
  return (
    <div className={`${styles.root} ${jost.className}`}>
      <p>{props.label}</p>
      {props.isTextArea ? (
        <textarea
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.setValue}
          style={props.isFull ? { height: '120px' } : {}}
        />
      ) : (
        <input
          name={props.name}
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.setValue}
        />
      )}
    </div>
  );
}
