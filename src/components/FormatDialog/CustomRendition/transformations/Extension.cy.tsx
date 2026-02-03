/// <reference types="cypress" />

import Extension from './Extension';
import { useState } from 'react';
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

const RotateWrapper = () => {
  const [extension, setExtension] = useState('jpg');
  return (
    <Extension
      extension={extension}
      onChange={(r) => {
        setExtension(r);
      }}
      extensions={extensions}
    />
  );
};

describe('Extension', () => {
  beforeEach(() => {
    cy.mount(<RotateWrapper />);
    cy.waitForCustomElement('cx-select');
  });

  it('Should have correct value when clicking PNG', () => {
    cy.get('cx-select').eq(0).click();
    cy.get('cx-option').eq(1).click();
    cy.get('cx-select').eq(0).should('have.value', extensions[1].value);
  });
});
