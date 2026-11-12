import { expect } from '@open-wc/testing';

import { AssetLinkFormatPart } from '@/types/content-browser';

import {
  parseAutoModeNames, parseModes, parseParts, toContentBrowserParameters,
} from './metadata.utils';

const BUILT_IN_AUTO_NAMES = ['azureai', 'optical', 'googleai', 'smartswatch'];

describe('parseAutoModeNames', () => {
  const cases: Array<{ name: string; raw: unknown; expected: string[] }> = [
    { expected: BUILT_IN_AUTO_NAMES, name: 'missing → built-in four', raw: undefined },
    { expected: BUILT_IN_AUTO_NAMES, name: 'N/A → built-in four', raw: 'N/A' },
    { expected: BUILT_IN_AUTO_NAMES, name: 'not a string → built-in four', raw: 42 },
    {
      expected: [...BUILT_IN_AUTO_NAMES, 'newai'],
      name: 'AutoCropMode keys, lower-cased, added to the built-in four',
      raw: 'SmartSwatch=SmartSwatchAutoCrop\r\nNewAI=NewAiAutoCrop\n Optical = OpticalAutoCrop ',
    },
  ];

  cases.forEach(({ expected, name, raw }) => {
    it(name, () => {
      expect(parseAutoModeNames(raw)).to.deep.equal(expected);
    });
  });
});

describe('parseModes', () => {
  const cases: Array<{ name: string; raw: unknown; expected: Array<{ label: string; value: string }> | undefined }> = [
    { expected: undefined, name: 'missing → undefined', raw: undefined },
    { expected: undefined, name: 'N/A → undefined', raw: 'N/A' },
    { expected: undefined, name: 'blank → undefined', raw: ' \r\n ' },
    { expected: undefined, name: 'not a string → undefined', raw: ['free=Free'] },
    { expected: undefined, name: '<option> markup → undefined', raw: '<option value="free">Free</option>' },
    { expected: undefined, name: 'only auto modes → undefined', raw: 'AzureAI=Azure AI\nOptical=Smart focus' },
    {
      expected: [{ label: 'Freeform', value: 'free' }, { label: 'Widescreen (16:9)', value: '16:9' }],
      name: '\\r\\n and \\n line breaks, blank lines skipped',
      raw: 'free=Freeform\r\n\r\n16:9=Widescreen (16:9)\n',
    },
    {
      expected: [{ label: 'a=b', value: 'x' }],
      name: 'splits at the first =',
      raw: 'x=a=b',
    },
    {
      expected: [{ label: 'center', value: 'center' }],
      name: 'no = → value as label',
      raw: 'center',
    },
    {
      expected: [{ label: 'Manual focus', value: 'manual' }],
      name: 'trims both sides',
      raw: '  manual  =  Manual focus  ',
    },
    {
      expected: [{ label: 'manual', value: 'manual' }],
      name: 'empty label → value',
      raw: 'manual=',
    },
    {
      expected: [{ label: 'Manual focus', value: 'manual' }],
      name: 'empty value skipped',
      raw: '=Nothing\nmanual=Manual focus',
    },
    {
      expected: [{ label: 'First', value: '1:1' }],
      name: 'repeated value keeps the first',
      raw: '1:1=First\n1:1=Second',
    },
    {
      expected: [{ label: 'Freeform', value: 'free' }],
      name: 'drops auto modes, case-insensitive',
      raw: 'free=Freeform\nazureai=Azure AI\nGOOGLEAI=Google AI\nSmartSwatch=Swatch\nNewAI=New',
    },
  ];

  cases.forEach(({ expected, name, raw }) => {
    it(name, () => {
      expect(parseModes(raw, [...BUILT_IN_AUTO_NAMES, 'newai'])).to.deep.equal(expected);
    });
  });
});

describe('parseParts', () => {
  const cases: Array<{ name: string; raw: unknown; expected: AssetLinkFormatPart[] | undefined }> = [
    { expected: undefined, name: 'missing → undefined', raw: undefined },
    { expected: undefined, name: 'N/A → undefined', raw: 'N/A' },
    { expected: undefined, name: 'only dimensions → undefined', raw: 'dimensions' },
    { expected: undefined, name: 'not a string → undefined', raw: null },
    {
      expected: [
        AssetLinkFormatPart.Proxy,
        AssetLinkFormatPart.Crop,
        AssetLinkFormatPart.Resize,
        AssetLinkFormatPart.Rotate,
        AssetLinkFormatPart.Quality,
        AssetLinkFormatPart.Metadata,
      ],
      name: 'COR list, in order',
      raw: 'proxy\r\ncrop\r\nresize\r\nrotate\r\nquality\r\nmetadata',
    },
    {
      expected: [AssetLinkFormatPart.Crop, AssetLinkFormatPart.Proxy],
      name: 'keeps the given order',
      raw: 'crop\nproxy',
    },
    {
      expected: [AssetLinkFormatPart.Crop, AssetLinkFormatPart.Quality],
      name: 'drops dimensions, unknown, wrongly cased and repeated names',
      raw: 'dimensions\ncrop\nCrop\nborder\n crop \nquality',
    },
  ];

  cases.forEach(({ expected, name, raw }) => {
    it(name, () => {
      expect(parseParts(raw)).to.deep.equal(expected);
    });
  });
});

describe('toContentBrowserParameters', () => {
  it('maps the format panel parameters', () => {
    const parameters = toContentBrowserParameters({
      AssetLinkFormatCropModes: 'free=Freeform\r\n16:9=Widescreen (16:9)\r\nAzureAI=Azure AI',
      AssetLinkFormatFocusModes: 'manual=Manual focus\r\ncenter=Center focus\r\nOptical=Smart focus\r\nCustomAI=Custom',
      AssetLinkFormatParts: 'proxy\r\ncrop\r\ndimensions\r\nmetadata',
      AutoCropMode: 'CustomAI=CustomAiAutoCrop',
      EnableATSInGetLink: 'True',
    });

    expect(parameters.ATSEnabled).to.equal(true);
    expect(parameters.cropModes).to.deep.equal([
      { label: 'Freeform', value: 'free' },
      { label: 'Widescreen (16:9)', value: '16:9' },
    ]);
    expect(parameters.focusModes).to.deep.equal([
      { label: 'Manual focus', value: 'manual' },
      { label: 'Center focus', value: 'center' },
    ]);
    expect(parameters.parts).to.deep.equal([
      AssetLinkFormatPart.Proxy,
      AssetLinkFormatPart.Crop,
      AssetLinkFormatPart.Metadata,
    ]);
  });

  // An older Cortex does not expose the new keys, and may not expose EnableATSInGetLink either:
  // a missing key must not throw, or every parameter falls back to its default.
  it('leaves the format panel parameters unset when Cortex does not send them', () => {
    const parameters = toContentBrowserParameters({ CollectionSubtypeCriteria: 'Containers>>Virtual folders' });

    expect(parameters.ATSEnabled).to.equal(false);
    expect(parameters.collectionPath).to.equal('containers>>virtual folders');
    expect(parameters.cropModes).to.equal(undefined);
    expect(parameters.focusModes).to.equal(undefined);
    expect(parameters.parts).to.equal(undefined);
  });
});
