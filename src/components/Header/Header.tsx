import { CSSProperties, useContext, useMemo, ReactNode, FC } from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useGetUserInfoQuery } from '@/store/user/user.api';

import { Container } from './Header.styled';

type Props = {
  bordered?: boolean;
  children?: ReactNode;
  onMenuClick: () => void;
  onLogout: () => void;
};

const Header: FC<Props> = ({ bordered, children, onMenuClick, onLogout }) => {
  const { isGABPopedup } = useContext(GlobalConfigContext);
  const { onClose } = useContext(AppContext);
  const { data, isFetching, isLoading } = useGetUserInfoQuery({});
  
  const Dropdown = useMemo(() => {
    return isLoading || isFetching ? (
        <cx-skeleton></cx-skeleton>
    ) : (
      <cx-dropdown distance={4}>
        <cx-avatar slot="trigger" label="User avatar"></cx-avatar>
        <cx-menu>
          <cx-menu-item>
            {data?.fullName}
            <cx-avatar
              slot="prefix"
              label="User avatar"
              style={{
                '--size': 'var(--cx-font-size-x-large)',
              } as CSSProperties}>
            </cx-avatar>
          </cx-menu-item>
          <cx-divider></cx-divider>
          <cx-menu-item value="logout" onClick={onLogout}>
            Logout
            <cx-icon slot="prefix" name="logout"></cx-icon>
          </cx-menu-item>
        </cx-menu>
      </cx-dropdown>
    );
  }, [isLoading, isFetching, data?.fullName, onLogout]);

  return (
    <Container direction="vertical" spacing="small" bordered={bordered}>
      <div className="header">
        <div className="header__title">
          <cx-icon-button
            name="menu"
            label="Menu"
            onClick={onMenuClick}
          ></cx-icon-button>
          <cx-typography variant="h4">Library</cx-typography>
        </div>
        <div className="header__menu">
          {Dropdown}
          {isGABPopedup && (
            <cx-icon-button name="close" label="Close" onClick={onClose}></cx-icon-button>
          )}
        </div>
      </div>
      {children}
    </Container>
  );
};

export default Header;
