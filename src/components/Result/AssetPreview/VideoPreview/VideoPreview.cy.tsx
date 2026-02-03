import ViewPreview from './VideoPreview';

// Generate a test for the VideoPreview component using Cypress

describe('VideoPreview', () => {
  it('renders a video element with the correct attributes', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://placehold.co/93x93"
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

  it('renders thumbnail image when thumbnailOnly is true', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={true}
        thumbnailUrl="https://placehold.co/93x93"
        loaded={true}
        onLoaded={() => {}}
        onError={() => {}}
      />,
    );
    cy.get('img').should('have.attr', 'src', 'https://placehold.co/93x93');
  });

  it('calls onLoaded when the video loads', () => {
    // Create a spy for the onLoaded function
    const onLoadedSpy = cy.spy().as('onLoaded');
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://placehold.co/93x93"
        loaded={true}
        onLoaded={onLoadedSpy}
        onError={() => {}}
      />,
    );
    cy.get('video').trigger('loadeddata');
    cy.get('@onLoaded').should('have.been.calledOnce');
  });

  it('triggers onMouseMove when mouse moves over the video', () => {
    cy.mount(
      <ViewPreview
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        thumbnailOnly={false}
        thumbnailUrl="https://placehold.co/93x93"
        loaded={true}
        onLoaded={() => {}}
        onError={() => {}}
      />,
    );

    // Listeners are on the overlay's parent, not the first div
    const container = cy.get('.asset-preview__representative-overlay').parent();

    // Stub video duration so updateVideoProgress runs (video often doesn't load in component tests)
    cy.get('video').then(($video) => {
      const el = $video[0];
      Object.defineProperty(el, 'duration', { value: 100, configurable: true });
    });

    container.trigger('mousemove', { clientX: 100, clientY: 100, offsetX: 50 });
    cy.get('video').should('have.prop', 'currentTime').and('be.greaterThan', 0);

    container.trigger('mouseenter', { clientX: 100, clientY: 100, offsetX: 50 });
    cy.get('video').should('have.prop', 'currentTime').and('be.greaterThan', 0);

    container.trigger('mouseleave', { clientX: 100, clientY: 100, offsetX: 50 });
    cy.get('video').should('have.prop', 'currentTime', 0);
  });
});
