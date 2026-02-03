/// <reference types="cypress" />
import { store } from '@/store';
import { Provider } from 'react-redux';
import {
  generateNonce,
  setAuthStatus,
  setSiteUrl,
} from '@/store/auth/auth.slice';
import Authenticate from './';

const SITE_URL = 'https://example.com/';

const AuthenticateWrapper = () => (
  <Provider store={store}>
    <Authenticate />
  </Provider>
);

const dispatchWaitForAuthorize = () => {
  store.dispatch(setSiteUrl(SITE_URL));
  store.dispatch(generateNonce());
  store.dispatch(setAuthStatus('waitForAuthorize'));
};

describe('Authenticate', () => {
  beforeEach(() => {
    cy.mount(<AuthenticateWrapper />);
    cy.waitForCustomElement('cx-input');
  });
  it('renders Authenticate component', () => {
    cy.get('cx-input').should('exist');
  });

  it('enables the Connect button when the site URL is valid', () => {
    cy.get('cx-input').shadow().find('input').type('https://example.com/');
    cy.get('cx-button').should('not.have.attr', 'disabled');
  });

  it('shows waiting for authorization screen', () => {
    dispatchWaitForAuthorize();
    cy.mount(<AuthenticateWrapper />);
    cy.get('cx-typography', { timeout: 5000 }).contains('Please authorize').should('exist');
    cy.get('cx-button').eq(0).click();
  });

  it('shows error for invalid url', () => {
    cy.intercept('GET', '**/Include/ImageUsedToCheckSiteAvailabilityFromBrowser.gif', {
      statusCode: 404,
    });
    cy.get('cx-input').shadow().find('input').type('https://invalid-site.example/');
    cy.get('[data-cy="submit-button"]').click();
    cy.contains('Retry').click();
  });

  it('shows the second input after clicking the hidden button 5 times', () => {
    const hiddenBox = cy.get('button');
    for (let i = 0; i < 5; i++) {
      hiddenBox.click();
    }
    cy.get('cx-input').eq(1).should('exist');
  });

  it('does not show the second input if the hidden button is not clicked 5 times in 2 seconds', () => {
    const hiddenBox = cy.get('button');
    for (let i = 0; i < 4; i++) {
      hiddenBox.click();
    }
    cy.wait(2000); // wait for 2 seconds
    cy.get('cx-input').should('have.length', 1);
    cy.get('cx-input').eq(1).should('not.exist');
  });

  it('requests authentication with session', () => {
    dispatchWaitForAuthorize();
    cy.mount(<AuthenticateWrapper />);
    cy.get('cx-typography', { timeout: 5000 }).contains('Please authorize').should('exist');
  });
});
