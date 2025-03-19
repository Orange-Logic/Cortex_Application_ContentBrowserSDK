import { CSSProperties, FC, MouseEventHandler, ReactNode, useCallback, useContext, useMemo } from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useGetUserInfoQuery } from '@/store/user/user.api';
import { Folder } from '@/types/search';

import { Container } from './Header.styled';
import { CxBreadcrumbItem } from '@/web-component';

type Props = {
  bordered?: boolean;
  children?: ReactNode;
  currentFolder: Folder;
  onFolderSelect?: (folder: Folder) => void;
  onMenuClick: () => void;
  onLogout: () => void;
};

const Header: FC<Props> = ({ bordered, children, currentFolder, onFolderSelect, onMenuClick, onLogout }) => {
  const { isGABPopedup } = useContext(GlobalConfigContext);
  const { onClose } = useContext(AppContext);
  const { data, isFetching, isLoading } = useGetUserInfoQuery({});

  const onBreadcrumbItemClick: MouseEventHandler<CxBreadcrumbItem> = useCallback((e) => {
    const value = (e.target as HTMLElement).dataset.value;
    if (value && onFolderSelect) {
      onFolderSelect(JSON.parse(value));
    }
  }, [onFolderSelect]);

  const title = useMemo(() => {
    if (!currentFolder.fullPath) {
      return <cx-typography variant="h4">Generic Asset Browser</cx-typography>;
    }

    return (
      <cx-breadcrumb>
        <span slot="separator">/</span>
        {[...currentFolder.parents, currentFolder].map((folder) => {
          const value = JSON.stringify(folder);
          return (
            <cx-breadcrumb-item
              key={folder.title}
              className="header__title__content"
              data-value={value}
              onClick={onBreadcrumbItemClick}
            >
              {folder.title || 'Root'}
            </cx-breadcrumb-item>
          );
        })}
      </cx-breadcrumb>
    );
  }, [currentFolder, onBreadcrumbItemClick]);

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
      <div className="header">
        <div className="header__title">
          <cx-icon-button
            name="menu"
            label="Menu"
            onClick={onMenuClick}
          ></cx-icon-button>
          {title}
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
