import { CSSProperties, FC, ReactNode, useContext, useEffect, useMemo } from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useGetUserInfoQuery } from '@/store/user/user.api';
import { Folder } from '@/types/search';

import { Container } from './Header.styled';

type Props = {
  authenticated: boolean;
  bordered?: boolean;
  children?: ReactNode;
  currentFolder: Folder;
  onMenuClick: () => void;
  onLogout: () => void;
};

const Header: FC<Props> = ({
  authenticated,
  bordered,
  children,
  currentFolder,
  onMenuClick,
  onLogout,
}) => {
  const { isGABPopedup, pluginInfo } = useContext(GlobalConfigContext);
  const { onClose } = useContext(AppContext);
  const { data, isFetching, isLoading, refetch: refetchUserInfo } = useGetUserInfoQuery({});

  useEffect(() => {
    if (authenticated) {
      refetchUserInfo();
    }
  }, [authenticated, refetchUserInfo]);

  const title = useMemo(() => {
    if (!currentFolder.fullPath) {
      return (
        <cx-line-clamp lines={1}>
          <cx-typography variant="h4">{pluginInfo.pluginName ?? 'Generic Asset Browser'}</cx-typography>
        </cx-line-clamp>
      );
    }

    return (
      <cx-space direction="horizontal" align-items="center" spacing="2x-small">
        <cx-typography variant="h4">{currentFolder.title}</cx-typography>
      </cx-space>
    );
  }, [currentFolder.fullPath, currentFolder.title, pluginInfo.pluginName]);

  const Dropdown = useMemo(() => {
    return isLoading || isFetching ? (
      <cx-skeleton></cx-skeleton>
    ) : (
      <cx-dropdown distance={4}>
        <cx-avatar
          slot="trigger"
          label="User avatar"
          image={data?.avatar}
          loading="lazy"
        ></cx-avatar>
        <cx-menu>
          <cx-menu-item>
            {data?.fullName}
            <cx-avatar
              slot="prefix"
              label="User avatar"
              image={data?.avatar}
              loading="lazy"
              style={
                {
                  '--size': 'var(--cx-font-size-x-large)',
                } as CSSProperties
              }
            ></cx-avatar>
          </cx-menu-item>
          <cx-divider></cx-divider>
          <cx-menu-item value="logout" onClick={onLogout}>
            Logout
            <cx-icon slot="prefix" name="logout"></cx-icon>
          </cx-menu-item>
        </cx-menu>
      </cx-dropdown>
    );
  }, [isLoading, isFetching, data?.avatar, data?.fullName, onLogout]);

  return (
    <Container direction="vertical" spacing="small" bordered={bordered}>
      <cx-space className="header" justify-content="space-between" align-items="center">
        <div className="header__title">
          <cx-space className="header" justify-content="space-between" align-items="center" spacing="x-small">
            <cx-icon-button
              name="menu"
              label="Menu"
              onClick={onMenuClick}
            ></cx-icon-button>
            {title}
          </cx-space>
        </div>
        <div className="header__menu">
          {Dropdown}
          {isGABPopedup && (
            <cx-icon-button
              name="close"
              label="Close"
              onClick={onClose}
            ></cx-icon-button>
          )}
        </div>
      </cx-space>
      {children}
    </Container>
  );
};

export default Header;
