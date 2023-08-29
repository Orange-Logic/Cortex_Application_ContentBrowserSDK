import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  isLoaderMessageSelector,
  isLoadingSelector,
} from '../../store/loader/loader.slice';
import Loader from './Loader';

type LoaderContextType = {
  setCustomAction: (action: React.ReactNode) => void;
};

type LoaderProps = {
  children?: React.ReactNode;
};

export const LoaderContext = createContext<LoaderContextType>({
  setCustomAction: () => {},
});

export const LoaderProvider = ({ children }: LoaderProps) => {
  const isLoading = useSelector(isLoadingSelector);
  const message = useSelector(isLoaderMessageSelector);
  const [customAction, setCustomAction] = useState<React.ReactNode>();

  useEffect(() => {
    if (!isLoading) {
      setCustomAction(null);
    }
  }, [isLoading]);

  return (
    <LoaderContext.Provider value={{ setCustomAction }}>
      {isLoading ? <Loader message={message}>{customAction}</Loader> : children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
