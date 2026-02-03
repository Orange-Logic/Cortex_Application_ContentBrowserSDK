import { useState } from 'react';
import CustomRendition from './CustomRendition';
import { Unit } from '@/types/assets';

const extensions = [
  {
    displayName: 'JPG',
    value: '.jpg',
  },
  {
    displayName: 'JPEG',
    value: '.jpeg',
  },
  {
    displayName: 'TIF',
    value: '.tif',
  },
  {
    displayName: 'TIFF',
    value: '.tiff',
  },
  {
    displayName: 'PSD',
    value: '.psd',
  },
  {
    displayName: 'PNG',
    value: '.png',
  },
  {
    displayName: 'GIF',
    value: '.gif',
  },
  {
    displayName: 'BMP',
    value: '.bmp',
  },
  {
    displayName: 'PCD',
    value: '.pcd',
  },
  {
    displayName: 'PCX',
    value: '.pcx',
  },
  {
    displayName: 'PNM',
    value: '.pnm',
  },
  {
    displayName: 'TGA',
    value: '.tga',
  },
  {
    displayName: 'ART',
    value: '.art',
  },
  {
    displayName: 'AVIF',
    value: '.avif',
  },
  {
    displayName: 'BMP2',
    value: '.bmp2',
  },
  {
    displayName: 'BMP3',
    value: '.bmp3',
  },
  {
    displayName: 'CIN',
    value: '.cin',
  },
  {
    displayName: 'CMYK',
    value: '.cmyk',
  },
  {
    displayName: 'CMYKA',
    value: '.cmyka',
  },
  {
    displayName: 'DCX',
    value: '.dcx',
  },
  {
    displayName: 'DDS',
    value: '.dds',
  },
  {
    displayName: 'DPX',
    value: '.dpx',
  },
  {
    displayName: 'FITS',
    value: '.fits',
  },
  {
    displayName: 'GRAY',
    value: '.gray',
  },
  {
    displayName: 'HDR',
    value: '.hdr',
  },
  {
    displayName: 'HRZ',
    value: '.hrz',
  },
  {
    displayName: 'JNG',
    value: '.jng',
  },
  {
    displayName: 'JP2',
    value: '.jp2',
  },
  {
    displayName: 'J2C',
    value: '.j2c',
  },
  {
    displayName: 'J2K',
    value: '.j2k',
  },
  {
    displayName: 'MIFF',
    value: '.miff',
  },
  {
    displayName: 'MONO',
    value: '.mono',
  },
  {
    displayName: 'MNG',
    value: '.mng',
  },
  {
    displayName: 'MPC',
    value: '.mpc',
  },
  {
    displayName: 'MTV',
    value: '.mtv',
  },
  {
    displayName: 'OTB',
    value: '.otb',
  },
  {
    displayName: 'PALM',
    value: '.palm',
  },
  {
    displayName: 'PAM',
    value: '.pam',
  },
  {
    displayName: 'PBM',
    value: '.pbm',
  },
  {
    displayName: 'PCDS',
    value: '.pcds',
  },
  {
    displayName: 'PCL',
    value: '.pcl',
  },
  {
    displayName: 'PDB',
    value: '.pdb',
  },
  {
    displayName: 'PFM',
    value: '.pfm',
  },
  {
    displayName: 'PGM',
    value: '.pgm',
  },
  {
    displayName: 'PICON',
    value: '.picon',
  },
  {
    displayName: 'PICT',
    value: '.pict',
  },
  {
    displayName: 'PNG8',
    value: '.png8',
  },
  {
    displayName: 'PNG00',
    value: '.png00',
  },
  {
    displayName: 'PNG24',
    value: '.png24',
  },
  {
    displayName: 'PNG32',
    value: '.png32',
  },
  {
    displayName: 'PNG48',
    value: '.png48',
  },
  {
    displayName: 'PNG64',
    value: '.png64',
  },
  {
    displayName: 'PPM',
    value: '.ppm',
  },
  {
    displayName: 'PS',
    value: '.ps',
  },
  {
    displayName: 'PS2',
    value: '.ps2',
  },
  {
    displayName: 'PS3',
    value: '.ps3',
  },
  {
    displayName: 'PSB',
    value: '.psb',
  },
  {
    displayName: 'PTIF',
    value: '.ptif',
  },
  {
    displayName: 'RGB',
    value: '.rgb',
  },
  {
    displayName: 'RGBA',
    value: '.rgba',
  },
  {
    displayName: 'SGI',
    value: '.sgi',
  },
  {
    displayName: 'SUN',
    value: '.sun',
  },
  {
    displayName: 'SVG',
    value: '.svg',
  },
  {
    displayName: 'UIL',
    value: '.uil',
  },
  {
    displayName: 'UYVY',
    value: '.uyvy',
  },
  {
    displayName: 'VICAR',
    value: '.vicar',
  },
  {
    displayName: 'VIFF',
    value: '.viff',
  },
  {
    displayName: 'WBMP',
    value: '.wbmp',
  },
  {
    displayName: 'WEBP',
    value: '.webp',
  },
  {
    displayName: 'XBM',
    value: '.xbm',
  },
  {
    displayName: 'XPM',
    value: '.xpm',
  },
  {
    displayName: 'YCBCR',
    value: '.ycbcr',
  },
  {
    displayName: 'YCBCRA',
    value: '.ycbcra',
  },
  {
    displayName: 'JPE',
    value: '.jpe',
  },
  {
    displayName: 'Automatic',
    value: '.auto',
  },
];
const availableProxies = [
  {
    proxyName: 'TRX',
    proxyLabel: 'Highest Quality',
    formatHeight: 0,
    formatWidth: 0,
    height: 0,
    width: 0,
    extension: null,
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/13u27iw28868i3705lkt7v6e053u54v4.png',
    cdnName: null,
    id: '9e1186ab-4827-4104-b9af-20b5c3796eaf',
  },
  {
    proxyName: 'TR7',
    proxyLabel: '192px fixed height',
    formatHeight: 192,
    formatWidth: 191,
    height: 192,
    width: 1024,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/u21h17h665g426601g4j766b33rup246.jpg',
    cdnName: null,
    id: '5dc3f48f-6a4f-45c0-b1b6-dba7886bb5ca',
  },
  {
    proxyName: 'TR4',
    proxyLabel: '352px fixed height',
    formatHeight: 352,
    formatWidth: 350,
    height: 352,
    width: 1280,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/56wfu58242s464d8y735k2iq8jt74iy7.jpg',
    cdnName: null,
    id: '7665fe6b-5e90-48d4-9768-175092913ec5',
  },
  {
    proxyName: 'TR1',
    proxyLabel: 'Medium res.',
    formatHeight: 530,
    formatWidth: 528,
    height: 1200,
    width: 1200,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/hcu03yv54125l5470q5kmjwfk2kdpj8v.jpg',
    cdnName: null,
    id: '3f48f5d3-9368-4637-841c-948836f6d0c3',
  },
  {
    proxyName: 'TR1_COMP',
    proxyLabel: 'Medium res. comp.',
    formatHeight: 530,
    formatWidth: 528,
    height: 600,
    width: 800,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/7f1f2a0qgai21q7p3hfm0k6g0l2sg801.jpg',
    cdnName: null,
    id: '4d62d873-f5d8-4483-9c2b-52205dee5b8e',
  },
  {
    proxyName: 'CMS1',
    proxyLabel: 'CMS 2000x2000',
    formatHeight: 530,
    formatWidth: 528,
    height: 2000,
    width: 2000,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/q323w22uehcn2o716ihy0o8jed5a3524.jpg',
    cdnName: null,
    id: 'edd20178-fe97-427f-a26d-0991cfa200e7',
  },
  {
    proxyName: 'CMS2',
    proxyLabel: 'CMS 1000x1000',
    formatHeight: 530,
    formatWidth: 528,
    height: 1000,
    width: 1000,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/dr0ft88dh61i2m6iw664yql7m245i876.jpg',
    cdnName: null,
    id: '3844792f-6bc9-4c85-a90d-a3e58ee0a74c',
  },
  {
    proxyName: 'CMS3',
    proxyLabel: 'CMS 500x500',
    formatHeight: 500,
    formatWidth: 498,
    height: 500,
    width: 500,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/yy5qhuweoc8086omlsjcku67yrwefwx4.jpg',
    cdnName: null,
    id: '178bdc2c-40f0-4c57-a765-dfa7aae8ac22',
  },
  {
    proxyName: 'CMS4',
    proxyLabel: 'CMS 250x250',
    formatHeight: 250,
    formatWidth: 249,
    height: 250,
    width: 250,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/14jofx06ocp665685m3nn6l8cae5m5p6.jpg',
    cdnName: null,
    id: 'cff4f571-6055-4bac-9f5e-c2d783afefed',
  },
  {
    proxyName: 'CMS5',
    proxyLabel: 'CMS 125x125',
    formatHeight: 125,
    formatWidth: 124,
    height: 125,
    width: 125,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/p0f221o8bi7hh47q7agr123r064608sf.jpg',
    cdnName: null,
    id: 'e01e5777-3b21-451c-baf5-1e2ea761e621',
  },
  {
    proxyName: 'TRAdmin3',
    proxyLabel: '570x570 (Doc management)',
    formatHeight: 530,
    formatWidth: 528,
    height: 570,
    width: 570,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/63i6gm0mdgn73m248jq840vv43j3y02t.jpg',
    cdnName: null,
    id: 'eda30284-c5a2-4f8e-962b-1df4e1ac521c',
  },
  {
    proxyName: 'TRAdmin6',
    proxyLabel: '265x265 (Doc management)',
    formatHeight: 265,
    formatWidth: 264,
    height: 265,
    width: 265,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/nij5uf8720ck5re16yl4iuti2kagb4b7.jpg',
    cdnName: null,
    id: 'e125288a-ff93-42af-81ba-59b1fe117880',
  },
  {
    proxyName: 'TRAdmin12',
    proxyLabel: '120x120 (Doc management)',
    formatHeight: 120,
    formatWidth: 119,
    height: 120,
    width: 120,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/kw2f1s8e27h58vddj2a32b7ob0717l64.jpg',
    cdnName: null,
    id: '41326fed-5ec6-4566-8f13-f6a4490eb274',
  },
  {
    proxyName: 'TRAdmin20',
    proxyLabel: '40x40 (Doc management)',
    formatHeight: 40,
    formatWidth: 39,
    height: 40,
    width: 40,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/1473kvs7iv452pl5ko54r5644ao4ljj1.jpg',
    cdnName: null,
    id: 'ce54e66a-5c78-49d6-98d0-a91262fbc505',
  },
  {
    proxyName: 'TEMP',
    proxyLabel: 'TEMP',
    formatHeight: 500,
    formatWidth: 498,
    height: 500,
    width: 500,
    extension: '.jpg',
    permanentLink:
      'https://cdn-qa-latest.orangelogic.com/AssetLink/y35nd1v61r234r07s6b1e4b28g705547.jpg',
    cdnName: null,
    id: '4e13ce05-5664-4a54-876f-f4400b64345a',
  },
];
const CustomRenditionWrapper = () => {
  const [activeSetting, setActiveSetting] = useState('resize');
  const [imageSize, setImageSize] = useState({ width: 1000, height: 1000, x: 0, y: 0, rotate: 0 });
  const [resize, setResize] = useState({ width: 500, height: 500, unit: Unit.Pixel });
  const [quality, setQuality] = useState(100);
  const [keepMetadata, setKeepMetadata] = useState(true);
  const [crop, setCrop] = useState({
    width: 500,
    height: 500,
    unit: Unit.Pixel,
    percentageWidth: 50,
    percentageHeight: 50,
    x: 0,
    y: 0,
  });
  const [extension, setExtension] = useState('jpg');
  const [rotation, setRotation] = useState(0);
  return (
    <CustomRendition
      keepMetadata={keepMetadata}
      quality={quality}
      onKeepMetadataChange={() => {
        setKeepMetadata(!keepMetadata);
      }}
      onQualityChange={(q) => {
        setQuality(q);
      }}
      proxy="9e1186ab-4827-4104-b9af-20b5c3796eaf"
      availableProxies={availableProxies}
      extensions={extensions}
      activeSetting={activeSetting}
      imageSize={imageSize}
      resize={resize}
      crop={crop}
      extension={extension}
      rotation={rotation}
      onResizeChange={(width, height, unit, shouldApply) => {
        setResize({ width, height, unit });
        if (shouldApply) {
          setImageSize({ ...imageSize, width, height });
        }
      }}
      onCropChange={(width, height, unit) => {
        setCrop({ width, height, unit, percentageWidth: 50, percentageHeight: 50, x: 0, y: 0 });
      }}
      onRotateChange={(r) => {
        setRotation(r);
      }}
      onExtensionChange={(ex) => {
        setExtension(ex);
      }}
      lastAppliedCrop={{
        [Unit.Pixel]: {
          width: 500,
          height: 500,
          percentageWidth: 50,
          percentageHeight: 50,
          x: 0,
          y: 0,
          unit: Unit.Pixel,
        },
        [Unit.AspectRatio]: {
          width: 1,
          height: 1,
          percentageWidth: 50,
          percentageHeight: 50,
          x: 0,
          y: 0,
          unit: Unit.AspectRatio,
        },
      }}
      lastAppliedResize={{
        [Unit.Pixel]: { width: 500, height: 500, unit: Unit.Pixel },
        [Unit.AspectRatio]: { width: 1, height: 1, unit: Unit.AspectRatio },
      }}
      onViewChange={(view) => {
        setActiveSetting(view);
      }}
      onFormatChange={() => {}}
    />
  );
};

describe('CustomRendition', () => {
  beforeEach(() => {
    cy.mount(<CustomRenditionWrapper />);
    cy.waitForCustomElement('cx-select');
    cy.waitForCustomElement('cx-input');
    cy.waitForCustomElement('cx-details');
  });

  it('Should show resize by default', () => {
    cy.get('cx-details[data-value="resize"]').should('have.attr', 'open');
  });

  it('Should show crop when crop is selected', () => {
    cy.get('cx-details[data-value="crop"]').click();
    cy.get('cx-details[data-value="crop"]').should('have.attr', 'open');
  });

  it('Should not show anything when no option is selected', () => {
    cy.wait(500);
    cy.get('cx-details[data-value="resize"] cx-space').eq(0).click();
    cy.get('cx-details[data-value="crop"]').should('not.have.attr', 'open');
    cy.get('cx-details[data-value="resize"]').should('not.have.attr', 'open');
    cy.get('cx-details[data-value="rotate"]').should('not.have.attr', 'open');
  });

  it('Should resize the image when click apply', () => {
    cy.get('cx-details[data-value="resize"] cx-input')
      .eq(0)
      .shadow()
      .find('input')
      .type('{selectall}{backspace}200');
    cy.wait(500);
    cy.get('cx-details[data-value="resize"] cx-input').eq(1).should('have.value', '200');
    cy.get('cx-details[data-value="resize"] cx-button').eq(0).click();
  });
});
