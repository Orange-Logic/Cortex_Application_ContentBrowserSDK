/// <reference types="cypress" />
import { store } from '@/store';
import { Provider } from 'react-redux';
import Authenticate from './';

const AuthenticateWrapper = () => {
  return (
    <Provider store={store}>
      <Authenticate />
    </Provider>
  );
};

describe('Authenticate', () => {
  beforeEach(() => {
    cy.mount(<AuthenticateWrapper />);
    cy.waitForCustomElement('cx-input');
  });
  it('Should render Authenticate component', () => {
    cy.get('cx-input').should('exist');
  });

  it('Should enable the Connect button when the site URL is valid', () => {
    cy.get('cx-input').shadow().find('input').type('https://qa-latest.orangelogic.com/');
    cy.get('cx-button').should('not.have.attr', 'disabled');
  });

  it('Should show wating for authorisation screen', () => {
    cy.get('cx-input').shadow().find('input').type('https://qa-latest.orangelogic.com/');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('cx-typography').contains('Please authorize').should('exist');
    cy.get('cx-button').eq(0).click();
  });

  it('Should show error for invalid url', () => {
    cy.get('cx-input').shadow().find('input').type('invalid-url');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('cx-button').contains('Retry').click();
  });

  it('Should show the second input after click the hidden button for 5 times', () => {
    const hiddenBox = cy.get('button');
    for (let i = 0; i < 5; i++) {
      hiddenBox.click();
    }
    cy.get('cx-input').eq(1).should('exist');
  });

  it('Should not show the second input if the hidden button is not clicked 5 times in 2 seconds', () => {
    const hiddenBox = cy.get('button');
    for (let i = 0; i < 4; i++) {
      hiddenBox.click();
    }
    cy.wait(2000); // wait for 2 seconds
    cy.get('cx-input').should('have.length', 1);
    cy.get('cx-input').eq(1).should('not.exist');
  });

  it('Should request authentication with session', () => {
    const hiddenBox = cy.get('button');
    for (let i = 0; i < 5; i++) {
      hiddenBox.click();
    }
    cy.get('cx-input').eq(1).should('exist');
    cy.get('cx-input').eq(1).shadow().find('input').type('session-id');
    cy.get('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}https://qa-latest.orangelogic.com/');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('cx-typography').contains('Please authorize').should('exist');
  });
});
