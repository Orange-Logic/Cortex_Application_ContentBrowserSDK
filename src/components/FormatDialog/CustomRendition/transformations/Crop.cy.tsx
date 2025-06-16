/// <reference types="cypress" />

import Crop from './Crop';
import { Unit } from '@/types/assets';
import { useState } from 'react';


const CropWrapper = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [unit, setUnit] = useState(Unit.Pixel);
  const [disabledCropApply] = useState(false);

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
    <Crop
      open={true}
      width={width}
      height={height}
      disabledCropApply={disabledCropApply}
      lastAppliedSetting={lastAppliedSetting}
      maxWidth={1000}
      maxHeight={1000}
      percentageWidth={100}
      percentageHeight={100}
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

describe('Crop', () => {

  beforeEach(() => {
    cy.mount(<CropWrapper />);
    cy.waitForCustomElement('cx-select');
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-icon-button');
  });
  it('Should change height when width changed (Linked)', () => {
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}200');
    cy.get('cx-input').eq(1).should('have.value', '200');
  });

  it('Should change width when height changed (Linked)', () => {
    cy.get('cx-input').eq(1).shadow().find('input').type('{selectall}{backspace}300');
    cy.get('cx-input').eq(0).should('have.value', '300');
  });

  it('Should change unit when unit changed', () => {
    cy.get('cx-select').eq(1).click();
    cy.get('cx-option[value="aspect-ratio"]').click();
    cy.get('cx-input').eq(0).should('have.value', '1');
    cy.get('cx-input').eq(1).should('have.value', '1');
  });

  it('Should keep height the same when width changed (Un-linked)', () => {
    cy.get('cx-icon-button').click();
    cy.get('cx-input').eq(0).shadow().find('input').type('{selectall}{backspace}200');
    cy.get('cx-input').eq(1).should('have.value', '100');
  });

  it('should change width, height when mode changed', () => {
    cy.get('cx-select').eq(0).click();
    cy.get('cx-option[value="2:3"]').click();
    cy.get('cx-input').eq(0).should('have.value', '667');
    cy.get('cx-input').eq(1).should('have.value', '1000');
  
  });
});