/// <reference types="cypress" />

import { MediaType } from '@/types/search';
import Previewer from './Previewer';

describe('Previewer', () => {
  it('renders the image', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          imageUrl:
            'https://placehold.co/93x93',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('img').should('exist');
  });

  it('renders Other View when isError is true', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          imageUrl: 'data:image/png;base64,invalid',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('cx-icon[name="file"]', { timeout: 5000 }).should('exist');
  });

  it('renders video when docType is video', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          docType: MediaType.Video,
          videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('video').should('exist');
  });

  it('calls onLoad when image is loaded', () => {
    const onLoad = cy.stub().as('onLoad');
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          imageUrl: 'https://placehold.co/400x600/png',
        }}
        onLoad={onLoad}
      />,
    );
    cy.get('img')
      .should('exist')
      .then(() => {
        cy.get('@onLoad').should('have.been.calledOnce');
      });
  });

  it('calls onLoad when video is loaded', () => {
    const onLoad = cy.stub().as('onLoad');
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          docType: MediaType.Video,
          videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        onLoad={onLoad}
      />,
    );
    cy.get('video')
      .should('exist')
      .then(() => {
        cy.get('@onLoad').should('have.been.calledOnce');
      });
  });

  it('does not show image when loadable is false', () => {
    cy.mount(
      <Previewer
        loadable={false}
        asset={{
          imageUrl:
            'https://placehold.co/93x93',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('img').should('not.exist');
  });

  it('renders other preview', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          docType: MediaType.Multimedia,
        }}
      />,
    );
    cy.get('div').should('contain', 'Multimedia');
  });
});
