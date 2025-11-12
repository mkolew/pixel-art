import styles from './popup.module.scss';

import { MouseEventHandler, ReactNode, useCallback, useEffect, useRef } from 'react';
import { GoX } from 'react-icons/go';

import { Button } from '@/components/Button';

interface PopUpProps {
  type?: 'image';
  title: string;
  children: ReactNode;
  onSubmit?: MouseEventHandler;
  submitText?: string;
  onClose: MouseEventHandler;
  submitDisabled?: boolean;
  clean?: boolean;
}

export function PopUp(props: PopUpProps) {
  const popUpRef = useRef<HTMLDivElement>(null);

  /**
   * Trigger closing the popup when outside the popup is clicked
   * @param event
   */
  const clickOutside = useCallback(
    (event: MouseEvent) => {
      if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        props.onClose(event as any);
      }
    },
    [props],
  );

  /**
   * Execute on load of the popup
   */
  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [clickOutside]);

  return (
    <div ref={popUpRef} className={`${styles.popup} ${props.type ? styles[props.type] : ''}`}>
      <div className={styles.title}>
        <h2>{props.title}</h2>
        <Button type="icon" onClick={props.onClose}>
          <GoX color="white" size={34} />
        </Button>
      </div>
      <div className={`${styles.main} ${props.clean ? 'no-padding no-border' : ''}`}>
        {props.children}
      </div>
      {props.onSubmit && (
        <div className={styles.actions}>
          <Button type="primary" onClick={props.onSubmit} disabled={props.submitDisabled}>
            {props.submitText || 'Submit'}
          </Button>
        </div>
      )}
    </div>
  );
}
