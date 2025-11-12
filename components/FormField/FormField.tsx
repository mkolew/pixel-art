import styles from './form-field.module.scss';

import { ChangeEventHandler, KeyboardEvent, useState } from 'react';
import { TfiPencil } from 'react-icons/tfi';

import { Button } from '@/components/Button';

type AsyncKeyboardEventHandler = (event: KeyboardEvent) => Promise<void>;

interface FormFieldProps {
  inline?: boolean;
  foldable?: boolean;
  type: string;
  name: string;
  label: string;
  labelWidth?: number;
  value: string;
  placeholder: string;
  maxLength?: number;
  maxWidth?: number;
  errorMsg?: string;
  successMsg?: string;
  onEnter?: AsyncKeyboardEventHandler;
  onChange?: ChangeEventHandler;
  onBlur?: ChangeEventHandler;
}

export function FormField(props: FormFieldProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);

  /**
   * On username input key down
   * @param event keyboard event
   */
  async function handleInputKeyDown(event: KeyboardEvent) {
    if (props.onEnter && event.key === 'Enter') {
      await props.onEnter(event);
      if (!props.errorMsg) {
        setIsInputVisible(false);
      }
    }
  }

  return (
    <div className={`${styles['form-field']} ${props.inline ? styles.inline : ''}`}>
      <div className={styles['field']} style={props.maxWidth ? { maxWidth: props.maxWidth } : {}}>
        <label htmlFor={props.name} style={props.labelWidth ? { minWidth: props.labelWidth } : {}}>
          {props.label}
        </label>
        {props.foldable && !isInputVisible && (
          <div className={styles.value}>
            <Button type="icon" onClick={() => setIsInputVisible(true)}>
              <TfiPencil color="white" size={20} />
            </Button>
            <span>{props.value}</span>
          </div>
        )}
        {(!props.foldable || isInputVisible) && (
          <div className={styles.input}>
            <input
              className={props.maxLength ? styles['with-count'] : ''}
              type={props.type}
              name={props.name}
              value={props.value}
              placeholder={props.placeholder}
              maxLength={props.maxLength}
              onKeyDown={handleInputKeyDown}
              onChange={props.onChange}
              onBlur={props.onBlur}
              step="any"
            />
            {props.maxLength && (
              <span className={styles['input-count']}>
                {props.value.length} / {props.maxLength}
              </span>
            )}
          </div>
        )}
      </div>
      {props.errorMsg && (
        <span className={`${styles.message} ${styles['error-message']}`}>{props.errorMsg}</span>
      )}
      {props.successMsg && (
        <span className={`${styles.message} ${styles['success-message']}`}>{props.successMsg}</span>
      )}
    </div>
  );
}
