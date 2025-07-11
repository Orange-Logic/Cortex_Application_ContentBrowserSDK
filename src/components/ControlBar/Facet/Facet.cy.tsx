/// <reference types="cypress" />

import Facet from './Facet';

describe('Facet', () => {
  it('Should render nothing when no facet is provided', () => {
    cy.mount(<Facet values={[]} type="" collections={[]} displayName=''/>);
    cy.get('cx-details').should('not.exist');
  });

  it('Should render the facet with some items', () => {
    const data = {
      type: 'example',
      values: [
        {
          'displayValue': 'images',
          'value': 'images',
          'count': 50,
        },
        {
          'displayValue': 'others',
          'value': 'others',
          'count': 9,
        },
        {
          'displayValue': 'videos',
          'value': 'videos',
          'count': 5,
        },
        {
          'displayValue': '3d assets',
          'value': '3d assets',
          'count': 4,
        },
        {
          'displayValue': 'audio',
          'value': 'audio',
          'count': 3,
        },
        {
          'displayValue': 'image',
          'value': 'image',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 1s',
          'value': 'images>>image 1s',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 2s',
          'value': 'images>>image 2s',
          'count': 1,
        },
      ],
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet values={data.values} type={data.type} collections={[]} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-details').should('exist');
    cy.get('cx-tree').should('exist');
    cy.get('cx-tree-item').should('have.length', data.values.length);
  });

  it('Should render the facet with selected items', () => {
    const data = {
      type: 'example',
      values: [
        {
          'displayValue': 'images',
          'value': 'images',
          'count': 50,
        },
        {
          'displayValue': 'others',
          'value': 'others',
          'count': 9,
        },
        {
          'displayValue': 'videos',
          'value': 'videos',
          'count': 5,
        },
        {
          'displayValue': '3d assets',
          'value': '3d assets',
          'count': 4,
        },
        {
          'displayValue': 'audio',
          'value': 'audio',
          'count': 3,
        },
        {
          'displayValue': 'image',
          'value': 'image',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 1s',
          'value': 'images>>image 1s',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 2s',
          'value': 'images>>image 2s',
          'count': 1,
        },
      ],
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet values={data.values} type={data.type} collections={['item1']} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-details').should('exist');
    cy.get('cx-tree').should('exist');
    cy.get('cx-tree-item').should('have.length', data.values.length);
  });

  it('should render the facet with loading state', () => {
    const data = {
      type: 'example',
      values: [
        {
          'displayValue': 'images',
          'value': 'images',
          'count': 50,
        },
        {
          'displayValue': 'others',
          'value': 'others',
          'count': 9,
        },
        {
          'displayValue': 'videos',
          'value': 'videos',
          'count': 5,
        },
        {
          'displayValue': '3d assets',
          'value': '3d assets',
          'count': 4,
        },
        {
          'displayValue': 'audio',
          'value': 'audio',
          'count': 3,
        },
        {
          'displayValue': 'image',
          'value': 'image',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 1s',
          'value': 'images>>image 1s',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 2s',
          'value': 'images>>image 2s',
          'count': 1,
        },
      ],
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet values={data.values} type={data.type} collections={[]} loading={true} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-spinner');
    cy.get('cx-spinner').should('exist');
  });

  it('should render the facet with subtype', () => {
    const data = {
      type: 'example',
      values: [
        {
          'displayValue': 'images',
          'value': 'images',
          'count': 50,
        },
        {
          'displayValue': 'others',
          'value': 'others',
          'count': 9,
        },
        {
          'displayValue': 'videos',
          'value': 'videos',
          'count': 5,
        },
        {
          'displayValue': '3d assets',
          'value': '3d assets',
          'count': 4,
        },
        {
          'displayValue': 'audio',
          'value': 'audio',
          'count': 3,
        },
        {
          'displayValue': 'image',
          'value': 'image',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 1s',
          'value': 'images>>image 1s',
          'count': 1,
        },
        {
          'displayValue': 'images>>image 2s',
          'value': 'images>>image 2s',
          'count': 1,
        },
      ],
      displayName: 'Example Facet', 
    };
    cy.mount(<Facet values={data.values} type={data.type} collections={[]} loading={false} displayName={data.displayName}/>);
    cy.waitForCustomElement('cx-details');
    cy.waitForCustomElement('cx-tree');
    cy.waitForCustomElement('cx-tree-item');
    cy.get('cx-tree-item')
      .eq(0)
      .find('cx-tree-item')
      .should('have.attr', 'data-value', 'item1 >> item1.1');
  });
});
