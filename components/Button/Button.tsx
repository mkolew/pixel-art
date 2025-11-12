import styles from './button.module.scss';

import { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  inForm?: boolean;
  type: string;
  onClick: MouseEventHandler;
  children: ReactNode;
  disabled?: boolean;
  highlighted?: boolean;
  bgColor?: string; // used for the color picker
}

export function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[props.type]} ${
        props.highlighted ? 'highlighted' : ''
      } ${props.inForm ? styles['in-form'] : ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.bgColor ? { backgroundColor: props.bgColor } : {}}
    >
      {props.children}
    </button>
  );
}
