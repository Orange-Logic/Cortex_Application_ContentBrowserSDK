import { MediaType } from '@/types/search';
import AssetPreview from './AssetPreview';

const image =
  'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png';
const video = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
describe('AssetPreview Component', () => {
  it('should render the AssetPreview component', () => {
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
        }}
        imageLoaded={true}
        slot="image"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('img').should('have.attr', 'src', image);
  });

  it('should render the AssetPreview component with video', () => {
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
        }}
        imageLoaded={true}
        slot="video"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('video').should('have.attr', 'src', video);
  });

  it('Should render skeleton when imageLoaded is false', () => {
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
        }}
        imageLoaded={false}
        slot="image"
        thumbnailOnly={false}
        onLoaded={() => {}}
      />,
    );

    cy.get('cx-skeleton').should('exist');
  });

  it('Should render other view when url is empty', () => {
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
