/// <reference types="cypress" />

import { Provider } from 'react-redux';
import { store } from '@/store';
import VersionHistory from './VersionHistory';

// Mock version history data (raw server response format)
const mockVersionHistoryData = {
  count: 3,
  versions: [
    {
      VersionNumber: '3',
      VersionNumberDisplay: 'v3',
      VersionFileName: 'image_v3.jpg',
      PreviewUrl: 'https://example.com/image_v3.jpg',
      ScrubUrl: '',
      CreateByEmail: 'user@example.com',
      VersionCreateDate: '2024-01-15 10:30:00',
      VersionID: 'version_3',
    },
    {
      VersionNumber: '2',
      VersionNumberDisplay: 'v2',
      VersionFileName: 'image_v2.jpg',
      PreviewUrl: 'https://example.com/image_v2.jpg',
      ScrubUrl: '',
      CreateByEmail: 'user@example.com',
      VersionCreateDate: '2024-01-10 09:15:00',
      VersionID: 'version_2',
    },
    {
      VersionNumber: '1',
      VersionNumberDisplay: 'v1',
      VersionFileName: 'image_v1.jpg',
      PreviewUrl: 'https://example.com/image_v1.jpg',
      ScrubUrl: '',
      CreateByEmail: 'user@example.com',
      VersionCreateDate: '2024-01-05 14:20:00',
      VersionID: 'version_1',
    },
  ],
};

// Mock version history data with video
const mockVersionHistoryWithVideo = {
  count: 2,
  versions: [
    {
      VersionNumber: '2',
      VersionNumberDisplay: 'v2',
      VersionFileName: 'video_v2.mp4',
      PreviewUrl: 'https://example.com/video_v2.mp4',
      ScrubUrl: 'https://example.com/video_v2_scrub.mp4',
      CreateByEmail: 'user@example.com',
      VersionCreateDate: '2024-01-15 10:30:00',
      VersionID: 'video_version_2',
    },
    {
      VersionNumber: '1',
      VersionNumberDisplay: 'v1',
      VersionFileName: 'video_v1.mp4',
      PreviewUrl: 'https://example.com/video_v1.mp4',
      ScrubUrl: '',
      CreateByEmail: 'user@example.com',
      VersionCreateDate: '2024-01-10 09:15:00',
      VersionID: 'video_version_1',
    },
  ],
};

describe('VersionHistory', () => {
  beforeEach(() => {
    // Intercept the version history API call
    cy.intercept('GET', '/webapi/extensibility/integrations/contentBrowserSDK/getassetversion_418f*', { body: mockVersionHistoryData }).as('getVersionHistory');
  });

  const waitForVersionHistoryElements = () => {
    cy.waitForCustomElement('cx-menu');
    cy.waitForCustomElement('cx-menu-item');
    cy.waitForCustomElement('cx-grid');
    cy.waitForCustomElement('cx-grid-item');
    cy.waitForCustomElement('cx-space');
    cy.waitForCustomElement('cx-line-clamp');
    cy.waitForCustomElement('cx-typography');
  };

  it('should render loading spinner when fetching data', () => {
    // Delay the API response to show loading state
    cy.intercept('GET', '/webapi/extensibility/integrations/contentBrowserSDK/getassetversion_418f*', { delay: 1000, body: mockVersionHistoryData }).as('delayedVersionHistory');

    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-asset-id" />
      </Provider>,
    );

    cy.get('cx-spinner').should('be.visible');
  });

  it('should render version history items when data is loaded', () => {
    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-asset-id" />
      </Provider>,
    );

    cy.wait('@getVersionHistory');
    waitForVersionHistoryElements();

    // Should render 3 version items
    cy.get('cx-menu-item.version__item').should('have.length', 3);

    // Check first item (latest/current version)
    cy.get('cx-menu-item.version__item').first().within(() => {
      cy.contains('v3').should('be.visible');
      cy.contains('image_v3.jpg').should('be.visible');
      cy.contains('user@example.com').should('be.visible');
      cy.contains('2024-01-15').should('be.visible');
      cy.contains('Current version').should('be.visible');
      // Check that img element exists (src attribute may not be set in test environment)
      cy.get('img').should('exist');
    });

    // Check second item (not current version)
    cy.get('cx-menu-item.version__item').eq(1).within(() => {
      cy.contains('v2').should('be.visible');
      cy.contains('image_v2.jpg').should('be.visible');
      cy.contains('user@example.com').should('be.visible');
      cy.contains('2024-01-10').should('be.visible');
      cy.contains('Current version').should('not.exist');
    });

    // Check third item (oldest version)
    cy.get('cx-menu-item.version__item').eq(2).within(() => {
      cy.contains('v1').should('be.visible');
      cy.contains('image_v1.jpg').should('be.visible');
      cy.contains('2024-01-05').should('be.visible');
    });
  });

  it('should render video elements when scrubUrl is present', () => {
    cy.intercept('GET', '/webapi/extensibility/integrations/contentBrowserSDK/getassetversion_418f*', { body: mockVersionHistoryWithVideo }).as('getVideoVersionHistory');

    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-video-id" />
      </Provider>,
    );

    cy.wait('@getVideoVersionHistory');
    waitForVersionHistoryElements();

    // First item should have video (scrubUrl present)
    cy.get('cx-menu-item.version__item').first().within(() => {
      cy.get('video').should('exist');
      cy.get('video').should('have.attr', 'src', 'https://example.com/video_v2_scrub.mp4');
      cy.get('video').should('have.attr', 'controls');
    });

    // Second item should have image (no scrubUrl)
    cy.get('cx-menu-item.version__item').eq(1).within(() => {
      cy.get('img').should('exist');
      cy.get('video').should('not.exist');
    });
  });

  it('should handle image orientation correctly', () => {
    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-asset-id" />
      </Provider>,
    );

    cy.wait('@getVersionHistory');
    waitForVersionHistoryElements();

    // Images should have proper classes for orientation handling
    cy.get('.version__item__preview').should('exist');
    cy.get('.version__item__preview--horizontal').should('exist');
  });

  it('should not make API call when assetId is not provided', () => {
    cy.mount(
      <Provider store={store}>
        <VersionHistory />
      </Provider>,
    );

    // Should not make any API calls
    cy.get('@getVersionHistory.all').should('have.length', 0);

    // Should render container
    cy.get('div').should('exist');
  });

  it('should display version numbers correctly', () => {
    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-asset-id" />
      </Provider>,
    );

    cy.wait('@getVersionHistory');
    waitForVersionHistoryElements();

    // Check version number badges
    cy.get('.version__item__number').should('have.length', 3);
    cy.get('.version__item__number').first().should('contain', 'v3');
    cy.get('.version__item__number').eq(1).should('contain', 'v2');
    cy.get('.version__item__number').eq(2).should('contain', 'v1');
  });

  it('should truncate long filenames', () => {
    const mockLongFilename = {
      count: 1,
      versions: [
        {
          VersionNumber: '1',
          VersionNumberDisplay: 'v1',
          VersionFileName: 'very_long_filename_that_should_be_truncated_in_the_ui.jpg',
          PreviewUrl: 'https://example.com/long_filename.jpg',
          ScrubUrl: '',
          CreateByEmail: 'user@example.com',
          VersionCreateDate: '2024-01-05 14:20:00',
          VersionID: 'long_filename_version',
        },
      ],
    };

    cy.intercept('GET', '/webapi/extensibility/integrations/contentBrowserSDK/getassetversion_418f*', { body: mockLongFilename }).as('getLongFilenameVersionHistory');

    cy.mount(
      <Provider store={store}>
        <VersionHistory assetId="test-asset-id" />
      </Provider>,
    );

    cy.wait('@getLongFilenameVersionHistory');
    waitForVersionHistoryElements();

    // Should use line-clamp for long filenames
    cy.get('cx-line-clamp').should('contain', 'very_long_filename_that_should_be_truncated_in_the_ui.jpg');
  });
});
