import { useState } from 'react';
import TrackingParameters from './TrackingParameters';
import styled from 'styled-components';

const Container = styled.div`
  cx-space {
    width: 100%;
  }
`;

const TrackingParametersWrapper = () => {
  const [values, setValues] = useState([
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ]);

  return (
    <Container>
      <TrackingParameters
        values={values}
        onChange={(newValues) => {
          setValues(newValues);
        }}
      />
    </Container>
  );
};

describe('TrackingParameters', () => {
  beforeEach(() => {
    cy.mount(<TrackingParametersWrapper />);
    cy.waitForCustomElement('cx-input-group');
    cy.waitForCustomElement('cx-icon-button');
    cy.waitForCustomElement('cx-button');
  });

  it('Should add a new parameter when clicking the Add button', () => {
    cy.get('cx-button').contains('Add parameter').click();
    cy.get('cx-input-group').should('have.length', 3);
  });

  it('Should remove a parameter when clicking the close button', () => {
    cy.get('cx-icon-button').eq(0).click();
    cy.get('cx-input-group').should('have.length', 1);
  });

  it('Should update the key and value of a parameter', () => {
    cy.get('cx-input-group')
      .eq(0)
      .get('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}newKey');
    cy.get('cx-input-group')
      .eq(0)
      .get('cx-input')
      .eq(1)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}newValue');
    cy.get('cx-input-group')
      .eq(0)
      .get('cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .should('have.value', 'newKey');
    cy.get('cx-input-group')
      .eq(0)
      .get('cx-input')
      .eq(1)
      .shadow()
      .find('input')
      .should('have.value', 'newValue');
  });
});
