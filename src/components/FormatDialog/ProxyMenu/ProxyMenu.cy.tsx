import { useEffect, useRef, useState } from 'react';
import ProxyMenu from './ProxyMenu';
import { CxSelectEvent } from '@/web-component';

export const ProxyWrapper = () => {
  const [selectedItem, setSelectedItem] = useState('png');
  const [isDefined, setIsDefined] = useState(false);
  const [items] = useState([
    {
      name: 'JPEG',
      value: 'jpeg',
      width: '1000',
      height: '1000',
      docType: 'image/jpeg',
    },
    {
      name: 'PNG',
      value: 'png',
      width: '1000',
      height: '1000',
      docType: 'image/png',
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    customElements.whenDefined('cx-menu').then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    if (!isDefined || !containerRef.current) {
      return;
    }
    const container = containerRef.current;
    const onProxySelect = (e: CxSelectEvent) => {
      const value = e.detail.item.value;
      setSelectedItem(value);
    };
    container.addEventListener('cx-select', onProxySelect);

    return () => {
      container.removeEventListener('cx-select', onProxySelect);
    };
  }, [isDefined]);

  return (
    <div ref={containerRef}>
      <ProxyMenu items={items} selectedItem={selectedItem} />
    </div>
  );
};

describe('ProxyMenu', () => {
  beforeEach(() => {
    cy.mount(<ProxyWrapper />);
    cy.waitForCustomElement('cx-menu-item');
    cy.waitForCustomElement('cx-menu');
  });

  it('Should render 2 items', () => {
    cy.get('cx-menu-item').should('have.length', 2);
  });

  it('Should select JPEG when clicked', () => {
    cy.get('cx-menu-item').first().click().find('cx-icon').should('exist');
  });
});
