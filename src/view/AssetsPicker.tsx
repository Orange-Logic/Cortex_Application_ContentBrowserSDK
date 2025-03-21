import { FC, lazy, Suspense } from 'react';

import Loader from '@/components/Loader';
import { useAppSelector } from '@/store';
import { authenticatedSelector } from '@/store/auth/auth.slice';

const Authenticate = lazy(() => import('@/page/Authenticate'));
const Home = lazy(() => import('@/page/Home'));

type Props = {
  multiSelect?: boolean;
};

const AssetsPicker: FC<Props> = ({ multiSelect } : Props) => {
  const isAuthenticated = useAppSelector(authenticatedSelector);

  return (
    <Suspense fallback={<Loader />}>
      {isAuthenticated ? <Home multiSelect={multiSelect} /> : <Authenticate />}
    </Suspense>
  );
};

export default AssetsPicker;
