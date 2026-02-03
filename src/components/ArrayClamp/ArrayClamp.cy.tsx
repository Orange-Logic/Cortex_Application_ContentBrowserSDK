/// <reference types="cypress" />

import ArrayClamp from '@/components/ArrayClamp';


describe('ArrayClamp', () => {
  it('Should hide 3 items', () => {
    cy.mount(<div style={{
      width: '300px',
    }}><ArrayClamp>
        {[1, 2, 3, 4, 5].map((item) => (
          <span key={item} style={{
            width: '120px',
            display: 'inline-block',
          }}>{item}</span>
        ))}
      </ArrayClamp></div>);
    cy.get('.clamped').should('have.length', 3);
  });
});