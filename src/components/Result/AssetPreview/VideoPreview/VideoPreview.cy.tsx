import ViewPreview from './VideoPreview';

// Generate a test for the VideoPreview component using Cypress

describe('VideoPreview', () => {
  it('should render a video element with the correct attributes', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png"
        loaded={true}
        onLoaded={() => {}}
        onError={() => {}}
      />,
    );
    cy.get('video').should(
      'have.attr',
      'src',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    );
  });

  it('Should render thumbnail image when thumbnailOnly is true', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={true}
        thumbnailUrl="https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png"
        loaded={true}
        onLoaded={() => {}}
        onError={() => {}}
      />,
    );
    cy.get('img').should('have.attr', 'src', 'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png');
  });

  it('Should call onLoaded when the video loads', () => {
    // Create a spy for the onLoaded function
    const onLoadedSpy = cy.spy().as('onLoaded');
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png"
        loaded={true}
        onLoaded={onLoadedSpy}
        onError={() => {}}
      />,
    );
    cy.get('video').trigger('loadeddata');
    cy.get('@onLoaded').should('have.been.calledOnce');
  });

  it('Should trigger onMouseMove when mouse moves over the video', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png"
        loaded={true}
        onLoaded={() => {}}
        onError={() => {}}
      />,
    );

    cy.get('div').eq(0).trigger('mousemove', { clientX: 100, clientY: 100, offsetX: 50 });
    cy.get('video').should('have.prop', 'currentTime').and('be.greaterThan', 0);
    cy.get('div').eq(0).trigger('mouseenter', { clientX: 100, clientY: 100, offsetX: 50 });
    cy.get('video').should('have.prop', 'currentTime').and('be.greaterThan', 0);
    cy.get('div').eq(0).trigger('mouseleave', { clientX: 100, clientY: 100, offsetX: 50 });

  });
  
});
