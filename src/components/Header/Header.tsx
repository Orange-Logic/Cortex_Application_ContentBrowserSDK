import { CSSProperties, FC, ReactNode, useContext, useMemo } from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { Folder } from '@/types/search';

import { Container } from './Header.styled';
import { UserInfo } from '@/types/user';

type Props = {
  bordered?: boolean;
  children?: ReactNode;
  currentFolder: Folder;
  isLoading?: boolean;
  isFetching?: boolean;
  userInfo?: UserInfo;
  showMenu?: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
};

const Header: FC<Props> = ({
  bordered,
  children,
  currentFolder,
  isLoading,
  isFetching,
  userInfo: data,
  showMenu,
  onMenuClick,
  onLogout,
}) => {
  const { isContentBrowserPopedup, pluginInfo, allowLogout } =
    useContext(GlobalConfigContext);
  const { onClose } = useContext(AppContext);

  const title = useMemo(() => {
    if (!currentFolder.fullPath) {
      return (
        <cx-line-clamp lines={1}>
          <cx-typography variant="h4">
            {pluginInfo.publicApplicationName}
          </cx-typography>
        </cx-line-clamp>
      );
    }

    return (
      <cx-space direction="horizontal" align-items="center" spacing="2x-small">
        <cx-typography variant="h4">{currentFolder.title}</cx-typography>
      </cx-space>
    );
  }, [
    currentFolder.fullPath,
    currentFolder.title,
    pluginInfo.publicApplicationName,
  ]);

  const Dropdown = useMemo(() => {
    if (isLoading || isFetching) {
      return <cx-skeleton></cx-skeleton>;
    }

    if (allowLogout) {
      return (
        <cx-dropdown distance={4}>
          <cx-avatar
            slot="trigger"
            className="header__user-avatar header__user-avatar--dropdown-trigger"
            label="User avatar"
            image={data?.avatar}
            loading="lazy"
          ></cx-avatar>
          <cx-menu>
            <cx-menu-item className="header__user-info" readonly>
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
    }

    return (
      <cx-avatar
        className="header__user-avatar"
        label="User avatar"
        image={data?.avatar}
        loading="lazy"
      ></cx-avatar>
    );
  }, [
    isLoading,
    isFetching,
    allowLogout,
    data?.avatar,
    data?.fullName,
    onLogout,
  ]);

  return (
    <Container direction="vertical" spacing="small" bordered={bordered}>
      <cx-space className="header" justify-content="space-between" align-items="center">
        <div className="header__title">
          <cx-space className="header" justify-content="space-between" align-items="center" spacing="x-small">
            {showMenu && (
              <cx-icon-button
                name="menu"
                label="Menu"
                onClick={onMenuClick}
              ></cx-icon-button>
            )}
            {title}
          </cx-space>
        </div>
        <div className="header__menu">
          {Dropdown}
          {isContentBrowserPopedup && (
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
