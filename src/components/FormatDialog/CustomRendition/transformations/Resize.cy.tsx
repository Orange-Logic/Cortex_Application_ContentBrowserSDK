/// <reference types="cypress" />

import Resize from './Resize';
import { Unit } from '@/types/assets';
import { useState } from 'react';


const ResizeWrapper = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [unit, setUnit] = useState(Unit.Pixel);

  const [lastAppliedSetting] = useState({
    [Unit.Pixel]: {
      width: 100,
      height: 100,
      percentageWidth: 100,
      percentageHeight: 100,
      x: 0,
      y: 0,
      unit: Unit.Pixel,
    },
    [Unit.AspectRatio]: {
      width: 1,
      height: 1,
      percentageWidth: 100,
      percentageHeight: 100,
      x: 0,
      y: 0,
      unit: Unit.AspectRatio,
    },
  });

  return (
    <Resize
      open={true}
      width={width}
      height={height}
      lastAppliedSetting={lastAppliedSetting}
      maxWidth={1000}
      maxHeight={1000}
      unit={unit}
      onChange={(w, h, u) => {
        setWidth(w);
        setHeight(h);
        setUnit(u);
      }}
      onApply={() => { }}
    />
  );
};

describe('Resize', () => {

  beforeEach(() => {
    cy.mount(<ResizeWrapper />);
    cy.waitForCustomElement('cx-select');
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-icon-button');
  });

  it('Should change height when width changed (Linked)', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}200');
    cy.wait(500);
    cy.get('cx-input').eq(1).should('have.value', '200');
  });

  it('Should change width when height changed (Linked)', () => {
    cy.get('cx-input').eq(1).shadow().find('input').type('{selectall}{backspace}300');
    cy.get('cx-input').eq(0).should('have.value', '300');
  });

  it('Should change unit when unit changed', () => {
    cy.get('cx-select').eq(0).click();
    cy.get('cx-option[value="aspect-ratio"]').click();
    cy.get('cx-input').eq(0).should('have.value', '1');
    cy.get('cx-input').eq(1).should('have.value', '1');
  });

  it('Should keep height the same when width changed (Un-linked)', () => {
    cy.get('cx-icon-button').click();
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}200');
    cy.get('cx-input').eq(1).should('have.value', '100');
  });

});