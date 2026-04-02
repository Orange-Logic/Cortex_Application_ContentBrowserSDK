/// <reference types="cypress" />

import { getRequestUrl } from './getRequestUrl';
import { deleteData, getData, storeData } from './storage';
import { generateRandomString } from './string';
import { isPromise } from './function';

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

describe('Utils - string', () => {
  it('generates string with 10 characters', () => {
    const result = generateRandomString(10);
    expect(result.length).to.equal(10);
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

describe('Utils - function', () => {
  it('returns true when value is a promise', () => {
    const promise = Promise.resolve('test');
    const notPromise = 'test';

    expect(isPromise(promise)).to.equal(true);
    expect(isPromise(notPromise)).to.equal(false);
  });
});
