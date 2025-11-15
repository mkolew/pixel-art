'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import { AlertProps } from '@/components/Alert';

interface Context {
  toast: AlertProps | null;
  addToast: (alert: AlertProps | null) => void;
}

interface GlobalContextProviderProps {
  children: ReactNode;
}

export const GlobalContext = createContext<Context>({
  toast: {
    type: 'info',
    message: '',
  },
  addToast: () => null,
});

export const useGlobalContext = () => useContext(GlobalContext);

export function GlobalContextProvider(props: GlobalContextProviderProps) {
  const [toast, addToast] = useState<AlertProps | null>({ type: 'info', message: '' });

  return (
    <GlobalContext.Provider
      value={{
        toast,
        addToast,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
