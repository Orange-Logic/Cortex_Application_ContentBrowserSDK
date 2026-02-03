import { Unit } from '@/types/assets';
import CropPreviewer, { CropPreviewerHandle } from './CropPreviewer';
import { useRef, useState } from 'react';

const CropPreviewerWrapper = () => {
  const [cropper, setCropper] = useState({
    width: 294,
    height: 31,
    percentageWidth: 50,
    percentageHeight: 100 / 3,
    x: 0,
    y: 0,
    unit: Unit.Pixel,
  });
  const [resultImage, setResultImage] = useState<string | null>(null);

  const [disabled, setDisabled] = useState(false);
  const cropHandleRef = useRef<CropPreviewerHandle>(null);

  return (
    <>
      <CropPreviewer
        ref={cropHandleRef}
        disabled={disabled}
        loadable={true}
        image={{
          url: 'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png',
          originalUrl:
            'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png',
          extension: 'jpg',
          width: 588,
          height: 93,
          x: 0,
          y: 0,
          rotation: 0,
        }}
        selectedProxy=""
        resizer={{
          width: 588,
          height: 93,
        }}
        cropper={cropper}
        rotation={90}
        onCropComplete={(croppedArea) => {
          setCropper({
            ...cropper,
            x: croppedArea.x,
            y: croppedArea.y,
            percentageWidth: croppedArea.width,
            percentageHeight: croppedArea.height,
          });
        }}
        onLoadingChange={() => {}}
      />
      <button
        onClick={async () => {
          if (cropHandleRef.current) {
            const newImage = await cropHandleRef.current.applyCrop();
            setResultImage(newImage);
          }
        }}>
        Apply crop
      </button>
      <button
        onClick={async () => {
          if (cropHandleRef.current) {
            const newImage = await cropHandleRef.current.applyRotation();
            setResultImage(newImage);
          }
        }}>
        Apply rotate
      </button>
      <button
        onClick={() => {
          setDisabled((prev) => !prev);
        }}>
        Disabled
      </button>
      {resultImage && <img src={resultImage} alt="Result" />}
    </>
  );
};

describe('CropPreviewer', () => {
  beforeEach(() => {
    cy.mount(<CropPreviewerWrapper />);
  });

  it('Should render the image', () => {
    cy.get('img').should('exist');
  });

  it('Should apply crop and show result image', () => {
    cy.get('button').contains('Apply crop').click();
    cy.get('img[alt="Result"]').should('exist');
  });

  it('should apply rotation and show result image', () => {
    cy.get('button').contains('Apply rotate').click();
    cy.get('img[alt="Result"]').should('exist');
  });

  it('should disable the cropper', () => {
    cy.get('button').contains('Disabled').click();
    cy.get('.reactEasyCrop_CropAreaGrid').should('have.css', 'display', 'none');
  });
});
