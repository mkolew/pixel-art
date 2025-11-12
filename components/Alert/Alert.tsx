import styles from './alert.module.scss';
import { VscError, VscInfo, VscPass, VscWarning } from 'react-icons/vsc';
import { ReactNode } from 'react';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

const icons = {
  error: VscError,
  success: VscPass,
  info: VscInfo,
  warning: VscWarning,
};

export interface AlertProps {
  isToast?: boolean;
  type: AlertType;
  message?: string;
  children?: ReactNode;
}

export function Alert(props: AlertProps) {
  const IconTag = icons[props.type];

  return (
    <div
      className={`${styles.alert} ${styles[props.type]} ${
        props.isToast ? styles['toast-alert'] : ''
      }`}
    >
      <IconTag size={25} />
      <span>{props.message}</span>
      {props.children}
    </div>
  );
}
