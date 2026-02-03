/// <reference types="cypress" />
import ImagePreview from './ImagePreview';

describe('ImagePreview', () => {
  it('renders an image', () => {
    cy.mount(<ImagePreview alt="test" url="https://example.com/image.jpg" loaded={true} onError={() => {}} onLoaded={() => {}} />);
    cy.get('img').should('have.attr', 'src', 'https://example.com/image.jpg');
  });
    
  it('calls onLoad when the image loads', () => {
    const onLoadedSpy = cy.spy().as('onLoaded');
    cy.mount(<ImagePreview alt="test" originalUrl="https://example.com/image.jpg" url="https://example.com/image.jpg" loaded={true} onError={() => {}} onLoaded={onLoadedSpy} />);
    cy.get('img').eq(0).should('have.attr', 'src', 'https://example.com/image.jpg').trigger('load');
    cy.get('@onLoaded').should('have.been.calledOnce');
  });
});