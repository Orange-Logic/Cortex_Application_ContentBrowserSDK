/// <reference types="cypress" />

import Loader from '@/components/Loader';


describe('Loader', () => {

  it('Should show cx-spinner', () => {
    cy.mount(<Loader />);
    cy.get('cx-spinner').should('exist');
  });

  it('Should show button with link', () => {
    cy.mount(<Loader message='https://www.orangelogic.com/'/>);

    cy.get('cx-button').should('exist');
  });

  it('Should show text', () => {
    cy.mount(<Loader message='Loading'/>);

    cy.get('cx-typography').should('exist');
  });

});