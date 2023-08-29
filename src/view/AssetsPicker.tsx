import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { authenticatedSelector } from '../store/auth/auth.slice';
import Loader from '../components/Loader/Loader';

const Authenticate = lazy(() => import('../page/Authenticate'));
const HomePage = lazy(() => import('../page/Home/Home'));

type AssetsPickerProps = {
  handleClose: () => void;
  multiSelect?: boolean;
};

const AssetsPicker = ({ handleClose, multiSelect } : AssetsPickerProps) => {
  const isAuthenticated = useSelector(authenticatedSelector);
  return (
    <Suspense fallback={<Loader />}>
      {isAuthenticated ? <HomePage handleClose={handleClose} multiSelect={multiSelect}/> : <Authenticate />}
    </Suspense>
  );
};

export default AssetsPicker;
