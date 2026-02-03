import { MediaType } from '@/types/search';
import AssetPreview from './AssetPreview';

const image =
  'https://placehold.co/93x93';
const video = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
describe('AssetPreview Component', () => {
  it('renders the AssetPreview component', () => {
    cy.mount(
      <AssetPreview
        asset={{
          docType: MediaType.Image,
          docSubType: 'Standard Image',
          extension: 'png',
          height: '475',
          id: '2Y1FQEX9S35',
          identifier: 'X1UBRR',
          imageUrl: image,
          originalUrl: image,
          name: '006.png',
          scrubUrl: '',
          size: '141.18 KB',
          tags: '',
          width: '475',
          allowATSLink: true,
          recordId: 'Q0LDO000001895618',
          inColdStorage: false,
        }}
        imageLoaded={true}
        slot="image"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('img').should('have.attr', 'src', image);
  });

  it('renders the AssetPreview component with video', () => {
    cy.mount(
      <AssetPreview
        asset={{
          docType: MediaType.Video,
          docSubType: 'Standard Video',
          extension: 'mp4',
          height: '475',
          id: '2Y1FQEX9S35',
          identifier: 'X1UBRR',
          imageUrl: image,
          originalUrl: image,
          name: '006.mp4',
          scrubUrl: video,
          size: '141.18 KB',
          tags: '',
          width: '475',
          allowATSLink: true,
          recordId: 'Q0LDO000001895618',
          inColdStorage: false,
        }}
        imageLoaded={true}
        slot="video"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('video').should('have.attr', 'src', video);
  });

  it('renders skeleton when imageLoaded is false', () => {
    cy.mount(
      <AssetPreview
        asset={{
          docType: MediaType.Image,
          docSubType: 'Standard Image',
          extension: 'png',
          height: '475',
          id: '2Y1FQEX9S35',
          identifier: 'X1UBRR',
          imageUrl: image,
          originalUrl: image,
          name: '006.png',
          scrubUrl: '',
          size: '141.18 KB',
          tags: '',
          width: '475',
          allowATSLink: true,
          recordId: 'Q0LDO000001895618',
          inColdStorage: false,
        }}
        imageLoaded={false}
        slot="image"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('cx-skeleton').should('exist');
  });

  it('renders other view when url is empty', () => {
    cy.mount(
      <AssetPreview
        asset={{
          docType: MediaType.Image,
          docSubType: 'Standard Image',
          extension: 'png',
          height: '475',
          id: '2Y1FQEX9S35',
          identifier: 'X1UBRR',
          imageUrl: '',
          originalUrl: '',
          name: '006.png',
          scrubUrl: '',
          size: '141.18 KB',
          tags: '',
          width: '475',
          allowATSLink: true,
          recordId: 'Q0LDO000001895618',
          inColdStorage: false,
        }}
        imageLoaded={true}
        slot="image"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('cx-icon').should('exist');
  });
});
