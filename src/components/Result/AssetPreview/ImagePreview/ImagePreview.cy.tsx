import ImagePreview from './ImagePreview';

describe('ImagePreview', () => {
  it('should render an image', () => {
    cy.mount(<ImagePreview alt="test" url="https://example.com/image.jpg" loaded={true} onError={() => {}} onLoaded={() => {}} />);
    cy.get('img').should('have.attr', 'src', 'https://example.com/image.jpg');
  });
    
  it('should call onLoad when the image loads', () => {
    const onLoadedSpy = cy.spy().as('onLoaded');
    cy.mount(<ImagePreview alt="test" originalUrl="https://example.com/image.jpg" url="https://example.com/image.jpg" loaded={true} onError={() => {}} onLoaded={onLoadedSpy} />);
    cy.get('img').eq(0).trigger('load');
    cy.get('@onLoaded').should('have.been.calledOnce');
  });
    

});