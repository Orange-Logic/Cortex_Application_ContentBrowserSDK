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
  it('Should check if an array has elements', () => {
    const arr = [1, 2, 3];

    cy.wrap(hasElements(arr)).should('be.true');
  });

  it('Should return a uniqueArray', () => {
    const arr1 = [1, 2, 3, 3, 4, 5, 5];

    cy.wrap(uniqueArray(arr1, (element) => element.toString())).should(
      'deep.equal',
      [1, 2, 3, 4, 5],
    );
    cy.wrap(uniqueArray(arr1)).should('deep.equal', [1, 2, 3, 4, 5]);
  });
});

describe('Utils - getRequestUrl', () => {
  it('Should return a valid URL with token', () => {
    const result = getRequestUrl('https://example.com', '/api/v1/resource', 'my-token');
    const expected = 'https://example.com/api/v1/resource?Token=my-token';
    expect(result).to.equal(expected);
  });

  it('Should replace the token if it already exists', () => {
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
  it('Should return the correct media icon', () => {
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
  it('Should convert width height in pixel to aspect ration', () => {
    const width = 1920;
    const height = 1080;
    const expectedAspectRatio = '16:9';
    const ratio = convertPixelsToAspectRatio(width, height);
    const result = ratio.width + ':' + ratio.height;
    expect(result).to.equal(expectedAspectRatio);
  });
});

describe('Utils - Rotate', () => {
  it('Should rotate image 30 deg', () => {
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

  it('Should rotate image 90 deg', () => {
    const width = 1920;
    const height = 1080;
    const result = rotateBox(width, height, 90);
    const expectedWidth = 1080;
    const expectedHeight = 1920;
    expect(result.width).to.equal(Math.round(expectedWidth));
    expect(result.height).to.equal(Math.round(expectedHeight));
  });

  it('Should rotate image 180 deg', () => {
    const width = 1920;
    const height = 1080;
    const result = rotateBox(width, height, 180);
    expect(result.width).to.equal(width);
    expect(result.height).to.equal(height);
  });
});

describe('Utils - string', () => {
  it('Should generate string with 10 characters', () => {
    const result = generateRandomString(10);
    expect(result.length).to.equal(10);
  });

  it('Should say an empty string is null or white space', () => {
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
  it('Should store date to SessionStorage', () => {
    storeData('testKey', 'testValue', 'SessionStorage', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', 'testValue');
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('Should store date to LocalStorage', () => {
    storeData('testKey', 'testValue', 'LocalStorage', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', 'testValue');
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('Should store date to Cookies', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', 'testValue');
  });

  it('Should delete data from all storages', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);
    storeData('testKey', 'testValue', 'SessionStorage', 1000);
    storeData('testKey', 'testValue', 'LocalStorage', 1000);

    deleteData('testKey');
    cy.wrap(getData('testKey', 'SessionStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'LocalStorage')).should('equal', null);
    cy.wrap(getData('testKey', 'Cookies')).should('equal', null);
  });

  it('Should find the key in all storages', () => {
    storeData('testKey', 'testValue', 'Cookies', 1000);

    cy.wrap(getData('testKey')).should('equal', 'testValue');
  });

  it('Should return null if the value is expired', () => {
    // Store data normally
    storeData('testKey', 'testValue', 'LocalStorage', 1000); // 1 second TTL

    // Manually expire the data by setting an expired timestamp
    const pastDate = new Date();
    pastDate.setTime(pastDate.getTime() - 2000); // 2 seconds ago
    localStorage.setItem('testKey_valid_until', pastDate.toUTCString());

    // Should return null immediately since data is expired (specify LocalStorage to avoid fallback)
    getData('testKey', 'LocalStorage').then((result) => {
      expect(result).to.equal(null);

      // Verify the expired data was cleaned up
      expect(localStorage.getItem('testKey')).to.equal(null);
      expect(localStorage.getItem('testKey_valid_until')).to.equal(null);
    });
  });
});

describe('Utils - image', () => {
  const image =
    'https://www.orangelogic.com/hs-fs/hubfs/raw_assets/public/Orangelogic_December2021/images/logo.png?height=93&name=logo.png';
  const width = 100;
  const height = 100;
  it('Should resize image to 100x100', () => {
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

  it('Should resize image to 80x80', () => {
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

  it('Should crop image and return a url', () => {
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

  it('Should rotate image and return a url', () => {
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

  it('Should calculateAspectRatioFit correctly', () => {
    const result1 = calculateAspectRatioFit(1920, 1080, 800, 600);
    expect(result1.width).to.equal(1440);
    expect(result1.height).to.equal(1080);

    const result2 = calculateAspectRatioFit(1920, 1080, 300, 100);
    expect(result2.width).to.equal(1920);
    expect(result2.height).to.equal(640);
  });
});

describe('Utils - function', () => {
  it('Should check if a value is a promise', () => {
    const promise = Promise.resolve('test');
    const notPromise = 'test';

    expect(isPromise(promise)).to.equal(true);
    expect(isPromise(notPromise)).to.equal(false);
  });
});
