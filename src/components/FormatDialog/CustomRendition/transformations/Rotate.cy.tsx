/// <reference types="cypress" />

import Rotate from './Rotate';
import { useState } from 'react';


const RotateWrapper = () => {
  const [rotation, setRotation] = useState(0);
  return (
    <Rotate
      open={true}
      rotation={rotation}
      onChange={(r) => {
        setRotation(r);
      }}
      onApply={() => { }}
    />
  );
};

describe('Rotate', () => {

  beforeEach(() => {
    cy.mount(<RotateWrapper />);
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-button');
  });

  it('rotates 90deg when the rotate right button is clicked', () => {
    cy.get('cx-button').eq(1).click();
    cy.get('cx-input').shadow().find('input').should('have.value', '90');
  });

  it('does not rotate when the rotate left button is clicked and the value is 0', () => {
    cy.get('cx-button').eq(0).click();
    cy.get('cx-input').shadow().find('input').should('have.value', '0');
  });

  it('sets rotation to 360 when the value is larger than 360', () => {
    cy.get('cx-input').shadow().find('input').type('{selectall}{backspace}400');
    cy.get('cx-input').should('have.value', '360');
  });
 
  it('sets rotation to 0 when the value is smaller than 0', () => {
    cy.get('cx-input').shadow().find('input').type('{selectall}{backspace}-1');
    cy.get('cx-input').should('have.value', '0');
  });

});