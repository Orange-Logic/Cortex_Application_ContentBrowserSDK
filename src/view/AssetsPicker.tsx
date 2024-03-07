import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader/Loader';
import LoaderProvider from '../components/Loader/LoaderWrapper';
import { useAppSelector } from '../store';
import { authenticatedSelector } from '../store/auth/auth.slice';
import { selectCurrentPage } from '../store/navigation/navigation.slice';

const Authenticate = lazy(() => import('../page/Authenticate'));
const HomePage = lazy(() => import('../page/Home'));
const SettingsPage  = lazy(() => import('../page/Settings'));

type AssetsPickerProps = {
  multiSelect?: boolean;
};

const AssetsPicker = ({ multiSelect } : AssetsPickerProps) => {
  const isAuthenticated = useSelector(authenticatedSelector);
  const currentPage = useAppSelector(selectCurrentPage);

  return (
    <LoaderProvider>
      <Suspense fallback={<Loader />}>
        {
          currentPage === 'home'
            ? (isAuthenticated ? <HomePage multiSelect={multiSelect}/> : <Authenticate />)
            : <SettingsPage />
        }
      </Suspense>
    </LoaderProvider>
  );
};

export default AssetsPicker;
