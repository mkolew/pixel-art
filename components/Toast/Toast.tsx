import styles from './toast.module.scss';

import { GoX } from 'react-icons/go';

import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { useGlobalContext } from '@/context';

export function Toast() {
  const { toast, addToast } = useGlobalContext();

  /**
   * Remove the toast
   */
  const removeToast = () => {
    addToast(null);
  };

  if (!toast?.message) return <></>;
  return (
    <div className={styles.toast}>
      <Alert type={toast.type} message={toast.message} isToast={true}>
        <Button type="toast-close" onClick={removeToast}>
          <GoX color={toast.type === 'warning' ? 'black' : 'white'} size={34} />
        </Button>
      </Alert>
    </div>
  );
}
