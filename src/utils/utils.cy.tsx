/// <reference types="cypress" />

import { MediaType } from '@/types/search';

import { hasElements, uniqueArray } from './array';
import { getRequestUrl } from './getRequestUrl';
import { getMediaIcon } from './icon';
import { convertPixelsToAspectRatio } from './number';
import { rotateBox } from './rotate';
import { deleteData, getData, storeData } from './storage';
import { generateRandomString, isNullOrWhiteSpace } from './string';
import { calculateAspectRatioFit, cropImage, resizeImage, rotateImage } from './image';
import { isPromise } from './function';

describe('Utils - array', () => {
  it('returns true when array has elements', () => {
    const arr = [1, 2, 3];

    cy.wrap(hasElements(arr)).should('be.true');
  });

  it('returns a unique array', () => {
    const arr1 = [1, 2, 3, 3, 4, 5, 5];

    cy.wrap(uniqueArray(arr1, (element) => element.toString())).should(
      'deep.equal',
      [1, 2, 3, 4, 5],
    );
    cy.wrap(uniqueArray(arr1)).should('deep.equal', [1, 2, 3, 4, 5]);
  });
});

describe('Utils - getRequestUrl', () => {
  it('returns a valid URL with token', () => {
    const result = getRequestUrl('https://example.com', '/api/v1/resource', 'my-token');
    const expected = 'https://example.com/api/v1/resource?Token=my-token';
    expect(result).to.equal(expected);
  });

  it('replaces the token if it already exists', () => {
    const result = getRequestUrl(
      'https://example.com',
      '/api/v1/resource?Token=old-token',
      'new-token',
    );
    const expected = 'https://example.com/api/v1/resource?Token=new-token';
    expect(result).to.equal(expected);
  });
});

describe('Utils - icon', () => {
  it('returns the correct media icon', () => {
    const types = Object.values(MediaType);
    const icons = [...types, undefined].map((type) => getMediaIcon(type));
    const expectedIcons = [
      'audio_file',
      'album',
      'widgets',
      'perm_media',
      'article',
      'video_file',
      'photo',
      'file',
    ];
    expect(icons.sort()).to.deep.equal(expectedIcons.sort());
  });
});

describe('Utils - number', () => {
  it('converts width height in pixel to aspect ratio', () => {
    const width = 1920;
    const height = 1080;
    const expectedAspectRatio = '16:9';
    const ratio = convertPixelsToAspectRatio(width, height);
    const result = ratio.width + ':' + ratio.height;
    expect(result).to.equal(expectedAspectRatio);
  });
});

describe('Utils - Rotate', () => {
  it('rotates image 30 deg', () => {
    const width = 1920;
    const height = 1080;
    const result = rotateBox(width, height, 30);
    const expectedWidth =
      1920 * Math.cos((30 * Math.PI) / 180) + 1080 * Math.sin((30 * Math.PI) / 180);
    const expectedHeight =
      1920 * Math.sin((30 * Math.PI) / 180) + 1080 * Math.cos((30 * Math.PI) / 180);
    expect(result.width).to.equal(Math.round(expectedWidth));
    expect(result.height).to.equal(Math.round(expectedHeight));
  });

  it('rotates image 90 deg', () => {
    const width = 1920;
    const height = 1080;
    const result = rotateBox(width, height, 90);
    const expectedWidth = 1080;
    const expectedHeight = 1920;
    expect(result.width).to.equal(Math.round(expectedWidth));
    expect(result.height).to.equal(Math.round(expectedHeight));
  });

  it('rotates image 180 deg', () => {
    const width = 1920;
    const height = 1080;
    const result = rotateBox(width, height, 180);
    expect(result.width).to.equal(width);
    expect(result.height).to.equal(height);
  });
});

describe('Utils - string', () => {
  it('generates string with 10 characters', () => {
    const result = generateRandomString(10);
    expect(result.length).to.equal(10);
  });

  it('identifies an empty string as null or white space', () => {
    expect(isNullOrWhiteSpace('')).to.equal(true);
    expect(isNullOrWhiteSpace(' ')).to.equal(true);
    expect(isNullOrWhiteSpace(null)).to.equal(true);
    expect(isNullOrWhiteSpace(undefined)).to.equal(true);
  });
});

describe('Utils - storage', () => {
  beforeEach(() => {
    // Clear all storage before each test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it('stores data to SessionStorage', () => {
    storeData('testKey', 'testValue', 'SessionStorage', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', 'testValue');
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('stores data to LocalStorage', () => {
    storeData('testKey', 'testValue', 'LocalStorage', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', 'testValue');
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('stores data to Cookies', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', 'testValue');
  });

  it('deletes data from all storages', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);
    storeData('testKey', 'testValue', 'SessionStorage', 1000);
    storeData('testKey', 'testValue', 'LocalStorage', 1000);

    deleteData('testKey');
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('finds the key in all storages', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);

    cy.wrap(getData('testKey')).should('equal', 'testValue');
  });

  it('returns null if the value is expired', () => {
    // Store data normally
    storeData('testKey', 'testValue', 'LocalStorage', 1000); // 1 second TTL

    // Manually expire the data by setting an expired timestamp
    const pastDate = new Date();
    pastDate.setTime(pastDate.getTime() - 2000); // 2 seconds ago
    localStorage.setItem('testKey_valid_until', pastDate.toUTCString());

    // Should return null immediately since data is expired (specify LocalStorage to avoid fallback)
    return getData('testKey', 'LocalStorage').then((result) => {
      expect(result).to.equal(null);

      // Verify the expired data was cleaned up
      expect(localStorage.getItem('testKey')).to.equal(null);
      expect(localStorage.getItem('testKey_valid_until')).to.equal(null);
    });
  });
});

describe('Utils - image', () => {
  const image =
    'https://placehold.co/93x93';
  const width = 100;
  const height = 100;
  it('resizes image to 100x100', () => {
    cy.wrap(resizeImage(image, width, height, 200, 200)).then((data) => {
      const result = data as {
        url: string;
        width: number;
        height: number;
      };

      expect(result.width).to.equal(width);
      expect(result.height).to.equal(height);
      expect(result.url).to.include('data:image/jpeg;base64,');
    });
  });

  it('resizes image to 80x80', () => {
    cy.wrap(resizeImage(image, width, height, 80, 80)).then((data) => {
      const result = data as {
        url: string;
        width: number;
        height: number;
      };

      expect(result.width).to.equal(80);
      expect(result.height).to.equal(80);
      expect(result.url).to.include('data:image/jpeg;base64,');
    });
  });

  it('crops image and returns a url', () => {
    cy.wrap(
      cropImage(
        {
          url: image,
          width: 100,
          height: 100,
        },
        { x: 0, y: 0, width: 50, height: 50 },
      ),
    ).then((data) => {
      const result = data as string;
      expect(result).to.include('data:image/jpeg;base64,');
    });
  });

  it('rotates image and returns a url', () => {
    cy.wrap(
      rotateImage(
        {
          url: image,
          width: 100,
          height: 100,
        },
        90,
      ),
    ).then((data) => {
      const result = data as string;
      expect(result).to.include('data:image/jpeg;base64,');
    });
  });

  it('calculates aspect ratio fit correctly', () => {
    const result1 = calculateAspectRatioFit(1920, 1080, 800, 600);
    expect(result1.width).to.equal(1440);
    expect(result1.height).to.equal(1080);

    const result2 = calculateAspectRatioFit(1920, 1080, 300, 100);
    expect(result2.width).to.equal(1920);
    expect(result2.height).to.equal(640);
  });
});

describe('Utils - function', () => {
  it('returns true when value is a promise', () => {
    const promise = Promise.resolve('test');
    const notPromise = 'test';

    expect(isPromise(promise)).to.equal(true);
    expect(isPromise(notPromise)).to.equal(false);
  });
});
