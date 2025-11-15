import { GlobalContextProvider } from '@/context';
import { Paint } from '@/components/Paint';

export default function Home() {
  return (
    <GlobalContextProvider>
      <div className="content">
        <Paint />
      </div>
    </GlobalContextProvider>
  );
}
