/// <reference types="cypress" />

import { Provider } from 'react-redux';
import { store } from '@/store';

import Browser from './Browser';
import { Folder } from '@/types/search';
import { storeData } from '@/utils/storage';

const BrowserProps = {
  collectionPath: 'containers>>virtual folders',
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
  lastLocationMode: true,
  open: true,
  showCollections: true,
  useSession: 'qqqqqq',
};

const folderData = [
  {
    recordID: '2Y1FQECIK0',
    fields: {
      'CoreField.TitleWithFallback': 'Library',
      'CoreField.DocType': 'Story',
      'Document.CortexPath': 'Root/Library',
      'Document.HasBrowserChildren': '1',
      AllowATSLink: 'False',
    },
  },
  {
    recordID: '2Y1FQECZA6',
    fields: {
      'CoreField.TitleWithFallback': 'Personal Folders',
      'CoreField.DocType': 'Story',
      'Document.CortexPath': 'Root/Personal Folders',
      'Document.HasBrowserChildren': '1',
      AllowATSLink: 'False',
    },
  },
  {
    recordID: '2Y1FQEZH3T',
    fields: {
      'CoreField.TitleWithFallback': 'Database',
      'CoreField.DocType': 'Story',
      'Document.CortexPath': 'Root/Database',
      'Document.HasBrowserChildren': '1',
      AllowATSLink: 'False',
    },
  },
  {
    recordID: '2Y1FQEF3LZ',
    fields: {
      'CoreField.TitleWithFallback': 'Site',
      'CoreField.DocType': 'Story',
      'Document.CortexPath': 'Root/Site',
      'Document.HasBrowserChildren': '1',
      AllowATSLink: 'False',
    },
  },
  {
    recordID: '2Y1FQEK3DZ',
    fields: {
      'CoreField.TitleWithFallback': 'System Bin',
      'CoreField.DocType': 'Story',
      'Document.CortexPath': 'Root/System Bin',
      'Document.HasBrowserChildren': '0',
      AllowATSLink: 'False',
    },
  },
];

const BrowserWrapper = ({
  lastLocationMode,
  onFolderSelect,
}: {
  onFolderSelect?: (selectedFolder: Folder) => void;
  lastLocationMode?: boolean;
}) => {
  const props = { ...BrowserProps };
  if (lastLocationMode !== undefined) {
    props.lastLocationMode = lastLocationMode;
  }
  return (
    <Provider store={store}>
      <Browser {...props} onFolderSelect={onFolderSelect || (() => {})} onClose={() => {}} onChangePersistent={() => {}} />
    </Provider>
  );
};

describe('Browser', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/webapi/extensibility/integrations/gab/assetbrowser/gethierarchy_41e8*',
      (req) => {
        const url = new URL(req.url);
        const objectRecordIDs = url.searchParams.getAll('ObjectRecordIDs');
        const searchText = url.searchParams.get('Text');
        if (objectRecordIDs.length > 0) {
          req.reply({
            body: {
              contentItems: [
                {
                  recordID: '2Y1FQEX9IB9',
                  fields: {
                    'CoreField.TitleWithFallback': 'Images',
                    'CoreField.DocType': 'Story',
                    'Document.CortexPath': 'Root/Library/Images',
                    'Document.HasBrowserChildren': '0',
                    AllowATSLink: 'False',
                  },
                },
                {
                  recordID: '2Y1FQEYV03',
                  fields: {
                    'CoreField.TitleWithFallback': 'Contact photos',
                    'CoreField.DocType': 'Story',
                    'Document.CortexPath': 'Root/Library/Contact photos',
                    'Document.HasBrowserChildren': '0',
                    AllowATSLink: 'False',
                  },
                },
                {
                  recordID: '2Y1FQEQANQ9',
                  fields: {
                    'CoreField.TitleWithFallback': 'Items without primary links',
                    'CoreField.DocType': 'Story',
                    'Document.CortexPath': 'Root/Library/Items without primary links',
                    'Document.HasBrowserChildren': '1',
                    AllowATSLink: 'False',
                  },
                },
              ],
            },
            delay: 100,
          });
        } else if (searchText) {
          if (searchText === 'Lib') {
            req.reply({
              body: {
                contentItems: [
                  {
                    recordID: '2Y1FQECIK0',
                    fields: {
                      'CoreField.TitleWithFallback': 'Library',
                      'CoreField.DocType': 'Story',
                      'Document.CortexPath': 'Root/Library',
                      'Document.HasBrowserChildren': '1',
                      AllowATSLink: 'False',
                    },
                  },
                ],
              },
              delay: 100,
            });
          } else {
            req.reply({
              body: {
                contentItems: [],
              },
              delay: 100,
            });
          }
        } else {
          req.reply({
            body: {
              contentItems: folderData,
            },
            delay: 100,
          });
        }
      },
    ).as('getFolders');
  });

  it('Should render the browser with correct number of items', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-tree-item').should('have.length', folderData.length);
  });

  it('Should expand', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);
    // Wait for custom elements to be defined and rendered
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-tree-item').eq(0).should('be.visible');
    cy.get('cx-tree-item').eq(0).shadow().find('[part="expand-button"]').click();
    cy.get('cx-tree-item').eq(0).find('cx-tree-item').should('have.length', 3);
  });

  it('Should collapse', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-tree-item').eq(0).shadow().find('[part="expand-button"]').click();
    cy.get('cx-tree-item').eq(0).shadow().find('[part="expand-button"]').click();
    cy.get('cx-tree-item').eq(0).should('not.have.attr', 'expanded');
  });

  it('Should show search results', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-input').shadow().find('input').type('Lib');
    cy.get('cx-tree-item').should('have.length', 1);
  });

  it('Should show no search results', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-input').shadow().find('input').type('non-existing-folder');
    cy.get('cx-tree-item').should('have.length', 0);
  });

  it('Should reset the search results', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-input').shadow().find('input').type('Lib');
    cy.get('cx-tree-item').should('have.length', 1);
    cy.get('cx-input').shadow().find('input').clear();
    cy.get('cx-tree-item').should('have.length', folderData.length);
  });

  it('Should close the browser', () => {
    cy.mount(<BrowserWrapper></BrowserWrapper>);

    cy.get('cx-drawer').shadow().find('cx-icon-button').click();
    cy.get('cx-drawer').should('not.have.attr', 'open');
  });

  it('Should select default folder when localStorage data is invalid', () => {
    storeData('lastLocation', 'hello');
    cy.mount(<BrowserWrapper></BrowserWrapper>);
    cy.get('cx-tree-item').should('have.length', folderData.length);
    cy.get('cx-tree-item').eq(0).should('have.attr', 'selected');
  });

  it('Should select default folder when localStorage data is not found', () => {
    storeData(
      'lastLocation',
      JSON.stringify({
        id: 'some-random-id',
      }),
    );
    cy.mount(<BrowserWrapper></BrowserWrapper>);
    cy.get('cx-tree-item').should('have.length', folderData.length);
    cy.get('cx-tree-item').eq(0).should('have.attr', 'selected');
  });

  it('Should select correct folder when localStorage data is valid', () => {
    storeData(
      'lastLocation',
      JSON.stringify({
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
      }),
    );
    cy.mount(<BrowserWrapper></BrowserWrapper>);
    cy.get('cx-tree-item').should('have.length', folderData.length);
    cy.get('cx-tree-item').eq(0).should('have.attr', 'selected');
  });

  it('Should render default folder when lastLocationMode is false', () => {
    cy.mount(<BrowserWrapper lastLocationMode={false}></BrowserWrapper>);
    cy.get('cx-tree-item').should('have.length', folderData.length);
    cy.get('cx-tree-item').eq(0).should('have.attr', 'selected');
  });

  it('Should call onFolderSelect when a folder is selected', () => {
    const onFolderSelect = cy.stub().as('onFolderSelect');
    cy.mount(<BrowserWrapper onFolderSelect={onFolderSelect}></BrowserWrapper>);

    cy.get('cx-tree-item').eq(2).click();

    cy.get('@onFolderSelect').should('have.been.called');
  });
});
