import { store } from '@/store';
import { MediaType } from '@/types/search';
import { Provider } from 'react-redux';
import FormatDialog from './FormatDialog';
import { useState } from 'react';

const FormatDialogProps = {
  allowCustomFormat: true,
  allowFavorites: true,
  allowProxy: true,
  onFavorite: () => Promise.resolve(true),
  onUnFavorite: () => Promise.resolve(true),
  availableProxies: [
    {
      proxyName: 'TRX',
      proxyLabel: 'Highest Quality',
      formatHeight: 0,
      formatWidth: 0,
      height: 0,
      width: 0,
      extension: null,
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/13u27iw28868i3705lkt7v6e053u54v4.png',
      cdnName: null,
      id: '9e1186ab-4827-4104-b9af-20b5c3796eaf',
    },
    {
      proxyName: 'TR7',
      proxyLabel: '192px fixed height',
      formatHeight: 192,
      formatWidth: 191,
      height: 192,
      width: 1024,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/u21h17h665g426601g4j766b33rup246.jpg',
      cdnName: null,
      id: '5dc3f48f-6a4f-45c0-b1b6-dba7886bb5ca',
    },
    {
      proxyName: 'TR4',
      proxyLabel: '352px fixed height',
      formatHeight: 352,
      formatWidth: 350,
      height: 352,
      width: 1280,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/56wfu58242s464d8y735k2iq8jt74iy7.jpg',
      cdnName: null,
      id: '7665fe6b-5e90-48d4-9768-175092913ec5',
    },
    {
      proxyName: 'TR1',
      proxyLabel: 'Medium res.',
      formatHeight: 530,
      formatWidth: 528,
      height: 1200,
      width: 1200,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/hcu03yv54125l5470q5kmjwfk2kdpj8v.jpg',
      cdnName: null,
      id: '3f48f5d3-9368-4637-841c-948836f6d0c3',
    },
    {
      proxyName: 'TR1_COMP',
      proxyLabel: 'Medium res. comp.',
      formatHeight: 530,
      formatWidth: 528,
      height: 600,
      width: 800,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/7f1f2a0qgai21q7p3hfm0k6g0l2sg801.jpg',
      cdnName: null,
      id: '4d62d873-f5d8-4483-9c2b-52205dee5b8e',
    },
    {
      proxyName: 'CMS1',
      proxyLabel: 'CMS 2000x2000',
      formatHeight: 530,
      formatWidth: 528,
      height: 2000,
      width: 2000,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/q323w22uehcn2o716ihy0o8jed5a3524.jpg',
      cdnName: null,
      id: 'edd20178-fe97-427f-a26d-0991cfa200e7',
    },
    {
      proxyName: 'CMS2',
      proxyLabel: 'CMS 1000x1000',
      formatHeight: 530,
      formatWidth: 528,
      height: 1000,
      width: 1000,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/dr0ft88dh61i2m6iw664yql7m245i876.jpg',
      cdnName: null,
      id: '3844792f-6bc9-4c85-a90d-a3e58ee0a74c',
    },
    {
      proxyName: 'CMS3',
      proxyLabel: 'CMS 500x500',
      formatHeight: 500,
      formatWidth: 498,
      height: 500,
      width: 500,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/yy5qhuweoc8086omlsjcku67yrwefwx4.jpg',
      cdnName: null,
      id: '178bdc2c-40f0-4c57-a765-dfa7aae8ac22',
    },
    {
      proxyName: 'CMS4',
      proxyLabel: 'CMS 250x250',
      formatHeight: 250,
      formatWidth: 249,
      height: 250,
      width: 250,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/14jofx06ocp665685m3nn6l8cae5m5p6.jpg',
      cdnName: null,
      id: 'cff4f571-6055-4bac-9f5e-c2d783afefed',
    },
    {
      proxyName: 'CMS5',
      proxyLabel: 'CMS 125x125',
      formatHeight: 125,
      formatWidth: 124,
      height: 125,
      width: 125,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/p0f221o8bi7hh47q7agr123r064608sf.jpg',
      cdnName: null,
      id: 'e01e5777-3b21-451c-baf5-1e2ea761e621',
    },
    {
      proxyName: 'TRAdmin3',
      proxyLabel: '570x570 (Doc management)',
      formatHeight: 530,
      formatWidth: 528,
      height: 570,
      width: 570,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/63i6gm0mdgn73m248jq840vv43j3y02t.jpg',
      cdnName: null,
      id: 'eda30284-c5a2-4f8e-962b-1df4e1ac521c',
    },
    {
      proxyName: 'TRAdmin6',
      proxyLabel: '265x265 (Doc management)',
      formatHeight: 265,
      formatWidth: 264,
      height: 265,
      width: 265,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/nij5uf8720ck5re16yl4iuti2kagb4b7.jpg',
      cdnName: null,
      id: 'e125288a-ff93-42af-81ba-59b1fe117880',
    },
    {
      proxyName: 'TRAdmin12',
      proxyLabel: '120x120 (Doc management)',
      formatHeight: 120,
      formatWidth: 119,
      height: 120,
      width: 120,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/kw2f1s8e27h58vddj2a32b7ob0717l64.jpg',
      cdnName: null,
      id: '41326fed-5ec6-4566-8f13-f6a4490eb274',
    },
    {
      proxyName: 'TRAdmin20',
      proxyLabel: '40x40 (Doc management)',
      formatHeight: 40,
      formatWidth: 39,
      height: 40,
      width: 40,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/1473kvs7iv452pl5ko54r5644ao4ljj1.jpg',
      cdnName: null,
      id: 'ce54e66a-5c78-49d6-98d0-a91262fbc505',
    },
    {
      proxyName: 'TEMP',
      proxyLabel: 'TEMP',
      formatHeight: 500,
      formatWidth: 498,
      height: 500,
      width: 500,
      extension: '.jpg',
      permanentLink:
        'https://cdn-qa-latest.orangelogic.com/AssetLink/y35nd1v61r234r07s6b1e4b28g705547.jpg',
      cdnName: null,
      id: '4e13ce05-5664-4a54-876f-f4400b64345a',
    },
  ],
  extensions: [
    '.jpg',
    '.jpeg',
    '.png',
    '.heif',
    '.dng',
    '.cr3',
    '.cr2',
    '.raf',
    '.arw',
    '.nef',
    '.dcr',
    '.raw',
    '.fff',
    '.rw2',
    '.iiq',
    '.orf',
    '.tif',
    '.tiff',
    '.svg',
    '.psd',
    '.ai',
    '.ps',
    '.eps',
  ],
  maxHeight: 900,
  searchInDrive: false,
  selectedAsset: {
    docType: MediaType.Image,
    docSubType: 'Standard Image',
    extension: '.png',
    height: '400',
    id: '2Y1FQEX9S35',
    identifier: 'X1UBRR',
    imageUrl: 'https://placehold.co/400x400/png',
    originalUrl: 'https://placehold.co/400x400/png',
    name: '006.png',
    scrubUrl: '',
    size: '141.18 KB',
    tags: '',
    width: '400',
    allowATSLink: true,
    recordId: 'Q0LDO000001895618',
  },
  onClose: () => {},
  onProxyConfirm: () => {},
  onFormatConfirm: () => {},
  onOpenInDriveConfirm: () => {},
  allowTracking: true,
  autoExtension: '.auto',
};

const FormatDialogWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <Provider store={store}>
      <FormatDialog {...FormatDialogProps} open={open} />
      <button onClick={() => setOpen((prev) => !prev)} data-cy="toggle-dialog">
        Toggle dialog
      </button>
    </Provider>
  );
};

describe('FormatDialog', () => {
  beforeEach(() => {
    cy.mount(<FormatDialogWrapper />);
    cy.waitForCustomElement('cx-dialog');
    cy.waitForCustomElement('cx-menu');
    cy.waitForCustomElement('cx-menu-item');
    cy.get('button[data-cy="toggle-dialog"]').click();
  });

  it('should render the format dialog', () => {
    cy.get('cx-dialog').should('exist');
  });

  it('should click the menu-item with value custom', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="crop"]').should('exist');
  });

  it('Should return to normal when click cancel of CustonRendition', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('.dialog__footer cx-button').eq(0).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').should('exist');
  });

  it('Should show CustomRendition checked when confirmed', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"] .proxy__name.selected').should(
      'exist',
    );
  });

  it('Should change activeSetting', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="rotate"]').click();
    cy.get('cx-details[data-value="rotate"]').should('have.attr', 'open');
  });

  it('Should show tracking inputs', () => {
    cy.get('.proxy--switch cx-switch').eq(0).click();
    cy.get('.dialog__tracking').should('exist');
  });

  it('Should change image size on crop', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="crop"]').should('exist');
    cy.get('cx-details[data-value="crop"]').click();
    cy.get('cx-details[data-value="crop"]')
      .find('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}200');

    cy.get('cx-details[data-value="crop"]').find('cx-button').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]')
      .find('.proxy__details')
      .should('contain', '200');
  });

  it('Should change image size on resize', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="resize"]').click();
    cy.get('cx-details[data-value="resize"]')
      .find('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}200');

    cy.get('cx-details[data-value="resize"]').find('cx-button').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]')
      .find('.proxy__details')
      .should('contain', '200');
  });

  it('Should change image size on rotate', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="rotate"]').click();
    cy.get('cx-details[data-value="rotate"]')
      .find('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}45');

    cy.get('cx-details[data-value="rotate"] cx-space > cx-button').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]')
      .find('.proxy__details')
      .should('contain', '566');
  });

  it('Should change image size unit on resize', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="resize"]').click();
    cy.get('cx-details[data-value="resize"]').find('cx-select').eq(0).click();
    cy.get('cx-details[data-value="resize"]').find('cx-option[value="aspect-ratio"]').click();
    cy.get('cx-details[data-value="resize"]')
      .find('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}2');

    cy.get('cx-details[data-value="resize"]').find('cx-button').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]')
      .find('.proxy__details')
      .should('contain', '400');
  });

  it('Should checked the selected proxy', () => {
    cy.get('cx-menu-item').eq(1).click();
    cy.get('cx-menu-item').eq(1).find('.proxy__name.selected').should('exist');
  });

  it('Should change image size unit on crop', () => {
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').click();
    cy.get('cx-details[data-value="crop"]').click();
    cy.get('cx-details[data-value="crop"]').find('cx-select').eq(1).click();
    cy.get('cx-details[data-value="crop"]').find('cx-option[value="aspect-ratio"]').click();
    cy.get('cx-details[data-value="crop"]')
      .find('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}2');

    cy.get('cx-details[data-value="crop"]').find('cx-button').click();
    cy.get('.dialog__footer cx-button').eq(1).click();
    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]')
      .find('.proxy__details')
      .should('contain', '400');
  });

  it('Should not render any proxy when no proxy is available', () => {
    const props = {
      ...FormatDialogProps,
      availableProxies: undefined,
    };
    cy.mount(
      <Provider store={store}>
        <FormatDialog {...props} open={true} />
      </Provider>,
    );

    cy.get('cx-menu').should('have.length', 2);
  });

  it('Should not render CustomRendition when not allowed', () => {
    const props = {
      ...FormatDialogProps,
      allowCustomFormat: false,
    };
    cy.mount(
      <Provider store={store}>
        <FormatDialog {...props} open={true} />
      </Provider>,
    );

    cy.get('cx-menu-item[data-cy="custom-rendition-menu-item"]').should('not.exist');
  });

  it('Should call onClose when Insert button is clicked', () => {
    const onClose = cy.stub().as('onClose');
    const props = {
      ...FormatDialogProps,
      onClose,
    };
    cy.mount(
      <Provider store={store}>
        <FormatDialog {...props} open={true} />
      </Provider>,
    );

    cy.get('.dialog__footer__button').eq(0).click();
    cy.get('@onClose').should('have.been.called');
  });

  it('Should call onClose when Close button is clicked', () => {
    const onClose = cy.stub().as('onClose');
    const props = {
      ...FormatDialogProps,
      availableProxies: undefined,
      onClose,
    };
    cy.mount(
      <Provider store={store}>
        <FormatDialog {...props} open={true} />
      </Provider>,
    );

    cy.get('cx-dialog').shadow().find('cx-icon-button').click();
    cy.get('@onClose').should('have.been.called');
  });
});
