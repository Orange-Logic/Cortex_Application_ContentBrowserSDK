import { expect } from '@open-wc/testing';

import { appendPathAndQuery } from './appendPathAndQuery';

describe('appendPathAndQuery', () => {
  const transformationPath = '/t/c_w_360,c_h_203,c_x_0,c_y_0,c_whu_pixel/Q0L269608.jpg';

  it('appends the path when the base URL has no query string', () => {
    const result = appendPathAndQuery(
      'https://cdn.example.com/AssetLink/wl6xyoe8vk08i70h4u6t1bf4sgw33g47.jpg',
      transformationPath,
    );

    expect(result).to.equal(
      'https://cdn.example.com/AssetLink/wl6xyoe8vk08i70h4u6t1bf4sgw33g47.jpg'
      + '/t/c_w_360,c_h_203,c_x_0,c_y_0,c_whu_pixel/Q0L269608.jpg',
    );
  });

  // L-428JQO: the server adds ?UseSession=<id> to links generated under a parameter session. The
  // transformation must still land in the path, otherwise it becomes part of the query value and the
  // server serves the untransformed original.
  it('keeps the transformation in the path when the base URL already has a query string', () => {
    const result = appendPathAndQuery(
      'https://cdn.example.com/AssetLink/wl6xyoe8vk08i70h4u6t1bf4sgw33g47.jpg?UseSession=2Z0Z4YF699MM',
      transformationPath,
      ['UseSession=2Z0Z4YF699MM'],
    );

    expect(result).to.equal(
      'https://cdn.example.com/AssetLink/wl6xyoe8vk08i70h4u6t1bf4sgw33g47.jpg'
      + '/t/c_w_360,c_h_203,c_x_0,c_y_0,c_whu_pixel/Q0L269608.jpg'
      + '?UseSession=2Z0Z4YF699MM',
    );
    // The pre-fix bug produced two '?' and pushed '/t/' into the query value.
    expect(result.split('?')).to.have.length(2);
    expect(result.indexOf('/t/')).to.be.lessThan(result.indexOf('?'));
  });

  it('does not duplicate a parameter the base URL already carries', () => {
    const result = appendPathAndQuery(
      'https://cdn.example.com/AssetLink/abc.jpg?UseSession=OLD',
      '',
      ['UseSession=NEW'],
    );

    expect(result).to.equal('https://cdn.example.com/AssetLink/abc.jpg?UseSession=NEW');
  });

  it('preserves unrelated parameters already on the base URL', () => {
    const result = appendPathAndQuery(
      'https://cdn.example.com/AssetLink/abc.jpg?Profile=QA&UseSession=OLD',
      '/t/r_a_90/ID.jpg',
      ['UseSession=NEW', 'utm_source=cbsdk'],
    );

    expect(result).to.equal(
      'https://cdn.example.com/AssetLink/abc.jpg/t/r_a_90/ID.jpg'
      + '?Profile=QA&UseSession=NEW&utm_source=cbsdk',
    );
  });

  it('keeps a fragment last', () => {
    const result = appendPathAndQuery(
      'https://cdn.example.com/AssetLink/abc.jpg?UseSession=S#page=2',
      '/t/r_a_90/ID.jpg',
      ['Tracking=1'],
    );

    expect(result).to.equal(
      'https://cdn.example.com/AssetLink/abc.jpg/t/r_a_90/ID.jpg?UseSession=S&Tracking=1#page=2',
    );
  });

  it('appends the path before a fragment when there is no query string', () => {
    const result = appendPathAndQuery('https://cdn.example.com/AssetLink/abc.jpg#page=2', '/t/r_a_90/ID.jpg');

    expect(result).to.equal('https://cdn.example.com/AssetLink/abc.jpg/t/r_a_90/ID.jpg#page=2');
  });

  it('returns the base URL unchanged when there is nothing to add', () => {
    const result = appendPathAndQuery('https://cdn.example.com/AssetLink/abc.jpg', '');

    expect(result).to.equal('https://cdn.example.com/AssetLink/abc.jpg');
  });
});
