/// <reference types="cypress" />

import NoResult from './NoResult';

describe('NoResult', () => {
  it('Should render NoResult component', () => {
    cy.mount(<NoResult icon="file" message="No results found" />);
    cy.get("cx-icon[name='file']").should('exist');
    cy.get('div').should('contain', 'No results found');
  });
});
