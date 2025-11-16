'use client';

import { GlobalContextProvider } from '@/context';
import { Paint } from '@/components/Paint';
import { Toast } from '@/components/Toast';

export default function Home() {
  return (
    <GlobalContextProvider>
      <Toast />
      <div className="content">
        <Paint />
      </div>
    </GlobalContextProvider>
  );
}
