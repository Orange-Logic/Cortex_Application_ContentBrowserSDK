/// <reference types="cypress" />

import Facet from './Facet';

describe('Facet', () => {
  it('Should render nothing when no facet is provided', () => {
    cy.mount(<Facet facet={{}} type="" collections={[]} displayName=''/>);
    cy.get('cx-details').should('not.exist');
  });

  it('Should render the facet with some items', () => {
    const data = {
      type: 'example',
      facet: {
        item1: 10,
        item2: 20,
      },
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet facet={data.facet} type={data.type} collections={[]} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-details').should('exist');
    cy.get('cx-tree').should('exist');
    cy.get('cx-tree-item').should('have.length', Object.keys(data.facet).length);
  });

  it('Should render the facet with selected items', () => {
    const data = {
      type: 'example',
      facet: {
        item1: 10,
        item2: 20,
      },
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet facet={data.facet} type={data.type} collections={['item1']} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-details').should('exist');
    cy.get('cx-tree').should('exist');
    cy.get('cx-tree-item').should('have.length', Object.keys(data.facet).length);
  });

  it('should render the facet with loading state', () => {
    const data = {
      type: 'example',
      facet: {
        item1: 10,
        item2: 20,
      },
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet facet={data.facet} type={data.type} collections={[]} loading={true} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-spinner');
    cy.get('cx-spinner').should('exist');
  });

  it('should render the facet with subtype', () => {
    const data = {
      type: 'example',
      facet: {
        'item1 >> item1.1': 10,
        'item1 >> item1.2': 5,
        item2: 20,
      },
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet facet={data.facet} type={data.type} collections={[]} loading={false} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-tree-item')
      .eq(0)
      .find('cx-tree-item')
      .should('have.attr', 'data-value', 'item1 >> item1.1');
  });
});
