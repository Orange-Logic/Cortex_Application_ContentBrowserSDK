/// <reference types="cypress" />

import Loader from '@/components/Loader';


describe('Loader', () => {

  it('shows cx-spinner', () => {
    cy.mount(<Loader />);
    cy.get('cx-spinner').should('exist');
  });

  it('shows button with link', () => {
    cy.mount(<Loader message='https://example.com/'/>);

    cy.get('cx-button').should('exist');
  });

  it('shows text', () => {
    cy.mount(<Loader message='Loading'/>);

    cy.get('cx-typography').should('exist');
  });

});