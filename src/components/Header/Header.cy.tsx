/// <reference types="cypress" />

import { Provider } from 'react-redux';
import { store } from '@/store';

import Header from './Header';
import { GlobalConfigContext } from '@/GlobalConfigContext';

const headerProps = {
  authenticated: true,
  bordered: true,
  currentFolder: {
    id: '2Y1FQECIK0',
    title: 'Library',
    docType: 'Story',
    path: [''],
    fullPath: 'Library',
    parents: [
      {
        id: '',
        title: '',
        docType: 'Story',
        path: [],
        parents: [],
        fullPath: '',
        hasChildren: true,
      },
    ],
    hasChildren: true,
  },
  onMenuClick: () => {},
  onLogout: () => {},
};

describe('Header', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/webapi/extensibility/integrations/gab/authorization/getuserinfo_4bs_v1*',
      (req) => {
        req.reply({
          body: {
            avatar: '',
            email: 'khoa.le@orangelogic.com',
            loginID: 'khoa.le@orangelogic.com',
            fullName: 'Khoa Le',
            recordID: null,
          },
          delay: 500,
        });
      },
    );
  });

  it('Should display the title of the selected folder', () => {
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowProxy: true,
          allowFavorites: true,
          availableDocTypes: [],
          availableRepresentativeSubtypes: [],
          ctaText: 'Insert',
          persistMode: false,
          displayInfo: {
            title: true,
            dimension: true,
            fileSize: true,
            tags: true,
          },
          pluginInfo: {
            publicApplicationName: 'Content Browser',
          },
          showCollections: false,
          isContentBrowserPopedup: false,
          allowTracking: true,
        }}>
        <Provider store={store}>
          <Header {...headerProps} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('.header__title').should('exist');
    cy.get('.header__title').should('contain', 'Library');
  });

  it('Should display the title of default folder', () => {
    const currentFolder = {
      ...headerProps.currentFolder,
      fullPath: '',
    };

    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowProxy: true,
          allowFavorites: true,
          availableDocTypes: [],
          availableRepresentativeSubtypes: [],
          ctaText: 'Insert',
          persistMode: false,
          displayInfo: {
            title: true,
            dimension: true,
            fileSize: true,
            tags: true,
          },
          pluginInfo: {
            publicApplicationName: 'Content Browser',
          },
          showCollections: false,
          isContentBrowserPopedup: false,
          allowTracking: true,
        }}>
        <Provider store={store}>
          <Header {...headerProps} currentFolder={currentFolder} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('.header__title').should('exist');
    cy.get('.header__title').should('contain', 'Content Browser');
  });

  it('Should display close icon', () => {
    cy.mount(
        <GlobalConfigContext.Provider
          value={{
            allowProxy: true,
            allowFavorites: true,
            availableDocTypes: [],
            availableRepresentativeSubtypes: [],
            ctaText: 'Insert',
            persistMode: false,
            displayInfo: {
              title: true,
              dimension: true,
              fileSize: true,
              tags: true,
            },
            pluginInfo: {},
            showCollections: false,
            isContentBrowserPopedup: true,
            allowTracking: true,
          }}>
        <Provider store={store}>
          <Header {...headerProps} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('.header__menu').find('cx-icon-button').should('exist');
  });
});
