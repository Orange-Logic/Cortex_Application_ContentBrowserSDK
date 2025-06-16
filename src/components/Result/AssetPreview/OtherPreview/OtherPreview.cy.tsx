import { MediaType } from '@/types/search';
import OtherPreview from './OtherPreview';

describe('OtherPreview', () => {
  it('should render the correct icon and text', () => {
    cy.mount(<OtherPreview type={MediaType.Widget}>PDF</OtherPreview>);
    cy.get('cx-icon').should('have.attr', 'name', 'widgets');
    cy.contains('PDF').should('be.visible');
  });
    
  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    cy.mount(<OtherPreview style={customStyle}>Custom Style</OtherPreview>);
    cy.get('div').eq(1).should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });
});