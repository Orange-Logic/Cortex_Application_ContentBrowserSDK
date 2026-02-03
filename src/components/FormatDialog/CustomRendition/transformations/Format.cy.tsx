/// <reference types="cypress" />

import { Proxy } from '@/types/search';
import Format from './Format';
import { useState } from 'react';

const formats: Proxy[] = [
  {
    cdnName: 'default',
    extension: '.jpg',
    id: 'default',
    proxyLabel: 'Default Format',
    proxyName: 'image',
    formatWidth: 100,
    formatHeight: 100,
    height: 100,
    permanentLink: null,
    width: 100,
  },
  {
    cdnName: 'default 2',
    extension: '.jpg',
    id: 'default-2',
    proxyLabel: 'Default Format 2',
    proxyName: 'image',
    formatWidth: 100,
    formatHeight: 100,
    height: 100,
    permanentLink: null,
    width: 100,
  },
];

const FormatWrapper = () => {
  const [format, setFormat] = useState('');

  return (
    <>
      <Format
        open={true}
        format={format}
        formats={formats}
        onApply={(newFormat) => {
          setFormat(newFormat.id);
        }}
      />
      <p>Result: {format}</p>
    </>
  );
};

describe('Format', () => {
  beforeEach(() => {
    cy.mount(<FormatWrapper />);
    cy.waitForCustomElement('cx-select');
    cy.waitForCustomElement('cx-button');
  });
  it('Should change format', () => {
    cy.get('cx-select').eq(0).click();
    cy.get('cx-option').eq(1).click();
    cy.get('cx-select').eq(0).should('have.value', formats[1].id);
  });

  it('Should change the result when apply button is clicked', () => {
    cy.get('cx-select').eq(0).click();
    cy.get('cx-option').eq(1).click();
    cy.get('cx-button').eq(0).click();
    cy.get('p').should('contain', `Result: ${formats[1].id}`);
  });
});
