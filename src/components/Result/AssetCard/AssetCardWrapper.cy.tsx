import { GlobalConfigContext } from '@/GlobalConfigContext';
import { store } from '@/store';
import { GridView, MediaType } from '@/types/search';
import { Provider } from 'react-redux';
import AssetCardWrapper from './AssetCardWrapper';

const AssetCardWrapperProps = {
  hasNextPage: false,
  height: 800,
  items: [
    {
      docType: MediaType.Image,
      docSubType: 'Standard Image',
      extension: 'png',
      height: '400',
      id: '2Y1FQEX9S35',
      identifier: 'X1UBRR',
      name: '006.png',
      scrubUrl: '',
      size: '141.18 KB',
      tags: 'Tag1,Tag2',
      width: '400',
      allowATSLink: true,
      imageUrl: 'https://placehold.co/400x400/png',
      originalUrl: 'https://placehold.co/400x400/png',
    },
    {
      docType: MediaType.Video,
      docSubType: 'Standard Video',
      extension: 'mp4',
      height: '400',
      id: '2Y1FQEX9S35',
      identifier: 'X1UBRR',
      name: '006.png',
      scrubUrl: '',
      size: '141.18 KB',
      tags: 'Tag1,Tag2',
      width: '400',
      allowATSLink: true,
      imageUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      originalUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
  isError: false,
  isLoadingData: false,
  view: GridView.Large,
  width: 1000,
  onItemSelect: () => {},
  onLoadMore: () => {},
  onScroll: () => {},
  selectedAsset: null,
};

describe('AssetCardWrapper', () => {
  it('Should render 2 items', () => {
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowFavorites: true,
          allowProxy: true,
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
          allowTracking: true,
          isContentBrowserPopedup: false,
        }}>
        <Provider store={store}>
          <AssetCardWrapper {...AssetCardWrapperProps} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );

    cy.get('cx-card').should('have.length', 2);
  });

  it('Should render No results message', () => {
    const props = { ...AssetCardWrapperProps, items: [] };
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowFavorites: true,
          allowProxy: true,
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
          allowTracking: true,
          isContentBrowserPopedup: false,
          showCollections: false,
        }}>
        <Provider store={store}>
          <AssetCardWrapper {...props} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('.wrapper__content__empty').should('exist');
  });

  it('Should render error message', () => {
    const props = { ...AssetCardWrapperProps, isError: true, isFetched: true };
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowFavorites: true,
          allowProxy: true,
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
          allowTracking: true,
          isContentBrowserPopedup: false,
          showCollections: false,
        }}>
        <Provider store={store}>
          <AssetCardWrapper {...props} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('div').should('contain', 'Something went wrong. Please try again later.');
  });

  it('Should render selected asset', () => {
    const props = { ...AssetCardWrapperProps, selectedAsset: AssetCardWrapperProps.items[0] };
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowFavorites: true,
          allowProxy: true,
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
          allowTracking: true,
          isContentBrowserPopedup: false,
          showCollections: false,
        }}>
        <Provider store={store}>
          <AssetCardWrapper {...props} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.get('cx-card').find('.asset-card__checkbox').should('exist');
  });

  it('Should emit select event', () => {
    const props = { ...AssetCardWrapperProps, selectedAsset: AssetCardWrapperProps.items[0] };
    const onItemSelect = cy.stub().as('onItemSelect');
    cy.mount(
      <GlobalConfigContext.Provider
        value={{
          allowFavorites: true,
          allowProxy: true,
          availableDocTypes: [],
          availableRepresentativeSubtypes: [],
          ctaText: 'Insert',
          persistMode: false,
          displayInfo: {
            title: true,
            dimension: false,
            fileSize: true,
            tags: true,
          },
          pluginInfo: {},
          allowTracking: true,
          isContentBrowserPopedup: false,
          showCollections: false,
        }}>
        <Provider store={store}>
          <AssetCardWrapper {...props} onItemSelect={onItemSelect} />
        </Provider>
      </GlobalConfigContext.Provider>,
    );
    cy.wait(300); // Wait for the component to render
    cy.get('cx-card').eq(0).trigger('click');
    cy.get('@onItemSelect').should('have.been.calledWith', props.items[0]);
  });
});
