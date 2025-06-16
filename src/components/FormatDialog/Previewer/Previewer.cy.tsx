/// <reference types="cypress" />

import { MediaType } from '@/types/search';
import Previewer from './Previewer';

describe('Previewer', () => {
  it('Should render the image', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          imageUrl:
            'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('img').should('exist');
  });

  it('Should render Other View when isError is true', () => {
    cy.mount(
      <Previewer
        loadable={true}
        asset={{
          imageUrl:
            'https://wwwa.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('cx-icon[name="file"]').should('exist');
  });

  it('Should render video when docType is video', () => {
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

  it('Should call onLoad when image is loaded', () => {
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

  it('Should call onLoad when video is loaded', () => {
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

  it('Should not show image when loadable is false', () => {
    cy.mount(
      <Previewer
        loadable={false}
        asset={{
          imageUrl:
            'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png',
        }}
        onLoad={() => {}}
      />,
    );
    cy.get('img').should('not.exist');
  });

  it('Should render other preview', () => {
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
