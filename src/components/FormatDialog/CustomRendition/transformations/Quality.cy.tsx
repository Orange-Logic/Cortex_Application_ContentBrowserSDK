/// <reference types="cypress" />

import Quality from './Quality';
import { useState } from 'react';

const QualityWrapper = () => {
  const [quality, setQuality] = useState(100);

  return (
    <>
      <Quality
        open={true}
        quality={quality}
        onChange={(v) => {
          setQuality(v);
        }}
      />
      <p>Result: {quality}</p>
    </>
  );
};

describe('Quality', () => {
  beforeEach(() => {
    cy.mount(<QualityWrapper />);
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-button');
  });
  it('changes quality', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}200');
    cy.get('cx-input').eq(0).should('have.value', '200');
  });

  it('does not allow quality less than 0', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}-10');
    cy.get('cx-button').eq(0).should('have.attr', 'disabled');
  });
  it('does not allow quality greater than 100', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}150');
    cy.get('cx-button').eq(0).should('have.attr', 'disabled');
  });
  it('does not allow quality to be empty', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}');
    cy.get('cx-button').eq(0).should('have.attr', 'disabled');
  });
  it('changes the result when apply button is clicked', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}50');
    cy.get('cx-button').eq(0).click();
    cy.get('p').should('contain', 'Result: 50');
  });
});
